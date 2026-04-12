"use client";

import { useChatStore } from "@/hooks/use-chat-store";

export default function Messages() {
  const { activeChat } = useChatStore();

  return (
    <main className="flex-1 overflow-y-auto scrollbar-chat">
      <div className="px-5 py-5 pb-14">
        {activeChat?.messages.length === 0 && (
          <div className="py-10 text-sm text-text-hint">
            Start the conversation by sending a message.
          </div>
        )}
        {activeChat?.messages.map((m, index) => (
          <MessageBlock
            key={`${m.role}-${index}`}
            m={m}
            isLast={index === activeChat.messages.length - 1}
          />
        ))}
      </div>
    </main>
  );
}

function MessageBlock({
  m,
  isLast,
}: {
  m: { role: string; content: string };
  isLast: boolean;
}) {
  const isUser = m.role === "user";

  return (
    <div
      className={`mb-3 flex gap-3 animate-fadeUp ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div className="flex w-8 items-start justify-center pt-1">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
            isUser
              ? "border border-border bg-surface3 text-text"
              : "bg-gradient-to-br from-purple-300 via-purple-400 to-purple-600 text-white shadow-sm"
          }`}
        >
          {isUser ? "U" : "A"}
        </div>
      </div>
      <div className="flex-1">
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser ? "bg-user-bg text-text" : "bg-surface text-text"
          }`}
        >
          <div className="whitespace-pre-wrap">
            {m.content || (isLast && !isUser ? "..." : "")}
          </div>
        </div>
      </div>
    </div>
  );
}
