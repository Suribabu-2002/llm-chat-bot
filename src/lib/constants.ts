export const MAX_CTX = 32000;
export const MAX_INPUT_LEN = 4000;
export const LS_KEY = "ollama_chats_v1";
export const MODEL_NAME = "glm-5.1:cloud";

export const SUGGESTIONS = [
  { label: "Explain async/await", prompt: "Explain async/await in JavaScript" },
  {
    label: "Flatten a list in Python",
    prompt: "Write a Python function to flatten a nested list",
  },
  {
    label: "REST vs GraphQL",
    prompt: "What is the difference between REST and GraphQL?",
  },
  {
    label: "V8 garbage collection",
    prompt: "How does garbage collection work in V8?",
  },
] as const;
