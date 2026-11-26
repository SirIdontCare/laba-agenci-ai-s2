import { Suspense } from "react";
import { BOT_NAME } from "@/lib/persona";
import LoginForm from "../components/LoginForm";

// Strona logowania — jedyna strona dostępna bez konta.
// Zalogowaną osobę plik proxy.ts od razu przenosi stąd do czatu.
export default function LoginPage() {
  return (
    <main className="app">
      {/* Formularz czyta adres strony (np. /login?blad=google), dlatego jest w Suspense. */}
      <Suspense fallback={<p className="muted">Ładowanie…</p>}>
        <LoginForm botName={BOT_NAME} />
      </Suspense>
    </main>
  );
}
