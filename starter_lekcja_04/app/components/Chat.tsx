"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, getToolName, isToolUIPart, type FileUIPart, type UIMessage } from "ai";
import type { AgentMetadata, ImageResult } from "@/lib/tools";

type Analysis = {
  category: string;
  priority: string;
  draft: string;
  needs_review: boolean;
};

type AgentMessage = UIMessage<AgentMetadata>;

// Obraz z przycisku „Wygeneruj obraz”. Pamiętamy, po której wiadomości go pokazać.
type GeneratedImage = ImageResult & { id: number; prompt: string; after: number };

// Etykiety narzędzi pokazywane nad odpowiedzią. Dodajesz narzędzie — dopisz je tutaj.
const TOOL_LABELS: Record<string, string> = {
  wyszukiwanie: "🔎 wyszukiwanie",
  aktualnyCzas: "🕒 aktualnyCzas",
  generujObraz: "🎨 generujObraz",
};

const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_IMAGE_PROMPT = 500;

// Rozmowa idzie do /api/agent w trybie "chat". Wygenerowanych obrazów nie odsyłamy
// z powrotem na serwer — są duże, a modelowi wystarcza informacja, że obraz powstał.
const transport = new DefaultChatTransport<AgentMessage>({
  api: "/api/agent",
  prepareSendMessagesRequest: ({ messages }) => ({
    body: {
      mode: "chat",
      messages: messages.map((message) => ({
        ...message,
        parts: message.parts.map((part) =>
          part.type === "tool-generujObraz" && part.state === "output-available"
            ? { ...part, output: { model: (part.output as ImageResult).model } }
            : part,
        ),
      })),
    },
  }),
});

// Lista użytych narzędzi, po kolei. Wyszukiwanie wykonuje OpenRouter,
// więc rozpoznajemy je po źródłach dołączonych do odpowiedzi.
function usedTools(message: AgentMessage): string[] {
  const names: string[] = [];
  for (const part of message.parts) {
    const name = isToolUIPart(part) ? getToolName(part) : part.type === "source-url" ? "wyszukiwanie" : "";
    if (name && !names.includes(name)) names.push(name);
  }
  return names;
}

function Picture({ result }: { result: ImageResult }) {
  if (result.error) return <p className="error">{result.error}</p>;
  if (!result.image) return null;
  return (
    <figure className="picture">
      <img src={result.image} alt="Wygenerowany obraz" />
      <figcaption>
        <span className="small">model: {result.model ?? "nieznany"}</span>
        <a className="download" href={result.image} download="obraz.png">
          Pobierz
        </a>
      </figcaption>
    </figure>
  );
}

function Message({ message }: { message: AgentMessage }) {
  const isAssistant = message.role === "assistant";
  const tools = isAssistant ? usedTools(message) : [];
  const sources = message.parts.filter((part) => part.type === "source-url");
  const hasContent = message.parts.some(
    (part) => (part.type === "text" && part.text.trim()) || part.type === "tool-generujObraz",
  );

  return (
    <div className={`message ${message.role}`}>
      {tools.length > 0 && (
        <div className="labels">
          {tools.map((name) => (
            <span key={name} className="label">
              {TOOL_LABELS[name] ?? `🛠️ ${name}`}
            </span>
          ))}
        </div>
      )}

      {message.parts.map((part, index) => {
        if (part.type === "text") return <span key={index}>{part.text}</span>;
        if (part.type === "file" && part.mediaType.startsWith("image/")) {
          return <img key={index} className="thumb" src={part.url} alt={part.filename ?? "Wysłane zdjęcie"} />;
        }
        if (part.type === "tool-generujObraz") {
          if (part.state === "output-available") {
            return <Picture key={index} result={part.output as ImageResult} />;
          }
          if (part.state === "output-error") {
            return (
              <p key={index} className="error">
                Nie udało się wygenerować obrazu.
              </p>
            );
          }
          return (
            <p key={index} className="muted">
              Generuję obraz…
            </p>
          );
        }
        return null;
      })}

      {message.metadata?.stoppedAtLimit && <p className="muted">Przerwałem po 5 krokach.</p>}
      {isAssistant && !hasContent && message.metadata?.fetchedAt && !message.metadata.stoppedAtLimit && (
        <p className="muted">Nie mam odpowiedzi. Spróbuj zapytać inaczej.</p>
      )}

      {sources.length > 0 && (
        <div className="sources">
          <strong>Źródła</strong>
          <ul>
            {sources.map((source) => (
              <li key={source.sourceId}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.title || source.url}
                </a>
              </li>
            ))}
          </ul>
          {message.metadata?.fetchedAt && <span className="small">pobrano: {message.metadata.fetchedAt}</span>}
        </div>
      )}

      {isAssistant && message.metadata?.model && <div className="small">model: {message.metadata.model}</div>}
    </div>
  );
}

export default function Chat({
  botName,
  intro,
  imageSuggestions,
}: {
  botName: string;
  intro: string;
  imageSuggestions: string[];
}) {
  const router = useRouter();
  const { messages, sendMessage, status, error } = useChat<AgentMessage>({ transport });
  const [input, setInput] = useState("");
  const [photo, setPhoto] = useState<FileUIPart | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [generating, setGenerating] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analysisError, setAnalysisError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Gdy coś trwa, blokujemy przyciski, żeby nie wysłać zlecenia dwa razy.
  const busy = status === "submitted" || status === "streaming" || generating;
  const text = input.trim();

  function send(event: React.FormEvent) {
    event.preventDefault();
    if (busy || (!text && !photo)) return;
    sendMessage({ text: text || "Opisz to zdjęcie.", files: photo ? [photo] : undefined });
    setInput("");
    setPhoto(null);
  }

  // Vision: sprawdzamy plik od razu w przeglądarce i zamieniamy go na adres "data:".
  function choosePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setPhotoError("");
    if (!ALLOWED_IMAGES.includes(file.type)) {
      setPhotoError("Ten plik nie jest zdjęciem. Dodaj plik jpg, png albo webp.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setPhotoError("Zdjęcie jest za duże. Limit to 4 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setPhoto({ type: "file", mediaType: file.type, filename: file.name, url: String(reader.result) });
    reader.onerror = () => setPhotoError("Nie udało się wczytać zdjęcia.");
    reader.readAsDataURL(file);
  }

  async function generateImage() {
    if (!text || busy) return;
    setGenerating(true);
    const response = await fetch("/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text }),
    }).catch(() => null);
    const data = await response?.json().catch(() => null);
    const result: ImageResult = response?.ok && data ? data : { error: data?.error ?? "Nie udało się wygenerować obrazu." };
    setImages((list) => [...list, { ...result, id: list.length, prompt: text, after: messages.length }]);
    setGenerating(false);
    if (response?.ok) setInput("");
  }

  async function analyze() {
    if (!text) return;
    setAnalyzing(true);
    setAnalysis(null);
    setAnalysisError("");
    const response = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "analyze", text }),
    }).catch(() => null);
    const data = await response?.json().catch(() => null);
    setAnalyzing(false);
    if (response?.ok && data) setAnalysis(data);
    else setAnalysisError(data?.error ?? "Analiza się nie udała.");
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.refresh();
  }

  // Obrazy z przycisku pokazujemy w rozmowie — w miejscu, w którym zostały zamówione.
  function imagesAfter(count: number) {
    return images
      .filter((image) => image.after === count)
      .map((image) => (
        <div key={`image-${image.id}`} className="message assistant">
          <span className="small">Obraz: {image.prompt}</span>
          <Picture result={image} />
        </div>
      ));
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
        {imagesAfter(0)}
        {messages.map((message, index) => (
          <div key={message.id} className="turn">
            <Message message={message} />
            {imagesAfter(index + 1)}
          </div>
        ))}
        {status === "submitted" && <div className="message assistant muted">Piszę…</div>}
        {generating && <div className="message assistant muted">Generuję obraz…</div>}
        {error && <p className="error">Coś poszło nie tak. Spróbuj ponownie.</p>}
      </div>

      {photo && (
        <div className="attachment">
          <img className="thumb" src={photo.url} alt="Wybrane zdjęcie" />
          <span className="small">{photo.filename}</span>
          <button type="button" className="ghost" onClick={() => setPhoto(null)}>
            Usuń
          </button>
        </div>
      )}
      {photoError && <p className="error">{photoError}</p>}

      <form onSubmit={send} className="composer">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Napisz wiadomość albo opis obrazu…"
          aria-label="Wiadomość"
        />
        <button type="submit" disabled={busy || (!text && !photo)}>
          Wyślij
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={choosePhoto}
          hidden
          aria-label="Zdjęcie"
        />
        <button type="button" className="ghost" onClick={() => fileInput.current?.click()} disabled={busy}>
          Dodaj zdjęcie
        </button>
        <button
          type="button"
          className="ghost"
          onClick={generateImage}
          disabled={busy || !text || text.length > MAX_IMAGE_PROMPT}
        >
          {generating ? "Generuję obraz…" : "Wygeneruj obraz"}
        </button>
        <button type="button" className="ghost" onClick={analyze} disabled={analyzing || !text}>
          {analyzing ? "Analizuję…" : "Analiza JSON"}
        </button>
      </form>

      <div className="suggestions">
        <span className="small">Pomysły na obraz:</span>
        {imageSuggestions.map((suggestion) => (
          <button key={suggestion} type="button" className="chip" onClick={() => setInput(suggestion)} disabled={busy}>
            {suggestion}
          </button>
        ))}
      </div>

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
