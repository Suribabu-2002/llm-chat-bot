"use client";

import {
  createContext,
  createElement,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { Chat, ChatStore, Message } from "@/types/chat";
import { loadChats, saveChats } from "@/lib/storage";

interface ChatState {
  chats: ChatStore;
  activeChatId: string | null;
  isStreaming: boolean;
  streamingContent: string;
  queuePosition: number | null;
  mounted: boolean;
}

type ChatAction =
  | { type: "HYDRATE"; chats: ChatStore }
  | { type: "CREATE_CHAT"; chat: Chat }
  | { type: "DELETE_CHAT"; id: string }
  | { type: "SWITCH_CHAT"; id: string }
  | { type: "ADD_MESSAGE"; chatId: string; message: Message }
  | { type: "UPDATE_LAST_ASSISTANT"; chatId: string; content: string }
  | { type: "SET_STREAMING"; streaming: boolean }
  | { type: "APPEND_STREAMING"; chunk: string }
  | { type: "RESET_STREAMING" }
  | { type: "SET_QUEUE"; position: number | null }
  | { type: "UPDATE_TITLE"; chatId: string; title: string };

const initialState: ChatState = {
  chats: {},
  activeChatId: null,
  isStreaming: false,
  streamingContent: "",
  queuePosition: null,
  mounted: false,
};

function makeChat(): Chat {
  return {
    id: "c" + Date.now(),
    title: "New chat",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function persist(chats: ChatStore) {
  saveChats(chats);
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "HYDRATE": {
      return { ...state, chats: action.chats, mounted: true };
    }
    case "CREATE_CHAT": {
      const chats = { ...state.chats, [action.chat.id]: action.chat };
      persist(chats);
      return { ...state, chats, activeChatId: action.chat.id };
    }
    case "DELETE_CHAT": {
      const chats = { ...state.chats };
      delete chats[action.id];
      persist(chats);
      return { ...state, chats };
    }
    case "SWITCH_CHAT": {
      return { ...state, activeChatId: action.id };
    }
    case "ADD_MESSAGE": {
      const chat = state.chats[action.chatId];
      if (!chat) return state;
      const updated = {
        ...chat,
        messages: [...chat.messages, action.message],
        updatedAt: Date.now(),
      };
      const chats = { ...state.chats, [action.chatId]: updated };
      persist(chats);
      return { ...state, chats };
    }
    case "UPDATE_LAST_ASSISTANT": {
      const chat = state.chats[action.chatId];
      if (!chat) return state;
      const msgs = [...chat.messages];
      const lastIdx = msgs.length - 1;
      if (lastIdx >= 0 && msgs[lastIdx].role === "assistant") {
        msgs[lastIdx] = { ...msgs[lastIdx], content: action.content };
      }
      const updated = { ...chat, messages: msgs, updatedAt: Date.now() };
      const chats = { ...state.chats, [action.chatId]: updated };
      persist(chats);
      return { ...state, chats };
    }
    case "SET_STREAMING": {
      return { ...state, isStreaming: action.streaming };
    }
    case "APPEND_STREAMING": {
      return { ...state, streamingContent: state.streamingContent + action.chunk };
    }
    case "RESET_STREAMING": {
      return { ...state, streamingContent: "" };
    }
    case "SET_QUEUE": {
      return { ...state, queuePosition: action.position };
    }
    case "UPDATE_TITLE": {
      const chat = state.chats[action.chatId];
      if (!chat) return state;
      const updated = { ...chat, title: action.title };
      const chats = { ...state.chats, [action.chatId]: updated };
      persist(chats);
      return { ...state, chats };
    }
    default:
      return state;
  }
}

interface ChatContextValue extends ChatState {
  createChat: () => string;
  deleteChat: (id: string) => void;
  switchChat: (id: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateLastAssistant: (chatId: string, content: string) => void;
  setStreaming: (streaming: boolean) => void;
  appendStreaming: (chunk: string) => void;
  resetStreaming: () => void;
  setQueuePosition: (pos: number | null) => void;
  updateTitle: (chatId: string, title: string) => void;
  sortedChats: Chat[];
  activeChat: Chat | null;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  useEffect(() => {
    const chats = loadChats();
    dispatch({ type: "HYDRATE", chats });
    const sorted = Object.values(chats).sort((a, b) => b.updatedAt - a.updatedAt);
    if (sorted.length > 0) {
      dispatch({ type: "SWITCH_CHAT", id: sorted[0].id });
    } else {
      const chat = makeChat();
      dispatch({ type: "CREATE_CHAT", chat });
    }
  }, []);

  const createChat = useCallback(() => {
    const chat = makeChat();
    dispatch({ type: "CREATE_CHAT", chat });
    return chat.id;
  }, []);

  const deleteChat = useCallback((id: string) => {
    dispatch({ type: "DELETE_CHAT", id });
  }, []);

  const switchChat = useCallback((id: string) => {
    dispatch({ type: "SWITCH_CHAT", id });
  }, []);

  const addMessage = useCallback((chatId: string, message: Message) => {
    dispatch({ type: "ADD_MESSAGE", chatId, message });
  }, []);

  const updateLastAssistant = useCallback((chatId: string, content: string) => {
    dispatch({ type: "UPDATE_LAST_ASSISTANT", chatId, content });
  }, []);

  const setStreaming = useCallback((streaming: boolean) => {
    dispatch({ type: "SET_STREAMING", streaming });
  }, []);

  const appendStreaming = useCallback((chunk: string) => {
    dispatch({ type: "APPEND_STREAMING", chunk });
  }, []);

  const resetStreaming = useCallback(() => {
    dispatch({ type: "RESET_STREAMING" });
  }, []);

  const setQueuePosition = useCallback((pos: number | null) => {
    dispatch({ type: "SET_QUEUE", position: pos });
  }, []);

  const updateTitle = useCallback((chatId: string, title: string) => {
    dispatch({ type: "UPDATE_TITLE", chatId, title });
  }, []);

  const sortedChats = useMemo(
    () => Object.values(state.chats).sort((a, b) => b.updatedAt - a.updatedAt),
    [state.chats]
  );

  const activeChat = useMemo(
    () => (state.activeChatId ? state.chats[state.activeChatId] ?? null : null),
    [state.chats, state.activeChatId]
  );

  const value: ChatContextValue = {
    ...state,
    createChat,
    deleteChat,
    switchChat,
    addMessage,
    updateLastAssistant,
    setStreaming,
    appendStreaming,
    resetStreaming,
    setQueuePosition,
    updateTitle,
    sortedChats,
    activeChat,
  };

  return createElement(ChatContext.Provider, { value }, children);
}

export function useChatStore(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatStore must be used within ChatProvider");
  return ctx;
}
