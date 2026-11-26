import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MAX_CONTENT, MAX_TITLE } from "@/lib/knowledge";
import { DATABASE_MISSING, isDatabaseConfigured } from "@/lib/supabase";
import { getAuth } from "@/lib/supabase-server";
import UploadForm from "../components/UploadForm";
import UserMenu from "../components/UserMenu";

// Baza wiedzy: wklejasz tekst dokumentu, a serwer dzieli go na fragmenty
// i zapisuje każdy razem z embeddingiem (endpoint app/api/upload/route.ts).
// Baza wiedzy jest wspólna dla wszystkich zalogowanych osób.

export default function UploadPage() {
  return (
    <main className="app">
      {/* Zalogowaną osobę znamy dopiero przy wejściu na stronę, dlatego ta część jest w Suspense. */}
      <Suspense fallback={<p className="muted">Ładowanie…</p>}>
        <Gate />
      </Suspense>
    </main>
  );
}

// Najpierw sprawdzamy, kto jest zalogowany. Bez tego przenosimy na /login.
async function Gate() {
  const auth = await getAuth();
  if (!auth) redirect("/login");
  const { email, name, avatarUrl } = auth.user;

  return (
    <div className="card">
      <header>
        <h1>Baza wiedzy</h1>
        <nav className="nav">
          <Link href="/">← Wróć do czatu</Link>
          <UserMenu user={{ email, name, avatarUrl }} />
        </nav>
      </header>

      {!isDatabaseConfigured() && <p className="notice">{DATABASE_MISSING}</p>}

      <UploadForm maxTitle={MAX_TITLE} maxContent={MAX_CONTENT} />
    </div>
  );
}
