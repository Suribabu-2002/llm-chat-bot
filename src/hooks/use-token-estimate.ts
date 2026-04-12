"use client";

import { useMemo } from "react";
import type { Message, TokenMeterData } from "@/types/chat";
import { MAX_CTX } from "@/lib/constants";

export function useTokenEstimate(messages: Message[]): TokenMeterData {
  return useMemo(() => {
    const tokens = Math.round(
      messages.reduce((sum, m) => sum + m.content.length, 0) / 4
    );
    const percentage = Math.min((tokens / MAX_CTX) * 100, 100);
    const displayText =
      tokens >= 1000
        ? `${(tokens / 1000).toFixed(1)}k / 32k`
        : `${tokens} / 32k`;

    const barColor =
      percentage > 80 ? "#f87171" : percentage > 55 ? "#fbbf24" : "#a78bfa";

    return { tokens, maxTokens: MAX_CTX, percentage, displayText, barColor };
  }, [messages]);
}