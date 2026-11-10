import { generateText, Output } from "ai";
import { chatModel, isModelConfigured } from "@/lib/model";
import { ANALYSIS_INSTRUCTIONS, analysisSchema } from "@/lib/persona";
import { hasSession } from "@/lib/session";

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!(await hasSession())) {
    return Response.json({ error: "Brak dostępu. Zaloguj się hasłem." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text) {
    return Response.json({ error: "Wpisz wiadomość do analizy." }, { status: 400 });
  }
  if (text.length > 4000) {
    return Response.json({ error: "Wiadomość jest za długa (limit 4000 znaków)." }, { status: 400 });
  }

  if (!isModelConfigured()) {
    return Response.json({ error: "Brak OPENROUTER_API_KEY w konfiguracji." }, { status: 500 });
  }

  try {
    // Model ma zwrócić dane dokładnie w kształcie analysisSchema.
    const { output } = await generateText({
      model: chatModel(),
      instructions: ANALYSIS_INSTRUCTIONS,
      prompt: text,
      output: Output.object({ schema: analysisSchema }),
    });

    // Sprawdzamy wynik jeszcze raz po stronie serwera — modelowi nie ufamy na słowo.
    const checked = analysisSchema.safeParse(output);
    if (!checked.success) {
      return Response.json({ error: "Model zwrócił dane w złym formacie." }, { status: 502 });
    }
    return Response.json(checked.data);
  } catch {
    return Response.json({ error: "Nie udało się przeanalizować wiadomości." }, { status: 502 });
  }
}
