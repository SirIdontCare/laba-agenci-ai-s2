import {
  Output,
  convertToModelMessages,
  createUIMessageStreamResponse,
  generateText,
  isStepCount,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { chatModel, isModelConfigured } from "@/lib/model";
import { ANALYSIS_INSTRUCTIONS, INSTRUCTIONS, analysisSchema } from "@/lib/persona";
import { hasSession } from "@/lib/session";
import { MAX_STEPS, agentTools, type AgentMetadata } from "@/lib/tools";

export const maxDuration = 60;

const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp"];

// Jeden endpoint agenta. Pole mode wybiera sposób pracy:
// - "chat": rozmowa na żywo z narzędziami,
// - "analyze": wynik w ustalonym kształcie (JSON).
export async function POST(req: Request) {
  // 1. Najpierw sprawdzamy sesję. Bez niej nie dotykamy modelu.
  if (!(await hasSession())) {
    return Response.json({ error: "Brak dostępu. Zaloguj się hasłem." }, { status: 401 });
  }

  if (!isModelConfigured()) {
    return Response.json({ error: "Brak OPENROUTER_API_KEY w konfiguracji." }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  if (body?.mode === "chat") return chat(body.messages);
  if (body?.mode === "analyze") return analyze(body.text);
  return Response.json({ error: 'Nieznany tryb. Użyj mode: "chat" albo "analyze".' }, { status: 400 });
}

async function chat(messages: UIMessage[] | undefined) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "Brak wiadomości." }, { status: 400 });
  }

  // Zdjęcia od użytkownika: przepuszczamy tylko jpg, png i webp.
  const badFile = messages.some(
    (message) =>
      Array.isArray(message.parts) &&
      message.parts.some((part) => part.type === "file" && !ALLOWED_IMAGES.includes(part.mediaType)),
  );
  if (badFile) {
    return Response.json({ error: "Można dodać tylko zdjęcie jpg, png albo webp." }, { status: 400 });
  }

  // 2. Wysyłamy rozmowę do modelu. Model może wykonać kilka kroków:
  //    użyć narzędzia, przeczytać wynik i dopiero wtedy odpowiedzieć.
  const result = streamText({
    model: chatModel(),
    instructions: INSTRUCTIONS,
    messages: await convertToModelMessages(messages, { tools: agentTools }),
    tools: agentTools,
    stopWhen: isStepCount(MAX_STEPS),
  });

  let steps = 0;

  // 3. Odsyłamy odpowiedź kawałek po kawałku, razem ze źródłami i informacjami o odpowiedzi.
  return createUIMessageStreamResponse({
    stream: toUIMessageStream<typeof agentTools, UIMessage<AgentMetadata>>({
      stream: result.stream,
      tools: agentTools,
      sendSources: true,
      onError: () => "Model nie odpowiedział. Spróbuj ponownie za chwilę.",
      messageMetadata: ({ part }) => {
        if (part.type === "finish-step") {
          steps += 1;
          return { model: part.response.modelId };
        }
        if (part.type === "finish") {
          return {
            fetchedAt: new Date().toLocaleString("pl-PL", {
              timeZone: "Europe/Warsaw",
              dateStyle: "short",
              timeStyle: "short",
            }),
            // Ostatni krok skończył się prośbą o narzędzie = zabrakło kroków na odpowiedź.
            stoppedAtLimit: steps >= MAX_STEPS && part.finishReason === "tool-calls",
          };
        }
      },
    }),
  });
}

async function analyze(rawText: unknown) {
  const text = typeof rawText === "string" ? rawText.trim() : "";
  if (!text) {
    return Response.json({ error: "Wpisz wiadomość do analizy." }, { status: 400 });
  }
  if (text.length > 4000) {
    return Response.json({ error: "Wiadomość jest za długa (limit 4000 znaków)." }, { status: 400 });
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
