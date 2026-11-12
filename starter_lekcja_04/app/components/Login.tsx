"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login({ botName }: { botName: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (response.ok) {
      router.refresh();
    } else {
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "Nie udało się zalogować.");
    }
  }

  return (
    <form className="card login" onSubmit={submit}>
      <h1>{botName}</h1>
      <p className="muted">Podaj hasło, żeby wejść do czatu.</p>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Hasło"
        aria-label="Hasło"
        autoFocus
      />
      <button type="submit" disabled={busy || !password}>
        {busy ? "Sprawdzam…" : "Wejdź"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
