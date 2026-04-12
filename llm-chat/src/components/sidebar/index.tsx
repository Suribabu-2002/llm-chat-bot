"use client";

import { useChatStore } from "@/hooks/use-chat-store";
import { useTokenEstimate } from "@/hooks/use-token-estimate";
import type { Chat } from "@/types/chat";

export default function Sidebar() {
  const { activeChatId, createChat, deleteChat, sortedChats, switchChat } = useChatStore();
  const { tokens, percentage } = useTokenEstimate(sortedChats.flatMap((c) => c.messages));

  return (
    <aside className="hidden w-72 shrink-0 border-r border-border bg-surface/40 md:flex md:flex-col">
      <div className="p-3">
        <button
          type="button"
          onClick={createChat}
          className="w-full rounded-xl border border-border bg-surface2 px-3 py-3 text-left text-sm font-medium text-text transition-colors hover:border-accent/40 hover:bg-surface3"
        >
          New chat
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        <div className="mb-2 text-xs font-medium text-text-hint">
          {sortedChats.length} {sortedChats.length === 1 ? "chat" : "chats"} · {tokens} tokens
        </div>
        <div className="space-y-1">
          {sortedChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === activeChatId}
              onDelete={deleteChat}
              onSelect={switchChat}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-border px-3 py-3">
        <TokenBar percentage={percentage} />
      </div>
    </aside>
  );
}

function ChatItem({
  chat,
  isActive,
  onDelete,
  onSelect,
}: {
  chat: Chat;
  isActive: boolean;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg p-2 text-sm transition-colors ${
        isActive
          ? "bg-accent-dim text-text"
          : "text-text-hint hover:bg-surface3 hover:text-text"
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(chat.id)}
        className="flex-1 truncate text-left"
      >
        {chat.title}
      </button>
      <button
        type="button"
        onClick={() => onDelete(chat.id)}
        className="rounded p-1 text-text-hint hover:text-warning"
        aria-label="Delete chat"
      >
        x
      </button>
    </div>
  );
}

function TokenBar({ percentage }: { percentage: number }) {
  if (percentage <= 1.5) return null;

  const width = Math.min(percentage / 1.5, 100) + "%";
  return (
    <div className="flex items-center gap-2 text-xs text-text-hint">
      <div
        className="h-1.5 flex-1 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.08)", width: "100%" }}
      >
        <div
          className="h-full rounded-full"
          style={{ background: "#a78bfa", width }}
        />
      </div>
    </div>
  );
}
