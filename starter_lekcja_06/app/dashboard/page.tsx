import { Suspense } from "react";
import Link from "next/link";
import { generateText } from "ai";
import { chatModel, isModelConfigured } from "@/lib/model";
import { BOT_NAME } from "@/lib/persona";
import { hasSession } from "@/lib/session";
import { dzisiaj } from "@/lib/sources";
import { zbierzKarty, type Karta } from "@/lib/trip";
import Login from "../components/Login";

// Asystent podróży: pięć kart z pięciu źródeł i krótkie podsumowanie od agenta.
// Strona działa na serwerze. Formularz wysyła miasto i datę w adresie
// (/dashboard?miasto=Lizbona&data=2026-11-25), a serwer pobiera świeże dane przy każdym wejściu.

type Params = PageProps<"/dashboard">["searchParams"];

export default function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  return (
    <main className="app">
      {/* Sesję i adres znamy dopiero przy wejściu na stronę, dlatego ta część jest w Suspense. */}
      <Suspense fallback={<p className="muted">Ładowanie…</p>}>
        <Gate searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

// Najpierw sprawdzamy sesję. Bez niej nie pobieramy żadnych danych — pokazujemy ekran hasła.
async function Gate({ searchParams }: { searchParams: Params }) {
  if (!(await hasSession())) {
    return <Login botName={BOT_NAME} />;
  }

  const params = await searchParams;
  const miasto = typeof params.miasto === "string" ? params.miasto.trim() : "";
  const data = typeof params.data === "string" && params.data ? params.data : dzisiaj();

  return (
    <div className="card dashboard">
      <header>
        <h1>Asystent podróży</h1>
        <nav className="nav">
          <Link href="/">← Wróć do czatu</Link>
        </nav>
      </header>

      <form className="trip-form" action="/dashboard" method="get">
        <label>
          Dokąd jedziesz?
          <input name="miasto" defaultValue={miasto} placeholder="np. Lizbona" maxLength={80} required />
        </label>
        <label>
          Kiedy?
          <input name="data" type="date" defaultValue={data} required />
        </label>
        <button type="submit">Sprawdź</button>
      </form>

      {miasto ? (
        <Trip miasto={miasto} data={data} />
      ) : (
        <p className="muted">Wpisz miasto i datę, a potem kliknij „Sprawdź”.</p>
      )}
    </div>
  );
}

async function Trip({ miasto, data }: { miasto: string; data: string }) {
  const podroz = await zbierzKarty(miasto, data);
  if ("blad" in podroz) return <p className="error">{podroz.blad}</p>;

  return (
    <>
      <h2>
        {podroz.miejsce.nazwa}, {podroz.miejsce.kraj} — {podroz.data}
      </h2>

      <div className="trip-cards">
        {podroz.karty.map((karta) => (
          <section key={karta.tytul} className="trip-card">
            <h2>{karta.tytul}</h2>
            <p className={karta.ok ? "value" : "error"}>{karta.wartosc}</p>
            {karta.szczegoly && <p>{karta.szczegoly}</p>}
            {karta.link && (
              <p>
                <a href={karta.link} target="_blank" rel="noreferrer">
                  Czytaj w Wikipedii
                </a>
              </p>
            )}
            <span className="small">
              źródło: {karta.zrodlo} · pobrano: {karta.pobrano}
            </span>
          </section>
        ))}
      </div>

      {/* Ten sam adres wysłany jeszcze raz = serwer pobiera dane ponownie. */}
      <form className="trip-form" action="/dashboard" method="get">
        <input type="hidden" name="miasto" value={miasto} />
        <input type="hidden" name="data" value={podroz.data} />
        <button type="submit" className="ghost">
          Odśwież
        </button>
      </form>

      <section className="trip-summary">
        <h2>Podsumowanie od agenta</h2>
        {/* Karty widać od razu, a podsumowanie dochodzi, gdy model skończy pisać. */}
        <Suspense fallback={<p className="muted">Agent pisze podsumowanie…</p>}>
          <Summary miasto={podroz.miejsce.nazwa} data={podroz.data} karty={podroz.karty} />
        </Suspense>
      </section>
    </>
  );
}

// Jedyna część dashboardu, która używa modelu AI. Dostaje wyłącznie dane z kart.
async function Summary({ miasto, data, karty }: { miasto: string; data: string; karty: Karta[] }) {
  if (!isModelConfigured()) {
    return <p className="muted">Brak OPENROUTER_API_KEY w konfiguracji — podsumowanie jest niedostępne.</p>;
  }

  const dane = karty
    .map((karta) => `${karta.tytul}: ${karta.ok ? `${karta.wartosc}. ${karta.szczegoly ?? ""}` : "brak danych"}`)
    .join("\n");

  try {
    const { text } = await generateText({
      model: chatModel(),
      instructions:
        "Jesteś asystentem podróży. Na podstawie podanych danych napisz po polsku 2–3 zdania: " +
        "co spakować i na co uważać. Korzystaj tylko z tych danych, niczego nie wymyślaj. " +
        "Jeśli jakiegoś źródła brakuje, powiedz to wprost.",
      prompt: `Podróż: ${miasto}, ${data}.\n\n${dane}`,
    });
    return <p>{text.trim() || "Agent nie przygotował podsumowania. Kliknij „Odśwież”."}</p>;
  } catch {
    return <p className="muted">Agent nie odpowiedział — podsumowanie jest teraz niedostępne. Karty powyżej są aktualne.</p>;
  }
}
