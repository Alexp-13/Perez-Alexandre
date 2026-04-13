import { readFile } from "node:fs/promises";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const GEMINI_MODEL = "gemini-3-flash-preview";

let portfolioContextPromise: Promise<string> | null = null;

async function loadPortfolioContext() {
  if (!portfolioContextPromise) {
    portfolioContextPromise = (async () => {
      const [me, projects, technos] = await Promise.all([
        readFile(new URL("../src/assets/data/me.md", import.meta.url), "utf8"),
        readFile(new URL("../src/assets/data/projects.md", import.meta.url), "utf8"),
        readFile(new URL("../src/assets/data/technos.md", import.meta.url), "utf8"),
      ]);

      return [
        "### PROFIL",
        me,
        "",
        "### PROJETS",
        projects,
        "",
        "### TECHNOLOGIES",
        technos,
      ].join("\n");
    })();
  }

  return portfolioContextPromise;
}

function getSystemInstruction(portfolioContext: string) {
  return [
    "Tu es l'assistant portfolio d'Alexandre Perez.",
    "But: aider des recruteurs a comprendre rapidement son profil, ses projets, ses competences, son parcours et sa valeur.",
    "Regles importantes:",
    "- Reponds en francais sauf si la question est clairement dans une autre langue.",
    "- Appuie-toi uniquement sur les informations fournies dans le CONTEXTE PORTFOLIO ci-dessous.",
    "- Si une info n'est pas dans le contexte, dis-le clairement et propose de contacter Alexandre.",
    "- Reste concis, professionnel et concret.",
    "- Quand pertinent, propose une synthese en puces.",
    "",
    "CONTEXTE PORTFOLIO:",
    portfolioContext,
  ].join("\n");
}

function buildGeminiPayload(messages: ChatMessage[], systemInstruction: string) {
  const history = messages.slice(0, -1);
  const latestUserMessage = messages[messages.length - 1];

  const contents = [
    ...history.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    })),
    {
      role: "user",
      parts: [{ text: latestUserMessage.content }],
    },
  ];

  return {
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    contents,
    generationConfig: {
      temperature: 0.3,
      topP: 0.9,
      maxOutputTokens: 1024,
    },
  };
}

function extractTextFromChunk(json: unknown) {
  if (!json || typeof json !== "object") {
    return "";
  }

  const candidates = (json as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> })
    .candidates;
  const first = candidates?.[0];
  const parts = first?.content?.parts;

  if (!parts || !Array.isArray(parts)) {
    return "";
  }

  return parts
    .map((part) => (typeof part.text === "string" ? part.text : ""))
    .join("");
}

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return new Response("Missing GOOGLE_API_KEY on server", { status: 500 });
  }

  let body: { messages?: ChatMessage[] };

  try {
    body = (await req.json()) as { messages?: ChatMessage[] };
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const messages = body.messages ?? [];
  const hasValidMessages =
    Array.isArray(messages) &&
    messages.length > 0 &&
    messages.every(
      (message) =>
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0,
    ) &&
    messages[messages.length - 1]?.role === "user";

  if (!hasValidMessages) {
    return new Response("Body must include messages ending with a user message", { status: 400 });
  }

  const portfolioContext = await loadPortfolioContext();
  const systemInstruction = getSystemInstruction(portfolioContext);
  const payload = buildGeminiPayload(messages, systemInstruction);

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`;
  const upstream = await fetch(geminiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!upstream.ok || !upstream.body) {
    const errorText = await upstream.text();
    return new Response(errorText || "Gemini request failed", { status: upstream.status || 500 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();

            if (!trimmed.startsWith("data:")) {
              continue;
            }

            const data = trimmed.slice(5).trim();

            if (!data || data === "[DONE]") {
              continue;
            }

            try {
              const parsed = JSON.parse(data) as unknown;
              const textChunk = extractTextFromChunk(parsed);

              if (textChunk) {
                controller.enqueue(encoder.encode(textChunk));
              }
            } catch {
              // Ignore malformed SSE chunks and continue streaming.
            }
          }
        }

        const finalTrimmed = buffer.trim();

        if (finalTrimmed.startsWith("data:")) {
          const data = finalTrimmed.slice(5).trim();

          if (data && data !== "[DONE]") {
            try {
              const parsed = JSON.parse(data) as unknown;
              const textChunk = extractTextFromChunk(parsed);

              if (textChunk) {
                controller.enqueue(encoder.encode(textChunk));
              }
            } catch {
              // Ignore trailing malformed chunk.
            }
          }
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
