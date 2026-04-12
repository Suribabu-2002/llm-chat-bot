import { NextRequest } from "next/server";
import ollama from "ollama";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { messages } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages array is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await ollama.chat({
          model: process.env.OLLAMA_MODEL ?? "glm-5.1:cloud",
          messages,
          stream: true,
          think: false,
        });

        for await (const chunk of response) {
          const text = chunk.message.content;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(text)}\n\n`));
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err: any) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify("[ERROR] " + err.message)}\n\n`)
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}