"use client";

import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/hooks/use-chat-store";
import { useAutoResize } from "@/hooks/use-auto-resize";
import { useStreaming } from "@/hooks/use-streaming";
import { MAX_INPUT_LEN } from "@/lib/constants";

export default function ChatInput() {
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const [value, setValue] = useState("");
  const { activeChat, isStreaming } = useChatStore();
  const { sendMessage, stopStreaming } = useStreaming();
  const { resize } = useAutoResize(textRef, 160);

  useEffect(() => {
    const handleFillPrompt = (event: Event) => {
      const prompt = (event as CustomEvent<string>).detail ?? "";
      setValue(prompt.slice(0, MAX_INPUT_LEN));
      requestAnimationFrame(() => {
        resize();
        textRef.current?.focus();
      });
    };

    window.addEventListener("chat:fill-prompt", handleFillPrompt as EventListener);
    return () => {
      window.removeEventListener("chat:fill-prompt", handleFillPrompt as EventListener);
    };
  }, [resize]);

  const handleSendMessage = async () => {
    const nextValue = value.trim();
    if (!nextValue || !activeChat || isStreaming) return;

    setValue("");
    resize();
    await sendMessage(nextValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSendMessage();
    }
  };

  const canSend = Boolean(value.trim()) && !isStreaming && Boolean(activeChat);

  return (
    <div className="chat-input-shell">
      <div className="chat-input-wrap">
        <label className="sr-only" htmlFor="chat-input">
          Message
        </label>
        <textarea
          id="chat-input"
          ref={textRef}
          value={value}
          onChange={(event) => setValue(event.target.value.slice(0, MAX_INPUT_LEN))}
          onKeyDown={handleKeyDown}
          rows={1}
          className="chat-textarea"
          placeholder="Message..."
          maxLength={MAX_INPUT_LEN}
          disabled={isStreaming || !activeChat}
        />
        {isStreaming ? (
          <button
            type="button"
            className="chat-stop-button"
            onClick={stopStreaming}
            title="Stop"
            aria-label="Stop streaming"
          >
            <svg viewBox="0 0 16 16">
              <rect x="3" y="3" width="10" height="10" rx="2" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            className={`chat-send-button ${canSend ? "active" : ""}`}
            onClick={() => void handleSendMessage()}
            disabled={!canSend}
            title="Send"
            aria-label="Send message"
          >
            <svg viewBox="0 0 16 16">
              <path d="M14 8L2 2l2 6-2 6z" />
            </svg>
          </button>
        )}
      </div>
      <p className="chat-footer-note">Streaming from localhost:3000 | history saved in browser</p>
    </div>
  );
}
