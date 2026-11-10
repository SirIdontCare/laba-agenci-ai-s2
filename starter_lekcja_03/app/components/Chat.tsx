"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";

type Analysis = {
  category: string;
  priority: string;
  draft: string;
  needs_review: boolean;
};

export default function Chat({ botName, intro }: { botName: string; intro: string }) {
  const router = useRouter();
  const { messages, sendMessage, status, error } = useChat();
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analysisError, setAnalysisError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const busy = status === "submitted" || status === "streaming";

  function send(event: React.FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput("");
  }

  async function analyze() {
    const text = input.trim();
    if (!text) return;
    setAnalyzing(true);
    setAnalysis(null);
    setAnalysisError("");
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await response.json().catch(() => null);
    setAnalyzing(false);
    if (response.ok && data) setAnalysis(data);
    else setAnalysisError(data?.error ?? "Analiza się nie udała.");
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="card chat">
      <header>
        <h1>{botName}</h1>
        <button type="button" className="ghost" onClick={logout}>
          Wyjdź
        </button>
      </header>

      <div className="messages">
        <div className="message assistant">{intro}</div>
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            {message.parts.map((part, index) =>
              part.type === "text" ? <span key={index}>{part.text}</span> : null,
            )}
          </div>
        ))}
        {status === "submitted" && <div className="message assistant muted">Piszę…</div>}
        {error && <p className="error">Coś poszło nie tak. Spróbuj ponownie.</p>}
      </div>

      <form onSubmit={send} className="composer">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Napisz wiadomość…"
          aria-label="Wiadomość"
        />
        <button type="submit" disabled={busy || !input.trim()}>
          Wyślij
        </button>
        <button type="button" className="ghost" onClick={analyze} disabled={analyzing || !input.trim()}>
          {analyzing ? "Analizuję…" : "Analiza JSON"}
        </button>
      </form>

      {analysisError && <p className="error">{analysisError}</p>}
      {analysis && (
        <section className="analysis">
          <h2>Analiza wiadomości</h2>
          <dl>
            <dt>Kategoria</dt>
            <dd>{analysis.category}</dd>
            <dt>Priorytet</dt>
            <dd>{analysis.priority}</dd>
            <dt>Do sprawdzenia przez człowieka</dt>
            <dd>{analysis.needs_review ? "tak" : "nie"}</dd>
            <dt>Szkic odpowiedzi</dt>
            <dd>{analysis.draft}</dd>
          </dl>
        </section>
      )}
    </div>
  );
}
