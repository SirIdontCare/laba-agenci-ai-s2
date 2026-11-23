import type { UIMessage } from "ai";
import { supabase } from "@/lib/supabase";
import type { AgentMetadata } from "@/lib/tools";

// ============================================================
// ZAPIS I ODCZYT ROZMÓW.
// Tabela conversations: jedna rozmowa = jeden wiersz (id, created_at, title).
// Tabela messages: jedna wiadomość = jeden wiersz (conversation_id, role, content).
// Każda funkcja zgłasza błąd (throw), gdy baza odmówi — obsługuje go ten, kto ją wywołał.
// ============================================================

const TITLE_LENGTH = 60;

// Tekst wiadomości do zapisania w bazie. Obrazów nie zapisujemy —
// zamiast zdjęcia od użytkownika i obrazu od agenta wstawiamy dopisek „[obraz]”.
export function messageText(message: UIMessage): string {
  const pieces: string[] = [];
  for (const part of message.parts) {
    if (part.type === "text" && part.text.trim()) pieces.push(part.text.trim());
    if (part.type === "file") pieces.push("[obraz]");
    if (part.type === "tool-generujObraz" && part.state === "output-available") pieces.push("[obraz]");
  }
  return pieces.join("\n");
}

// Nowa rozmowa. Tytuł to początek pierwszej wiadomości. Zwraca numer (id) rozmowy.
export async function createConversation(firstMessage: string): Promise<number> {
  const title = firstMessage.slice(0, TITLE_LENGTH) || "Nowa rozmowa";
  const { data, error } = await supabase().from("conversations").insert({ title }).select("id").single();
  if (error) throw new Error(error.message);
  return data.id;
}

// Zapisuje jedną wymianę: wiadomość użytkownika i gotową odpowiedź agenta.
// Oba wiersze idą w jednym zapytaniu, więc trafiają do bazy razem i w dobrej kolejności.
export async function saveExchange(conversationId: number, userText: string, assistantText: string) {
  const { error } = await supabase()
    .from("messages")
    .insert([
      { conversation_id: conversationId, role: "user", content: userText },
      { conversation_id: conversationId, role: "assistant", content: assistantText },
    ]);
  if (error) throw new Error(error.message);
}

export type LoadedConversation = {
  conversationId: number | null; // null = nie ma jeszcze żadnej rozmowy
  messages: UIMessage<AgentMetadata>[];
};

// Ostatnia rozmowa (ta z najwyższym id) razem z wiadomościami, od najstarszej.
export async function loadLastConversation(): Promise<LoadedConversation> {
  const last = await supabase()
    .from("conversations")
    .select("id")
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (last.error) throw new Error(last.error.message);
  if (!last.data) return { conversationId: null, messages: [] };

  const conversationId: number = last.data.id;
  const rows = await supabase()
    .from("messages")
    .select("id, role, content")
    .eq("conversation_id", conversationId)
    .order("id", { ascending: true });
  if (rows.error) throw new Error(rows.error.message);

  // Wiersz z bazy zamieniamy na wiadomość w formacie, którego używa czat.
  const messages: UIMessage<AgentMetadata>[] = [];
  for (const row of rows.data) {
    if (!row.content) continue;
    messages.push({
      id: `db-${row.id}`,
      role: row.role === "user" ? "user" : "assistant",
      parts: [{ type: "text", text: row.content }],
    });
  }
  return { conversationId, messages };
}
