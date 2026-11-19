import { Suspense } from "react";
import { connection } from "next/server";
import { loadLastConversation, type LoadedConversation } from "@/lib/conversations";
import { hasSession } from "@/lib/session";
import { BOT_INTRO, BOT_NAME, IMAGE_SUGGESTIONS } from "@/lib/persona";
import { DATABASE_ERROR, DATABASE_MISSING, isDatabaseConfigured } from "@/lib/supabase";
import Chat from "./components/Chat";
import Login from "./components/Login";

// Serwer sprawdza ciasteczko sesji i decyduje, co pokazać: ekran hasła czy czat z ostatnią rozmową.
async function Gate() {
  await connection(); // ta część strony powstaje przy każdym wejściu, nie podczas budowania
  // Najpierw sesja. Bez niej nie czytamy niczego z bazy.
  if (!(await hasSession())) {
    return <Login botName={BOT_NAME} />;
  }

  // Wczytujemy ostatnią rozmowę z bazy — dzięki temu jest na ekranie także po odświeżeniu strony.
  // Gdy baza nie jest podłączona albo nie odpowiada, czat działa dalej i pokazuje komunikat.
  let last: LoadedConversation = { conversationId: null, messages: [] };
  let databaseNotice = "";
  if (!isDatabaseConfigured()) {
    databaseNotice = DATABASE_MISSING;
  } else {
    try {
      last = await loadLastConversation();
    } catch (error) {
      console.error("Nie udało się wczytać rozmowy:", error);
      databaseNotice = DATABASE_ERROR;
    }
  }

  return (
    <Chat
      botName={BOT_NAME}
      intro={BOT_INTRO}
      imageSuggestions={IMAGE_SUGGESTIONS}
      initialConversationId={last.conversationId}
      initialMessages={last.messages}
      databaseNotice={databaseNotice}
    />
  );
}

export default function Home() {
  return (
    <main className="app">
      <Suspense fallback={<p className="muted">Ładowanie…</p>}>
        <Gate />
      </Suspense>
    </main>
  );
}
