"use client";

import { ChatProvider } from "@/hooks/use-chat-store";
import Topbar from "@/components/topbar";
import Sidebar from "@/components/sidebar";
import Messages from "@/components/messages";
import Input from "@/components/chat-input";

export default function Home() {
  return (
    <ChatProvider>
      <div className="flex h-screen flex-col">
        <Topbar />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Messages />
            <Input />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}
