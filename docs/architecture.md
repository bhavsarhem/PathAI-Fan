# System & SDLC Architecture Document

This document outlines the System Architecture, Design Choices, Security Controls, and SDLC Pipeline for **PathAI Navigator**.

---

## 1. Architectural Overview

The application utilizes a decoupled modular architecture designed for high availability, low latency, and zero-trust security. 

```mermaid
graph TD
    subgraph Client-Side (SPA)
        UI[React/Vite Frontend] --> Context[AppContext / State Reducer]
        UI --> ChatContext[ChatContext / AI State]
        UI --> Hook[useLiveScores Hook]
    end

    subgraph Serverless Edge Environment (Vercel)
        ChatContext --> API[Vercel Serverless Function: /api/chat]
        API --> VectorDB[In-Memory Edge Vector DB]
        API --> LLM[Groq LLM Llama3-8b]
    end

    subgraph Browser Storage (Sync)
        Context --> Storage[localStorage Event Sync]
    end
```

### Components & Responsibilities
- **Frontend SPA (Vite + React)**: Serves static assets instantly via edge CDN. The UI is built using high-contrast styling tokens tailored for stadium environments.
- **State Management (Context API + Reducers)**: Governs application state (active incidents, crowd counts, evacuation signals). Runs a simulated real-time synchronization utilizing cross-tab `localStorage` listeners.
- **Serverless API Routes**: Executes API routes on Vercel's Serverless/Edge network, ensuring that sensitive integrations (like the Groq API key) are fully hidden from the frontend client.
- **In-Memory RAG Vector DB**: A fast token-matching engine that acts as the local knowledge base, preventing hallucinations by feeding verified facts straight to the LLM context.

---

## 2. SDLC Pipeline (Software Development Life Cycle)

We enforce a strict, industry-standard automated SDLC workflow to maintain pristine code quality, high coverage, and absolute security.

### A. Pre-Commit Verification (Git Hooks via Husky)
Before any code is committed locally, **Husky** intercepts the git command and executes:
1. **Linter Checklist (`npm run lint`)**: Validates that 100% of variables are used, imports are resolved, and React hook dependencies are fully compliant.
2. **Testing Pipeline (`npm run test`)**: Runs all test suites to block breaking changes before they reach the remote branch.

### B. CI/CD Workflow (GitHub Actions)
Every pull request and merge into the `main` branch triggers the GitHub Action pipeline:
- **Build Checks**: Compiles the React SPA.
- **Lint Verification**: Runs ESLint/Oxlint scans.
- **Test Runs**: Ensures all tests pass cleanly.

---

## 3. Security Architecture & Threat Modeling

1. **Secrets Security**: No API keys are hardcoded. We use Vercel environment variables (`GROQ_API_KEY`) and keep `.env` excluded via `.gitignore`.
2. **Secure Credentials**: Logins are verified via localized credential hashes (`localStorage`), and password updates require current password validation.
3. **Evacuation Safety**: Evacuation commands use a deterministic routing mapping (Zone-to-Gate) to prevent dynamic route calculations from failing or causing bottlenecks during high-stress moments.

---

## 4. Testing Strategy

We maintain robust testing utilizing **Vitest** and **jsdom**:
- **Unit Testing**: Tests core state changes, reducers, and helper logic (`src/context/AppContext.test.jsx`).
- **Component Testing**: Tests UI rendering behavior and custom DOM style bindings (`src/components/ZoneBadge.test.jsx`).
- **Edge Search Testing**: Evaluates keyword overlap and ranking performance of the vector database (`api/vectorStore.test.js`).
- **Coverage Audits**: Structured coverage scans are configured with `v8` to track overall line and branch coverage (`npm run test:coverage`).
