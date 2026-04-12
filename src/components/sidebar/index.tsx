"use client";

import { useChatStore } from "@/hooks/use-chat-store";
import { useTokenEstimate } from "@/hooks/use-token-estimate";
import type { Chat } from "@/types/chat";
import { Dispatch, SetStateAction } from "react";

export default function Sidebar({
  collapsed,
  setCollapsed,
}: Readonly<{
  collapsed: boolean;
  setCollapsed?: Dispatch<SetStateAction<boolean>>;
}>) {
  const {
    activeChat,
    activeChatId,
    createChat,
    deleteChat,
    sortedChats,
    switchChat,
  } = useChatStore();
  const { percentage, displayText, barColor } = useTokenEstimate(
    activeChat?.messages ?? [],
  );

  return (
    <aside className={`chat-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="chat-sidebar-top">
        <div className="sidebar-logo-row">
          <div className="sidebar-logo-dot" />
          <span>Local AI</span>
          <button
            type="button"
            onClick={() => setCollapsed?.((prev) => !prev)}
            className="sidebar-toggle-button display-left-nav"
            aria-label={collapsed ? "Show sidebar" : "Hide sidebar"}
            title="Toggle sidebar"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="2" y="2" width="12" height="12" rx="2" />
              <line x1="6" y1="2" x2="6" y2="14" />
            </svg>
          </button>
        </div>
        <button type="button" className="new-chat-button" onClick={createChat}>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <line x1="8" y1="3" x2="8" y2="13" />
            <line x1="3" y1="8" x2="13" y2="8" />
          </svg>
          <span>New chat</span>
        </button>
      </div>

      <div className="sidebar-section-label">Recents</div>

      <div className="chat-list-panel">
        {sortedChats.length === 0 ? (
          <div className="chat-list-empty">No chats yet</div>
        ) : (
          sortedChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === activeChatId}
              onDelete={deleteChat}
              onSelect={switchChat}
            />
          ))
        )}
      </div>

      <div className="chat-sidebar-footer">
        <div className="token-info-row">
          <span>Context used</span>
          <span>{displayText}</span>
        </div>
        <div className="token-bar-track">
          <div
            className="token-bar-fill"
            style={{ width: `${percentage}%`, backgroundColor: barColor }}
          />
        </div>
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
    <div className={`chat-list-item ${isActive ? "active" : ""}`}>
      <button
        type="button"
        className="chat-list-select"
        onClick={() => onSelect(chat.id)}
        title={chat.title}
      >
        {chat.title}
      </button>
      <button
        type="button"
        className="chat-list-delete"
        onClick={() => onDelete(chat.id)}
        aria-label={`Delete ${chat.title}`}
        title="Delete"
      >
        x
      </button>
    </div>
  );
}
