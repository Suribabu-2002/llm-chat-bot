import type { SSEEvent } from "@/types/chat";

export function parseSSELines(buffer: string): {
  remaining: string;
  events: string[];
} {
  const lines = buffer.split("\n");
  const remaining = lines.pop()!;
  const events = lines.filter((l) => l.startsWith("data:"));
  return { remaining, events };
}

export function parseSSEData(raw: string): SSEEvent | null {
  const data = raw.slice(5).trim();

  if (data.startsWith("[QUEUE:")) {
    const match = data.match(/\[QUEUE:(\d+)\]/);
    if (match) return { type: "queue", position: parseInt(match[1], 10) };
  }

  if (data === "[DONE]") return { type: "done" };

  try {
    const parsed = JSON.parse(data);
    if (typeof parsed === "string" && parsed.startsWith("[ERROR] ")) {
      return { type: "error", message: parsed.slice(8) };
    }
    return { type: "chunk", text: parsed };
  } catch {
    return null;
  }
}