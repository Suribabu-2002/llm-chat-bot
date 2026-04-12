"use client";

import { useState } from "react";
import { ChatProvider } from "@/hooks/use-chat-store";
import Topbar from "@/components/topbar";
import Sidebar from "@/components/sidebar";
import Messages from "@/components/messages";
import Input from "@/components/chat-input";
import { useChatStore } from "@/hooks/use-chat-store";

export default function Home() {
  return (
    <ChatProvider>
      <ChatShell />
    </ChatProvider>
  );
}

function ChatShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { queuePosition } = useChatStore();

  return (
    <div className="chat-app-shell">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className="chat-main-shell">
        <Topbar
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
        />
        <div className={`queue-banner ${queuePosition ? "visible" : ""}`}>
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
          <span>
            {queuePosition
              ? `${queuePosition} request${queuePosition > 1 ? "s" : ""} ahead - waiting...`
              : ""}
          </span>
        </div>
        <Messages />
        <Input />
      </div>
    </div>
  );
}
