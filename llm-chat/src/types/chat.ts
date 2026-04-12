export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export type ChatStore = Record<string, Chat>;

export type SSEEvent =
  | { type: "chunk"; text: string }
  | { type: "queue"; position: number }
  | { type: "done" }
  | { type: "error"; message: string };

export type StreamingStatus = "idle" | "streaming" | "queued" | "error";

export interface TokenMeterData {
  tokens: number;
  maxTokens: number;
  percentage: number;
  displayText: string;
  barColor: string;
}