import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { loadLastConversation, type LoadedConversation } from "@/lib/conversations";
import { BOT_INTRO, BOT_NAME, IMAGE_SUGGESTIONS } from "@/lib/persona";
import { DATABASE_ERROR } from "@/lib/supabase";
import { getAuth } from "@/lib/supabase-server";
import Chat from "./components/Chat";

// Serwer sprawdza, kto jest zalogowany, i pokazuje czat z ostatnią rozmową tej osoby.
async function Gate() {
  await connection(); // ta część strony powstaje przy każdym wejściu, nie podczas budowania
  // Najpierw logowanie. Bez niego nie czytamy niczego z bazy — przenosimy na /login.
  const auth = await getAuth();
  if (!auth) redirect("/login");

  // Wczytujemy ostatnią rozmowę zalogowanej osoby — dzięki temu jest na ekranie także po odświeżeniu strony.
  // Czytamy jej klientem (auth.db), więc RLS oddaje tylko jej rozmowy.
  // Gdy baza nie odpowiada, czat działa dalej i pokazuje komunikat.
  let last: LoadedConversation = { conversationId: null, messages: [] };
  let databaseNotice = "";
  try {
    last = await loadLastConversation(auth.db);
  } catch (error) {
    console.error("Nie udało się wczytać rozmowy:", error);
    databaseNotice = DATABASE_ERROR;
  }
  const { email, name, avatarUrl } = auth.user;

  return (
    <Chat
      botName={BOT_NAME}
      intro={BOT_INTRO}
      imageSuggestions={IMAGE_SUGGESTIONS}
      initialConversationId={last.conversationId}
      initialMessages={last.messages}
      databaseNotice={databaseNotice}
      user={{ email, name, avatarUrl }}
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
