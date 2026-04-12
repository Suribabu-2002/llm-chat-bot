import type { ChatStore } from "@/types/chat";
import { LS_KEY } from "./constants";

export function loadChats(): ChatStore {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveChats(chats: ChatStore): void {
  localStorage.setItem(LS_KEY, JSON.stringify(chats));
}