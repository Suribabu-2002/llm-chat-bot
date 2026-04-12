"use client";

import { useRef, useState } from "react";
import { useChatStore } from "@/hooks/use-chat-store";
import { useAutoResize } from "@/hooks/use-auto-resize";
import { useStreaming } from "@/hooks/use-streaming";
import { MAX_INPUT_LEN } from "@/lib/constants";

export default function ChatInput() {
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const [value, setValue] = useState("");
  const { activeChat } = useChatStore();
  const { sendMessage, isStreaming } = useStreaming();
  const { resize } = useAutoResize(textRef, 220);

  const handleSendMessage = async () => {
    const nextValue = value.trim();
    if (!nextValue) return;

    setValue("");
    resize();
    await sendMessage(nextValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSendMessage();
    }
  };

  return (
    <div className="border-t border-border bg-surface2">
      <div className="flex items-end gap-2 px-4 py-3">
        <label className="sr-only" htmlFor="chat-input">
          Message
        </label>
        <textarea
          id="chat-input"
          ref={textRef}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, MAX_INPUT_LEN))}
          onKeyDown={handleKeyDown}
          rows={1}
          className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed text-text placeholder:text-text-hint max-h-56"
          placeholder="Type a message... (Shift+Enter for newline)"
          maxLength={MAX_INPUT_LEN}
          disabled={isStreaming || !activeChat}
        />
        <button
          type="button"
          onClick={() => void handleSendMessage()}
          className={`flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-xs transition-all ${
            value.trim() && !isStreaming
              ? "bg-accent border-accent text-text hover:brightness-110"
              : "bg-surface3 border-border text-text-hint cursor-not-allowed"
          }`}
          disabled={isStreaming || !value.trim() || !activeChat}
        >
          {isStreaming ? "..." : "Send"}
        </button>
      </div>
      <div className="hidden px-4 pb-3 text-[10px] text-text-hint md:block">
        Powered by{" "}
        <a
          href="https://ollama.com"
          target="_blank"
          rel="noreferrer"
          className="text-accent hover:underline"
        >
          Ollama
        </a>
        {" · "}
        <a
          href="https://github.com/ollama/ollama/blob/main/docs/modelfile.md#parameters"
          target="_blank"
          rel="noreferrer"
          className="text-accent hover:underline"
        >
          docs
        </a>
      </div>
    </div>
  );
}
