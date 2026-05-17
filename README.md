# Debt Note

Debt Note is a collaborative bill splitting and debt tracking web app built with Next.js.  
It allows multiple users to update transactions in real-time using Socket.IO, making shared expense tracking fast and interactive.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- MongoDB + Mongoose
- Socket.IO (Realtime WebSocket communication)
- Tailwind CSS
- Framer Motion
- shadcn/ui

## Architecture

### Frontend
Built with Next.js App Router and React.

### Backend
Uses Next.js API Routes for transaction persistence and MongoDB operations.

```text
Frontend → API Routes → MongoDB
```

### Realtime Communication
Uses Socket.IO for realtime collaborative updates between connected users.

```text
Client ↔ Socket.IO Server ↔ Other Clients
```

## Development

Install dependencies:

```bash
npm install
```

Run the Next.js development server:

```bash
npm run dev
```

Run the Socket.IO server:

```bash
npm run socket
```

Open:

```text
http://localhost:3000
```

## Features

- Realtime collaborative transaction editing
- Live active user tracking
- Shared bill splitting
- Participant-based expense breakdown
- Debounced transaction persistence
- Mobile-friendly UI