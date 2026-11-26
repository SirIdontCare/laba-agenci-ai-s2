"use client";

import { useState } from "react";

// Formularz dodawania dokumentu do bazy wiedzy. Wysyła tytuł i treść do /api/upload.
export default function UploadForm({ maxTitle, maxContent }: { maxTitle: number; maxContent: number }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setMessage("");
    setError("");

    // Puste pola sprawdzamy od razu, bez pytania serwera.
    if (!title.trim()) {
      setError("Wpisz tytuł dokumentu.");
      return;
    }
    if (!content.trim()) {
      setError("Wklej treść dokumentu.");
      return;
    }

    setBusy(true);
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    }).catch(() => null);
    const data = await response?.json().catch(() => null);
    setBusy(false);

    if (response?.ok && data?.message) {
      setMessage(data.message);
      setTitle("");
      setContent("");
    } else {
      setError(data?.error ?? "Nie udało się dodać dokumentu. Spróbuj ponownie.");
    }
  }

  return (
    <form className="upload-form" onSubmit={submit}>
      <p className="muted">
        Wklej tekst dokumentu, np. cennik, FAQ albo regulamin. Każdy akapit (tekst oddzielony pustą linią) stanie się
        osobnym fragmentem bazy wiedzy.
      </p>
      <label>
        Tytuł
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="np. Cennik 2026"
          maxLength={maxTitle}
        />
      </label>
      <label>
        Treść
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Wklej tutaj tekst dokumentu…"
          maxLength={maxContent}
        />
        <span className="small">
          {content.length} / {maxContent} znaków
        </span>
      </label>
      <button type="submit" disabled={busy}>
        {busy ? "Dodaję…" : "Dodaj do bazy wiedzy"}
      </button>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
}
