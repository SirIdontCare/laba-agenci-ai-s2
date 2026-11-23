import { Suspense } from "react";
import Link from "next/link";
import { MAX_CONTENT, MAX_TITLE } from "@/lib/knowledge";
import { BOT_NAME } from "@/lib/persona";
import { hasSession } from "@/lib/session";
import { DATABASE_MISSING, isDatabaseConfigured } from "@/lib/supabase";
import Login from "../components/Login";
import UploadForm from "../components/UploadForm";

// Baza wiedzy: wklejasz tekst dokumentu, a serwer dzieli go na fragmenty
// i zapisuje każdy razem z embeddingiem (endpoint app/api/upload/route.ts).

export default function UploadPage() {
  return (
    <main className="app">
      {/* Sesję znamy dopiero przy wejściu na stronę, dlatego ta część jest w Suspense. */}
      <Suspense fallback={<p className="muted">Ładowanie…</p>}>
        <Gate />
      </Suspense>
    </main>
  );
}

// Najpierw sprawdzamy sesję. Bez niej pokazujemy ekran hasła.
async function Gate() {
  if (!(await hasSession())) {
    return <Login botName={BOT_NAME} />;
  }

  return (
    <div className="card">
      <header>
        <h1>Baza wiedzy</h1>
        <nav className="nav">
          <Link href="/">← Wróć do czatu</Link>
        </nav>
      </header>

      {!isDatabaseConfigured() && <p className="notice">{DATABASE_MISSING}</p>}

      <UploadForm maxTitle={MAX_TITLE} maxContent={MAX_CONTENT} />
    </div>
  );
}
