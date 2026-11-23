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
import { createConversation, messageText, saveExchange } from "@/lib/conversations";
import { chatModel, isModelConfigured } from "@/lib/model";
import { ANALYSIS_INSTRUCTIONS, INSTRUCTIONS, analysisSchema } from "@/lib/persona";
import { loadProfile, profileInstructions, type Profile } from "@/lib/profile";
import { hasSession } from "@/lib/session";
import { isDatabaseConfigured } from "@/lib/supabase";
import { MAX_STEPS, agentTools, type AgentMetadata } from "@/lib/tools";

export const maxDuration = 60;

const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp"];

// Jeden endpoint agenta. Pole mode wybiera sposób pracy:
// - "chat": rozmowa na żywo z narzędziami, zapisywana w bazie,
// - "analyze": wynik w ustalonym kształcie (JSON).
export async function POST(req: Request) {
  // 1. Najpierw sprawdzamy sesję. Bez niej nie dotykamy ani bazy, ani modelu.
  if (!(await hasSession())) {
    return Response.json({ error: "Brak dostępu. Zaloguj się hasłem." }, { status: 401 });
  }

  if (!isModelConfigured()) {
    return Response.json({ error: "Brak OPENROUTER_API_KEY w konfiguracji." }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  if (body?.mode === "chat") return chat(body.messages, body.conversationId);
  if (body?.mode === "analyze") return analyze(body.text);
  return Response.json({ error: 'Nieznany tryb. Użyj mode: "chat" albo "analyze".' }, { status: 400 });
}

async function chat(messages: UIMessage[] | undefined, conversationIdFromClient: unknown) {
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

  // 2. Baza: wczytujemy profil użytkownika i ustalamy, do której rozmowy trafi zapis.
  //    Gdy baza nie działa, czat odpowiada dalej — tylko bez pamięci.
  const lastMessage = messages[messages.length - 1];
  const userText = lastMessage.role === "user" ? messageText(lastMessage) : "";
  let profile: Profile | null = null;
  let conversationId: number | undefined;

  if (isDatabaseConfigured()) {
    try {
      profile = await loadProfile();
    } catch (error) {
      console.error("Nie udało się wczytać profilu:", error);
    }
    try {
      // Przeglądarka przysyła numer rozmowy. Gdy go nie ma, pierwsza wiadomość tworzy nową rozmowę.
      if (typeof conversationIdFromClient === "number" && Number.isInteger(conversationIdFromClient)) {
        conversationId = conversationIdFromClient;
      } else if (userText) {
        conversationId = await createConversation(userText);
      }
    } catch (error) {
      console.error("Nie udało się utworzyć rozmowy:", error);
    }
  }

  // 3. Wysyłamy rozmowę do modelu. Pętla ReAct: model myśli, używa narzędzia,
  //    czyta wynik i decyduje, co dalej. Limit kroków (MAX_STEPS) pilnuje, żeby się skończyła.
  //    Profil dołączamy do instrukcji jako dane o użytkowniku.
  const result = streamText({
    model: chatModel(),
    instructions: `${INSTRUCTIONS}\n\n${profileInstructions(profile)}`,
    messages: await convertToModelMessages(messages, { tools: agentTools }),
    tools: agentTools,
    stopWhen: isStepCount(MAX_STEPS),
  });

  // Odpowiedź ma powstać do końca (i zapisać się w bazie) nawet wtedy,
  // gdy ktoś w trakcie zamknie kartę albo odświeży stronę.
  result.consumeStream();

  let steps = 0;

  // 4. Odsyłamy odpowiedź kawałek po kawałku, razem ze źródłami i informacjami o odpowiedzi.
  return createUIMessageStreamResponse({
    stream: toUIMessageStream<typeof agentTools, UIMessage<AgentMetadata>>({
      stream: result.stream,
      tools: agentTools,
      sendSources: true,
      onError: () => "Model nie odpowiedział. Spróbuj ponownie za chwilę.",
      messageMetadata: ({ part }) => {
        // Na początku odpowiedzi przeglądarka dostaje numer rozmowy — kolejne wiadomości dopisze do niej.
        if (part.type === "start") return { conversationId };
        if (part.type === "finish-step") {
          steps += 1;
          return { model: part.response.modelId };
        }
        if (part.type === "finish") {
          return {
            conversationId,
            steps,
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
      // 5. Zapis do bazy: raz, po zakończeniu całej odpowiedzi (a nie po każdym kawałku streamingu).
      onEnd: async ({ responseMessage }) => {
        const assistantText = messageText(responseMessage);
        if (!conversationId || !userText || !assistantText) return;
        try {
          await saveExchange(conversationId, userText, assistantText);
        } catch (error) {
          console.error("Nie udało się zapisać wiadomości:", error);
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
