"use client";

import { useRef, useState } from "react";
import { useAutoResize } from "@/hooks/use-auto-resize";
import { useStreaming } from "@/hooks/use-streaming";
import { MAX_INPUT_LEN } from "@/lib/constants";

export default function Input() {
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const [value, setValue] = useState("");
  const { resize } = useAutoResize(textRef, 160);
  const { sendMessage, isStreaming } = useStreaming();

  const handleSubmit = async () => {
    const nextValue = value.trim();
    if (!nextValue) return;

    setValue("");
    resize();
    await sendMessage(nextValue);
  };

  return (
    <div className="flex items-center gap-2 border-t border-border bg-surface2 px-4 py-3">
      <textarea
        ref={textRef}
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, MAX_INPUT_LEN))}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void handleSubmit();
          }
        }}
        rows={1}
        className="flex-1 resize-none bg-transparent text-sm text-text outline-none"
        placeholder="Type a message..."
        disabled={isStreaming}
      />
      <button
        type="button"
        onClick={() => void handleSubmit()}
        disabled={isStreaming || !value.trim()}
        className="rounded-full border border-border px-3 py-1 text-xs text-text-hint disabled:cursor-not-allowed"
      >
        {isStreaming ? "..." : "Send"}
      </button>
    </div>
  );
}
