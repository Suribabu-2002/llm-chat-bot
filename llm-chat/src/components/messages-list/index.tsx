"use client";

import { useChatStore } from "@/hooks/use-chat-store";

export default function MessagesList() {
  const { activeChatId, deleteChat, sortedChats, switchChat } = useChatStore();

  return (
    <div className="flex flex-col h-full pb-10">
      {sortedChats.length === 0 ? (
        <div className="flex flex-1 items-center justify-center flex-col">
          <p className="text-text-hint text-center mt-8">
            Select a chat to continue
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {sortedChats.map((chat) => {
            const isActive = chat.id === activeChatId;
            return (
              <div
                key={chat.id}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors ${
                  isActive
                    ? "bg-accent text-text"
                    : "bg-surface2 text-text-hint hover:text-text"
                }`}
              >
                <button
                  type="button"
                  onClick={() => switchChat(chat.id)}
                  className="flex-1 truncate text-left text-sm"
                >
                  {chat.title}
                </button>
                <span className="text-xs">{chat.messages.length} msgs</span>
                <button
                  type="button"
                  onClick={() => deleteChat(chat.id)}
                  className="text-xs opacity-70 hover:opacity-100"
                  aria-label="Delete chat"
                >
                  x
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
