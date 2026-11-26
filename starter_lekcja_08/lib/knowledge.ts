import { embed, embedMany } from "ai";
import { embeddingModel } from "@/lib/model";
import { supabaseAdmin } from "@/lib/supabase";

// ============================================================
// BAZA WIEDZY (RAG) — dokumenty, z których agent bierze odpowiedzi o firmie.
// Tabela documents: jeden dokument = jeden wiersz (id, title, created_at).
// Tabela chunks: fragmenty dokumentu (document_id, chunk_index, content, embedding).
// Embedding to lista liczb opisująca znaczenie fragmentu. Tworzy ją model embeddingów —
// ten sam przy zapisie dokumentów i przy pytaniach (lib/model.ts).
// ============================================================

export const MAX_TITLE = 200;
export const MAX_CONTENT = 20000;
const MAX_CHUNK = 800; // dłuższy akapit dzielimy na granicy zdania
const MATCH_COUNT = 3; // tyle fragmentów dostaje agent do jednego pytania
const BACKFILL_LIMIT = 100; // tyle starych fragmentów bez embeddingu uzupełniamy przy jednym imporcie

// Błąd z komunikatem po polsku, który można pokazać na stronie.
export class KnowledgeError extends Error {}

// Dzieli tekst na fragmenty: jeden akapit (tekst oddzielony pustą linią) = jeden fragment.
// Krótkich akapitów nie łączymy. Akapit dłuższy niż 800 znaków dzielimy na granicy zdania.
export function splitIntoChunks(content: string): string[] {
  const paragraphs = content
    .replace(/\r\n?/g, "\n")
    .split(/\n[ \t]*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  for (const paragraph of paragraphs) {
    if (paragraph.length <= MAX_CHUNK) {
      chunks.push(paragraph);
      continue;
    }
    // Zdania dokładamy do fragmentu, dopóki mieści się w limicie.
    let current = "";
    for (const sentence of paragraph.split(/(?<=[.!?…])\s+/)) {
      if (current && current.length + 1 + sentence.length > MAX_CHUNK) {
        chunks.push(current);
        current = "";
      }
      current = current ? `${current} ${sentence}` : sentence;
      // Jedno zdanie dłuższe niż limit (rzadkie) tniemy po prostu co 800 znaków.
      while (current.length > MAX_CHUNK) {
        chunks.push(current.slice(0, MAX_CHUNK).trim());
        current = current.slice(MAX_CHUNK).trim();
      }
    }
    if (current) chunks.push(current);
  }
  return chunks;
}

// Import dokumentu: zapis tytułu, podział na fragmenty, embeddingi, zapis fragmentów.
// Zwraca liczbę fragmentów. Gdy coś się nie uda, usuwa niedokończony dokument
// i zgłasza KnowledgeError z komunikatem po polsku.
export async function importDocument(title: string, content: string): Promise<number> {
  const pieces = splitIntoChunks(content);
  if (pieces.length === 0) throw new KnowledgeError("Treść dokumentu jest pusta.");

  // 1. Dokument: jeden wiersz w tabeli documents.
  const created = await supabaseAdmin().from("documents").insert({ title }).select("id").single();
  if (created.error) {
    console.error("Nie udało się zapisać dokumentu:", created.error.message);
    throw new KnowledgeError(
      "Nie udało się zapisać dokumentu w bazie. Sprawdź, czy w Supabase → SQL Editor został uruchomiony skrypt baza.sql.",
    );
  }
  const documentId: number = created.data.id;

  try {
    // 2. Fragmenty, które już są w bazie i nie mają embeddingu — uzupełnimy je przy okazji.
    const old = await supabaseAdmin().from("chunks").select("id, content").is("embedding", null).limit(BACKFILL_LIMIT);
    if (old.error) throw new Error(old.error.message);

    // 3. Embeddingi wszystkich fragmentów jednym wywołaniem. Wynik ma tę samą kolejność co lista tekstów.
    const values = [...pieces, ...old.data.map((row) => row.content as string)];
    let embeddings: number[][];
    try {
      ({ embeddings } = await embedMany({ model: embeddingModel(), values }));
    } catch (error) {
      console.error("Nie udało się utworzyć embeddingów:", error);
      throw new KnowledgeError(
        "Nie udało się utworzyć embeddingów, więc dokument nie został zapisany. " +
          "Sprawdź OPENROUTER_EMBEDDING_MODEL i OPENROUTER_API_KEY w .env.local, a potem spróbuj ponownie.",
      );
    }
    if (embeddings.length !== values.length) {
      throw new KnowledgeError("Model embeddingów zwrócił niepełny wynik, więc dokument nie został zapisany. Spróbuj ponownie.");
    }

    // 4. Nowe fragmenty razem z embeddingami — jednym zapytaniem.
    const saved = await supabaseAdmin()
      .from("chunks")
      .insert(
        pieces.map((piece, index) => ({
          document_id: documentId,
          chunk_index: index,
          content: piece,
          embedding: embeddings[index],
        })),
      );
    if (saved.error) throw new Error(saved.error.message);

    // 5. Stare fragmenty dostają brakujące embeddingi.
    for (const [index, row] of old.data.entries()) {
      const updated = await supabaseAdmin()
        .from("chunks")
        .update({ embedding: embeddings[pieces.length + index] })
        .eq("id", row.id);
      if (updated.error) throw new Error(updated.error.message);
    }

    return pieces.length;
  } catch (error) {
    // Sprzątamy: usunięcie dokumentu usuwa też jego fragmenty (on delete cascade).
    const removed = await supabaseAdmin().from("documents").delete().eq("id", documentId);
    if (removed.error) console.error("Nie udało się usunąć niedokończonego dokumentu:", removed.error.message);

    if (error instanceof KnowledgeError) throw error;
    console.error("Nie udało się zapisać fragmentów:", error);
    throw new KnowledgeError(
      "Nie udało się zapisać fragmentów w bazie, więc dokument nie został zapisany. " +
        "Sprawdź tabelę chunks w Supabase — kolumna embedding musi mieć tyle liczb, ile zwraca model (domyślnie 1536).",
    );
  }
}

export type KnowledgeChunk = {
  tytul: string; // tytuł dokumentu, z którego pochodzi fragment
  tresc: string; // treść fragmentu
  podobienstwo: number; // od 0 do 1 — im bliżej 1, tym bliższe znaczenie
};

// Wyszukiwanie po znaczeniu: embedding pytania → funkcja match_chunks w bazie → 3 najbliższe fragmenty.
export async function searchChunks(question: string): Promise<KnowledgeChunk[]> {
  const { embedding } = await embed({ model: embeddingModel(), value: question });

  const { data, error } = await supabaseAdmin().rpc("match_chunks", {
    query_embedding: embedding,
    match_count: MATCH_COUNT,
  });
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as { title: string; content: string; similarity: number }[];
  return rows.map((row) => ({
    tytul: row.title,
    tresc: row.content,
    podobienstwo: Math.round(row.similarity * 100) / 100,
  }));
}
