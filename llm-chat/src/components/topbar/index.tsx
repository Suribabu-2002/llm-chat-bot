"use client";

import { useChatStore } from "@/hooks/use-chat-store";

export default function Topbar() {
  const { activeChat, createChat, sortedChats } = useChatStore();

  return (
    <header className="sticky top-0 z-10 bg-bg/90 backdrop-blur">
      <nav className="flex h-[42px] items-center justify-between border-b border-border px-3">
        <div className="flex items-center gap-2 text-sm text-text">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border">
            AI
          </span>
          <span>LLM Chat</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-text-hint sm:block">
            {activeChat?.title ?? "New chat"}
          </span>
          <button
            type="button"
            onClick={createChat}
            className="rounded-md border border-border px-2 py-1 text-xs text-text-hint transition-colors hover:bg-surface3 hover:text-text"
          >
            New chat ({sortedChats.length})
          </button>
        </div>
      </nav>
    </header>
  );
}
