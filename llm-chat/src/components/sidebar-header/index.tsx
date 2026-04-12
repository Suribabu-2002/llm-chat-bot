"use client";

import { useChatStore } from "@/hooks/use-chat-store";

export default function SidebarHeader() {
  const { activeChat, sortedChats } = useChatStore();

  return (
    <div className="p-3">
      <div className="flex items-center gap-3 text-text">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold">
          AI
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">
            {activeChat?.title ?? "New chat"}
          </div>
          <div className="text-xs text-text-hint">{sortedChats.length} saved chats</div>
        </div>
      </div>
    </div>
  );
}
