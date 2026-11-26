"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AUTH_MISSING, isAuthConfigured, supabaseBrowser } from "@/lib/supabase-browser";

const MIN_PASSWORD = 8;

type Mode = "login" | "signup";

// Komunikaty po polsku dla najczęstszych błędów Supabase Auth (pole "code" w błędzie).
const ERRORS: Record<string, string> = {
  invalid_credentials: "Błędny e-mail albo hasło.",
  user_already_exists: "Konto z tym adresem e-mail już istnieje. Wybierz „Zaloguj się”.",
  email_exists: "Konto z tym adresem e-mail już istnieje. Wybierz „Zaloguj się”.",
  weak_password: `Hasło jest za krótkie albo za słabe. Wpisz co najmniej ${MIN_PASSWORD} znaków.`,
  email_address_invalid: "Ten adres e-mail wygląda na niepoprawny.",
  validation_failed: "Sprawdź adres e-mail i hasło — coś jest wpisane niepoprawnie.",
  email_not_confirmed: "Ten adres e-mail nie został jeszcze potwierdzony. Kliknij link w wiadomości od Supabase.",
  signup_disabled: "Zakładanie kont jest wyłączone w ustawieniach Supabase.",
  email_provider_disabled: "Logowanie e-mailem jest wyłączone w ustawieniach Supabase.",
  provider_disabled: "Logowanie przez Google nie jest jeszcze włączone w Supabase (Authentication → Sign In / Providers).",
  over_request_rate_limit: "Za dużo prób. Odczekaj chwilę i spróbuj ponownie.",
  over_email_send_rate_limit: "Za dużo prób. Odczekaj chwilę i spróbuj ponownie.",
};

function errorMessage(error: { code?: string }, fallback: string): string {
  return (error.code && ERRORS[error.code]) || fallback;
}

// Formularz logowania: zakładki „Zaloguj się” i „Załóż konto” (e-mail i hasło) oraz logowanie przez Google.
// Hasło idzie prosto do Supabase Auth — aplikacja go nie zapisuje.
export default function LoginForm({ botName }: { botName: string }) {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  // Po nieudanym powrocie z Google trafiamy tu z adresem /login?blad=google.
  const [error, setError] = useState(
    searchParams.get("blad") === "google" ? "Logowanie przez Google się nie udało albo zostało anulowane. Spróbuj ponownie." : "",
  );

  const configured = isAuthConfigured();

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setMessage("");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setMessage("");

    if (!email.trim() || !password) {
      setError("Wpisz adres e-mail i hasło.");
      return;
    }
    if (mode === "signup" && password.length < MIN_PASSWORD) {
      setError(`Hasło jest za krótkie. Wpisz co najmniej ${MIN_PASSWORD} znaków.`);
      return;
    }

    setBusy(true);
    try {
      const auth = supabaseBrowser().auth;
      const credentials = { email: email.trim(), password };
      const { data, error: authError } =
        mode === "login" ? await auth.signInWithPassword(credentials) : await auth.signUp(credentials);

      if (authError) {
        setError(errorMessage(authError, mode === "login" ? "Nie udało się zalogować." : "Nie udało się założyć konta."));
      } else if (!data.session) {
        // Konto powstało, ale Supabase czeka na potwierdzenie adresu e-mail.
        setMessage(
          "Konto czeka na potwierdzenie adresu e-mail. Kliknij link w wiadomości od Supabase albo wyłącz " +
            "„Confirm email” w Supabase → Authentication → Sign In / Providers → Email i załóż konto ponownie.",
        );
      } else {
        // Sesja jest już w ciasteczkach. Wczytujemy czat od zera, żeby serwer ją zobaczył.
        window.location.assign("/");
        return;
      }
    } catch {
      setError("Nie udało się połączyć z Supabase. Sprawdź adres projektu w .env.local i połączenie z internetem.");
    }
    setBusy(false);
  }

  async function google() {
    if (busy) return;
    setError("");
    setMessage("");
    setBusy(true);
    try {
      // Przeglądarka przechodzi do Google, a potem wraca na /auth/callback tej samej aplikacji.
      const { error: authError } = await supabaseBrowser().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (!authError) return; // trwa przejście na stronę Google
      setError(errorMessage(authError, "Nie udało się rozpocząć logowania przez Google."));
    } catch {
      setError("Nie udało się połączyć z Supabase. Sprawdź adres projektu w .env.local i połączenie z internetem.");
    }
    setBusy(false);
  }

  return (
    <div className="card login">
      <h1>{botName}</h1>

      {!configured && <p className="notice">{AUTH_MISSING}</p>}

      <div className="tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "login"}
          className={mode === "login" ? "tab active" : "tab"}
          onClick={() => switchMode("login")}
        >
          Zaloguj się
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signup"}
          className={mode === "signup" ? "tab active" : "tab"}
          onClick={() => switchMode("signup")}
        >
          Załóż konto
        </button>
      </div>

      <form className="login-form" onSubmit={submit}>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Adres e-mail"
          aria-label="Adres e-mail"
          autoComplete="email"
          autoFocus
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={mode === "signup" ? `Hasło (min. ${MIN_PASSWORD} znaków)` : "Hasło"}
          aria-label="Hasło"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
        <button type="submit" disabled={busy || !configured}>
          {mode === "login" ? "Zaloguj się" : "Załóż konto"}
        </button>
      </form>

      <p className="muted divider">albo</p>

      <button type="button" className="ghost" onClick={google} disabled={busy || !configured}>
        Zaloguj się przez Google
      </button>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
