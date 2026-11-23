import { KnowledgeError, MAX_CONTENT, MAX_TITLE, importDocument } from "@/lib/knowledge";
import { isModelConfigured } from "@/lib/model";
import { hasSession } from "@/lib/session";
import { DATABASE_MISSING, isDatabaseConfigured } from "@/lib/supabase";

export const maxDuration = 60;

// Odmiana słowa po polsku: 1 fragment, 2 fragmenty, 5 fragmentów.
function chunkWord(count: number): string {
  if (count === 1) return "fragment";
  const few = count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14);
  return few ? "fragmenty" : "fragmentów";
}

// Formularz ze strony /upload: tytuł i treść -> dokument w bazie wiedzy (fragmenty z embeddingami).
export async function POST(req: Request) {
  // Najpierw sesja. Bez niej nie dotykamy ani bazy, ani modelu.
  if (!(await hasSession())) {
    return Response.json({ error: "Brak dostępu. Zaloguj się hasłem." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (!title) {
    return Response.json({ error: "Wpisz tytuł dokumentu." }, { status: 400 });
  }
  if (!content) {
    return Response.json({ error: "Wklej treść dokumentu." }, { status: 400 });
  }
  if (title.length > MAX_TITLE) {
    return Response.json({ error: `Tytuł jest za długi (limit ${MAX_TITLE} znaków).` }, { status: 400 });
  }
  if (content.length > MAX_CONTENT) {
    return Response.json({ error: `Treść jest za długa (limit ${MAX_CONTENT} znaków).` }, { status: 400 });
  }

  if (!isDatabaseConfigured()) {
    return Response.json({ error: DATABASE_MISSING }, { status: 500 });
  }
  if (!isModelConfigured()) {
    return Response.json({ error: "Brak OPENROUTER_API_KEY w konfiguracji." }, { status: 500 });
  }

  try {
    const chunks = await importDocument(title, content);
    return Response.json({ title, chunks, message: `Zapisano dokument „${title}”: ${chunks} ${chunkWord(chunks)}` });
  } catch (error) {
    if (error instanceof KnowledgeError) {
      return Response.json({ error: error.message }, { status: 502 });
    }
    console.error("Import dokumentu się nie udał:", error);
    return Response.json({ error: "Nie udało się dodać dokumentu. Spróbuj ponownie." }, { status: 500 });
  }
}
