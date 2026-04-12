import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "llm-chat",
  description: "Simple LLM chat interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-bg text-text">{children}</body>
    </html>
  );
}
