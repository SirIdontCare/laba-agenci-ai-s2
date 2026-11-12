import { isModelConfigured } from "@/lib/model";
import { hasSession } from "@/lib/session";
import { MAX_IMAGE_PROMPT, createImage } from "@/lib/tools";

export const maxDuration = 60;

// Przycisk „Wygeneruj obraz”: opis obrazu -> gotowy obraz i nazwa modelu.
export async function POST(req: Request) {
  if (!(await hasSession())) {
    return Response.json({ error: "Brak dostępu. Zaloguj się hasłem." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return Response.json({ error: "Wpisz opis obrazu." }, { status: 400 });
  }
  if (prompt.length > MAX_IMAGE_PROMPT) {
    return Response.json(
      { error: `Opis obrazu jest za długi (limit ${MAX_IMAGE_PROMPT} znaków).` },
      { status: 400 },
    );
  }

  if (!isModelConfigured()) {
    return Response.json({ error: "Brak OPENROUTER_API_KEY w konfiguracji." }, { status: 500 });
  }

  const result = await createImage(prompt);
  if (result.error) {
    return Response.json({ error: result.error }, { status: 502 });
  }
  return Response.json({ image: result.image, model: result.model });
}
