"use client";

import { useRef, useCallback } from "react";
import type { Message } from "@/types/chat";
import { parseSSELines, parseSSEData } from "@/lib/sse-parser";
import { useChatStore } from "./use-chat-store";

export function useStreaming() {
  const {
    activeChatId,
    isStreaming,
    setStreaming,
    appendStreaming,
    resetStreaming,
    addMessage,
    updateLastAssistant,
    setQueuePosition,
    updateTitle,
    activeChat,
  } = useChatStore();

  const controllerRef = useRef<AbortController | null>(null);
  const rawBufRef = useRef("");
  const rafRef = useRef<number | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const chatId = activeChatId ?? "";
      if (!chatId) return;

      // Add user message
      addMessage(chatId, { role: "user", content: text.trim() });

      // Update title on first message
      if (activeChat && activeChat.messages.length === 0) {
        const title = text.trim().slice(0, 42) + (text.trim().length > 42 ? "…" : "");
        updateTitle(chatId, title);
      }

      // Add empty assistant placeholder
      addMessage(chatId, { role: "assistant", content: "" });

      setStreaming(true);
      resetStreaming();
      rawBufRef.current = "";

      const controller = new AbortController();
      controllerRef.current = controller;

      let hasReal = false;

      const scheduleRender = (chatIdInner: string) => {
        if (rafRef.current) return;
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          updateLastAssistant(chatIdInner, rawBufRef.current);
        });
      };

      try {
        const messages: Message[] = [
          ...(activeChat?.messages ?? []),
          { role: "user", content: text.trim() },
        ];

        const res = await fetch("/api/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const reader = res.body!.getReader();
        const dec = new TextDecoder();
        let sseBuf = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          sseBuf += dec.decode(value, { stream: true });
          const { remaining, events } = parseSSELines(sseBuf);
          sseBuf = remaining;

          for (const line of events) {
            const event = parseSSEData(line);
            if (!event) continue;

            if (event.type === "queue") {
              setQueuePosition(event.position);
              continue;
            }

            if (event.type === "done") {
              setQueuePosition(null);
              break;
            }

            setQueuePosition(null);

            if (event.type === "error") {
              rawBufRef.current = `[ERROR] ${event.message}`;
              updateLastAssistant(chatId, rawBufRef.current);
              continue;
            }

            if (event.type === "chunk") {
              rawBufRef.current += event.text;
              if (!hasReal && rawBufRef.current.trim().length > 0) {
                hasReal = true;
              }
              if (hasReal) scheduleRender(chatId);
            }
          }
        }

        // Finalize
        if (rawBufRef.current.trim()) {
          updateLastAssistant(chatId, rawBufRef.current.trim());
        }
      } catch (err: any) {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        setQueuePosition(null);

        if (err.name === "AbortError") {
          if (rawBufRef.current.trim()) {
            updateLastAssistant(chatId, rawBufRef.current.trim());
          } else {
            updateLastAssistant(chatId, "— stopped");
          }
        } else {
          updateLastAssistant(
            chatId,
            `Could not reach localhost:3000\n${err.message}`
          );
        }
      } finally {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        controllerRef.current = null;
        setStreaming(false);
      }
    },
    [
      activeChatId,
      isStreaming,
      activeChat,
      addMessage,
      updateLastAssistant,
      setStreaming,
      appendStreaming,
      resetStreaming,
      setQueuePosition,
      updateTitle,
    ]
  );

  const stopStreaming = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  }, []);

  return { sendMessage, stopStreaming, isStreaming };
}