# AI Copilot – RAG Backend System

## Overview

AI Copilot is a production-style Retrieval Augmented Generation (RAG) backend system built using Node.js, Express, Prisma, Redis, BullMQ, PostgreSQL, Gemini APIs, Docker, and React.

The project allows users to:

- Upload documents and PDFs
- Process documents asynchronously using Redis queues
- Generate embeddings using Gemini
- Perform semantic search using pgvector
- Ask AI questions based on uploaded documents
- Receive contextual AI-generated answers using RAG
- Cache responses using Redis
- Store chat history
- Run the entire system using Docker Compose

---

# Tech Stack

## Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL (Neon)
- Redis
- BullMQ
- Gemini API (`@google/genai`)
- JWT Authentication
- pgvector

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

## DevOps / Deployment

- Docker
- Docker Compose
- Nginx

---

# Features

## Authentication

- User registration
- User login
- JWT-based protected routes
- Password hashing using bcrypt

## Document Upload

- Upload text documents
- Upload PDF files
- Background document processing
- Redis queue architecture

## PDF Processing

- PDF parsing using `pdf-parse`
- Text extraction
- Paragraph-based chunking
- Asynchronous processing using BullMQ workers

## Embeddings

- Gemini embedding generation
- Chunk embeddings stored using pgvector
- Semantic similarity search

## Semantic Search

- Query embeddings
- Cosine similarity using pgvector
- Top-k chunk retrieval

## RAG Chat System

Flow:

User Question
→ Query Embedding
→ Semantic Search
→ Retrieve Relevant Chunks
→ Gemini Context Prompt
→ AI Answer

## Chat History

- Stores previous questions and answers
- User-specific chat history

## Redis Caching

- Repeated queries served from cache
- Reduces Gemini API calls
- Improves performance

## Rate Limiting

- Protects AI routes from abuse
- Express rate limiting middleware

## Dockerized Architecture

- Backend container
- Frontend container
- Redis container
- Worker container
- Nginx frontend serving

---

# Project Architecture

```txt
Browser
↓
React Frontend (Nginx)
↓
Express Backend API
↓
Redis Queue + Cache
↓
BullMQ Worker
↓
Gemini APIs
↓
Neon PostgreSQL + pgvector
```

---

# Backend Architecture

## API Responsibilities

The API layer handles:

- Authentication
- Upload handling
- Queue creation
- Semantic search
- RAG responses
- Chat history

Heavy tasks are NOT processed directly in the request.

## Worker Responsibilities

BullMQ workers handle:

- PDF parsing
- Text extraction
- Chunk generation
- Embedding generation
- Chunk storage

This prevents slow API responses.

---

# Prisma Models

## User

```prisma
model User {
  id        Int        @id @default(autoincrement())
  email     String     @unique
  password  String

  documents Document[]
  messages  Message[]
}
```

## Document

```prisma
model Document {
  id        Int      @id @default(autoincrement())
  userId    Int
  title     String
  content   String?
  status    String   @default("processing")
  createdAt DateTime @default(now())

  chunks    DocumentChunk[]
}
```

## DocumentChunk

```prisma
model DocumentChunk {
  id         Int      @id @default(autoincrement())
  documentId Int
  content    String
  embedding  Unsupported("vector")?
  createdAt  DateTime @default(now())
}
```

## Message

```prisma
model Message {
  id        Int      @id @default(autoincrement())
  userId    Int
  question  String
  answer    String
  createdAt DateTime @default(now())
}
```

---

# Semantic Search Flow

```txt
User Query
↓
Generate Query Embedding
↓
Compare Against Chunk Embeddings
↓
Retrieve Top Relevant Chunks
↓
Send Context to Gemini
↓
Generate Final AI Answer
```

---

# Redis Queue Flow

```txt
PDF Upload
↓
Save Document Row
↓
Add Queue Job
↓
Return Response Immediately
↓
Worker Extracts PDF Text
↓
Chunking
↓
Embedding Generation
↓
Store Chunks
```

---

# Docker Setup

## Services

The project uses Docker Compose to orchestrate:

- Backend
- Frontend
- Redis
- Worker

## Start Containers

```bash
docker compose up --build
```

## Stop Containers

```bash
docker compose down
```

## View Running Containers

```bash
docker ps
```

## View Logs

```bash
docker compose logs
```

---

# Nginx Configuration

React Router routes such as:

```txt
/login
/chat
```

required Nginx fallback configuration.

Used:

```nginx
try_files $uri /index.html;
```

This allows React Router to handle frontend routes correctly.

---

# Environment Variables

Create `.env`

```env
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
GEMINI_API_KEY=
REDIS_HOST=
REDIS_PORT=
```

---

# Backend Setup

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

## Prisma Migration

```bash
npx prisma migrate dev
```

## Generate Prisma Client

```bash
npx prisma generate
```

---

# Frontend Setup

```bash
cd ai_copilot_frontend
npm install
npm run dev
```

---

# Major Concepts Learned

- Retrieval Augmented Generation (RAG)
- Embeddings
- Semantic Search
- Cosine Similarity
- pgvector
- BullMQ Workers
- Redis Caching
- Queue Architecture
- Dockerization
- Nginx Frontend Serving
- Production-Style Backend Architecture

---

# Future Improvements

- Streaming AI responses
- Multi-document collections
- Source citation highlighting
- OCR support
- WebSocket real-time updates
- Agentic workflows
- Advanced chunking strategies
- Multi-user document collaboration
- Role-based access
- CI/CD pipelines
- Cloud deployment

---

# Author

Dr. Athira Mohan K

Founder – Amokhatrayi Wellness & Coaching Institute

AI + Healthcare Product Engineering Enthusiast
