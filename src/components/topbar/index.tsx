"use client";

import { useChatStore } from "@/hooks/use-chat-store";

export default function Topbar({
  sidebarCollapsed,
  onToggleSidebar,
}: {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}) {
  const { activeChat } = useChatStore();

  return (
    <header className="chat-topbar">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="sidebar-toggle-button flex"
        aria-label={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
        title="Toggle sidebar"
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="2" width="12" height="12" rx="2" />
          <line x1="6" y1="2" x2="6" y2="14" />
        </svg>
      </button>
      <div className="chat-topbar-title">{activeChat?.title ?? "New chat"}</div>
      <div className="chat-model-badge">qwen3.5:2b | localhost</div>
    </header>
  );
}
