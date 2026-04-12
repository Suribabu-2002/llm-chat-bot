# LLM Chat Application

A Next.js chat application powered by Ollama, featuring a modern dark/light theme and seamless messaging experience.

## Features

- **Dark/Light Theme Toggle**: Built-in theme switching with persistence
- **Sidebar Navigation**: Easy navigation between chats
- **Streaming Responses**: Real-time text as it types
- **Message List**: Scrollable chat history
- **Responsive Design**: Works on desktop and mobile
- **Smart Search**: Integrated search functionality

## Getting Started

### Prerequisites

- Node.js (v18+)
- Ollama installed and running on your system

### Installation

1. Clone the repository

```bash
cd LLM-scratch/llm-chat
```

2. Install dependencies

```bash
npm install
```

3. Start Ollama (if not already running):

```bash
ollama serve
```

4. Install Vercel CLI:

```bash
npm i -g vercel
```

5. Create a Vercel project or build locally with:

```bash
npm run build
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── stream/
│   │       └── route.ts    # Ollama API handler
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page component
├── components/
│   ├── sidebar/
│   │   ├── index.tsx       # Sidebar header component
│   │   └── ...             # Other sidebar components
│   ├── messages/
│   │   ├── index.tsx       # Messages list component
│   │   └── ChatListItem.tsx  # Individual chat item
│   ├── topbar/
│   │   └── index.tsx       # Top navigation bar component
│   └── chat-input/
│       └── index.tsx       # Input and message area component
├── hooks/
│   ├── use-chat-store.ts   # State management for chat
│   ├── use-chat.ts         # Chat state hooks
│   └── use-streaming.ts    # Streaming utility hooks
└── lib/
    └── constants.ts        # Application constants
```

## Architecture

This application uses Next.js 16 with App Router and React 19. Key features include:

- **Server Actions** for API handlers
- **Streaming Responses** for real-time UX
- **LocalStorage** for theme persistence
- **Wagmi** for client-side state management

## API Documentation

- [Ollama API Docs](https://github.com/ollama/ollama/blob/main/docs/modelfile.md)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/api-routes)

## Deployment

Deploy on Vercel:

```bash
vercel
```

Or using the CLI:

```bash
vercel --prod
```

## License

MIT
