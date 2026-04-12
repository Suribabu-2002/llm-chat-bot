"use client";

import { useEffect, useRef } from "react";
import { useChatStore } from "@/hooks/use-chat-store";
import MarkdownContent from "../markdown/markdown";
import ThinkingState from "../markdown/thinkingState";

export default function Messages() {
  const { activeChat, mounted } = useChatStore();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [activeChat?.messages]);

  return (
    <main ref={scrollRef} className="chat-messages-scroll">
      <div className="chat-messages-wrap">
        {!mounted ? null : !activeChat?.messages.length ? (
          <EmptyState />
        ) : (
          activeChat.messages.map((message, index) => (
            <MessageBlock
              key={`${message.role}-${index}`}
              role={message.role === "user" ? "user" : "assistant"}
              content={message.content}
            />
          ))
        )}
      </div>
    </main>
  );
}

function EmptyState() {
  const prompts = [
    "Explain async/await in JavaScript",
    "Write a Python function to flatten a nested list",
    "What is the difference between REST and GraphQL?",
    "How does garbage collection work in V8?",
  ];

  const fillPrompt = (prompt: string) => {
    window.dispatchEvent(new CustomEvent("chat:fill-prompt", { detail: prompt }));
  };

  return (
    <div className="empty-chat-state">
      <div className="empty-chat-icon">*</div>
      <h2>What&apos;s on your mind?</h2>
      <p>Powered by your local Ollama instance. Nothing leaves your machine.</p>
      <div className="empty-chat-suggestions">
        {prompts.map((prompt) => (
          <button key={prompt} type="button" onClick={() => fillPrompt(prompt)}>
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBlock({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  return (
    <article className={`chat-message ${role}`}>
      <div className={`message-avatar ${role}`}>
        {role === "assistant" ? "*" : "U"}
      </div>
      <div className="message-bubble-wrap">
        <div className="message-sender">
          {role === "assistant" ? "Local AI" : "You"}
        </div>
        <div className={`message-content ${role === "assistant" ? "markdown-body" : "user-pill"}`}>
          {role === "assistant" ? (
            content ? (
              <MarkdownContent content={content} />
            ) : (
              <ThinkingState />
            )
          ) : (
            content
          )}
        </div>
      </div>
    </article>
  );
}
