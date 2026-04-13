import { useMemo, useRef, useState } from "react";
import type { FormEvent, WheelEvent } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const SUGGESTIONS = [
  "Resume-moi le profil d'Alexandre en 5 points.",
  "Quels projets montrent le mieux ses competences backend ?",
  "Quelles technos maitrise-t-il concretement ?",
];

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  h1: ({ children }) => <h1 className="mb-2 text-base font-semibold text-text-primary">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-2 text-sm font-semibold text-text-primary">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-2 text-sm font-semibold text-text-primary">{children}</h3>,
  blockquote: ({ children }) => (
    <blockquote className="mb-2 border-l-2 border-accent/60 pl-3 text-text-secondary/90 last:mb-0">
      {children}
    </blockquote>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-accent-light underline decoration-accent/60 underline-offset-2 hover:text-accent"
    >
      {children}
    </a>
  ),
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto rounded-lg border border-border bg-deep-900/90 p-2 text-xs last:mb-0">
      {children}
    </pre>
  ),
  code: ({ children, className }) => {
    const hasLanguage = Boolean(className?.includes("language-"));

    if (hasLanguage) {
      return <code className="font-mono text-xs text-accent-light">{children}</code>;
    }

    return (
      <code className="rounded bg-deep-900/90 px-1 py-0.5 font-mono text-[0.8em] text-accent-light">
        {children}
      </code>
    );
  },
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const canSend = input.trim().length > 0 && !isLoading;
  const panelSizeClass = isExpanded
    ? "h-[min(82vh,760px)] w-[min(96vw,760px)]"
    : "h-[min(70vh,620px)] w-[min(94vw,520px)]";

  const emptyState = useMemo(
    () => (
      <div className="space-y-3 text-sm text-text-secondary">
        <p className="text-text-primary font-medium">Pose une question sur Alexandre</p>
        <p className="text-xs text-text-muted">
          Recruteurs: demarrez avec une question rapide pour obtenir une synthese du profil et des projets.
        </p>
        <div className="space-y-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setInput(suggestion)}
              className="w-full rounded-lg border border-border bg-deep-800/70 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:border-accent/60 hover:text-text-primary"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    ),
    [],
  );

  const scrollToBottom = () => {
    if (!scrollContainerRef.current) {
      return;
    }

    scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
  };

  const handlePanelWheel = (event: WheelEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const shouldKeepNativeScroll =
      target.closest("textarea") !== null || target.closest("pre") !== null || target.closest("code") !== null;

    if (shouldKeepNativeScroll) {
      event.stopPropagation();
      return;
    }

    if (!scrollContainerRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    scrollContainerRef.current.scrollTop += event.deltaY;
  };

  const sendMessage = async (event?: FormEvent) => {
    event?.preventDefault();

    if (!canSend) {
      return;
    }

    const userContent = input.trim();
    const userMessage: ChatMessage = {
      id: genId(),
      role: "user",
      content: userContent,
    };
    const assistantId = genId();

    setInput("");
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: assistantId,
        role: "assistant",
        content: "",
      },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      if (!response.ok || !response.body) {
        const errorText = await response.text();
        throw new Error(errorText || "Impossible de contacter le serveur.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });

        if (!chunk) {
          continue;
        }

        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? {
                  ...message,
                  content: message.content + chunk,
                }
              : message,
          ),
        );
        requestAnimationFrame(scrollToBottom);
      }
    } catch (error) {
      const fallback =
        error instanceof Error ? error.message : "Erreur inconnue pendant la generation de la reponse.";
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                content: `Desole, le chat est indisponible pour le moment. (${fallback})`,
              }
            : message,
        ),
      );
    } finally {
      setIsLoading(false);
      requestAnimationFrame(scrollToBottom);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9100]">
      {isOpen ? (
        <div
          onWheel={handlePanelWheel}
          className={`${panelSizeClass} flex flex-col overflow-hidden rounded-2xl border border-border bg-deep-900/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-sm`}
        >
          <div className="flex items-center justify-between border-b border-border bg-deep-800/70 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-text-primary">Assistant portfolio</p>
              <p className="text-[11px] text-text-muted">Gemini streaming</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsExpanded((value) => !value)}
                className="rounded-lg border border-border px-2 py-1 text-xs text-text-secondary hover:border-accent/70 hover:text-text-primary"
                aria-label={isExpanded ? "Reduire le chat" : "Agrandir le chat"}
              >
                {isExpanded ? "Reduire" : "Agrandir"}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-border px-2 py-1 text-xs text-text-secondary hover:border-accent/70 hover:text-text-primary"
                aria-label="Fermer le chat"
              >
                Fermer
              </button>
            </div>
          </div>

          <div ref={scrollContainerRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4">
            {messages.length === 0 ? (
              emptyState
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[90%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "ml-auto bg-accent/20 text-text-primary"
                      : "mr-auto border border-border bg-deep-800/80 text-text-secondary"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={markdownComponents}>
                      {message.content || (isLoading ? "..." : "")}
                    </ReactMarkdown>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              ))
            )}
          </div>

          <form onSubmit={sendMessage} className="border-t border-border bg-deep-800/60 p-3">
            <label htmlFor="portfolio-chat-input" className="sr-only">
              Message
            </label>
            <div className="flex items-end gap-2">
              <textarea
                id="portfolio-chat-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Pose ta question..."
                rows={2}
                className="max-h-36 min-h-12 flex-1 resize-y rounded-lg border border-border bg-deep-900 px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent/70"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white transition-opacity hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-40"
              >
                Envoyer
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex h-16 items-center gap-3 rounded-full border border-accent/60 bg-accent/90 px-6 text-white shadow-[0_14px_40px_rgba(79,70,229,0.4)] transition-transform hover:scale-105 hover:bg-accent"
          aria-label="Ouvrir le chat"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-2" aria-hidden="true">
            <path d="M5 18L3 21l3.5-1.4A9 9 0 1012 3a9 9 0 00-7 15z" />
          </svg>
          <span className="text-base font-semibold text-white">Assistant IA</span>
        </button>
      )}
    </div>
  );
}
