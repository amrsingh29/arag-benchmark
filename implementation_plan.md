
# A-RAG Master Implementation Plan

## Goal
Build a **modern, full-stack application** to implement and benchmark "A-RAG: Scaling Agentic Retrieval-Augmented Generation" against Standard RAG.
The system will allow users to upload a PDF, ask questions, and visually compare how the two approaches differ in terms of **Answer Quality**, **Search Efficiency (Tokens)**, and **Latency**.

## Technology Stack

### Frontend (The Face)
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: TailwindCSS
- **Design System**:
    - **Glassmorphism**: Translucent cards, blurred backgrounds (`backdrop-blur-md`), subtle borders.
    - **Animations**: Framer Motion (smooth transitions, loading states).
    - **Theming**: System-aware Dark/Light mode.
- **Visualization**: Recharts or Chart.js (for performance metrics).

### Backend (The Brain)
- **Framework**: FastAPI (Python)
- **AI Orchestration**: LangChain
- **LLM**: OpenAI GPT-4o
- **Database**:
    - **Vector Store**: ChromaDB (Semantic Search)
    - **Keyword Index**: RankBM25 (Keyword Search)
- **PDF Processing**: PyPDF

---

## Architecture Design

### 1. Backend Service (`/backend`)
The Python backend manages the heavy lifting of RAG.

#### **Core Logic (`rag_core.py`)**
- **Ingestion Engine**:
    - Splits PDF into chunks (Semantic Chunking).
    - Builds a **Hybrid Index** (Dense Vector Index + Sparse BM25 Index).
- **Agents**:
    - **Standard RAG**: Simple Chain -> Retrieve Top-K (5) -> Generate.
    - **A-RAG Agent**: ReAct-style Agent equipped with tools:
        - `tool_keyword_search(query)`
        - `tool_semantic_search(query)`
        - `tool_read_chunk(chunk_id)`

#### **API Endpoints (`main.py`)**
- `POST /upload`: Accepts `file`. Returns `{"status": "indexed", "doc_id": "..."}`.
- `POST /compare`:
    - **Input**: `{"query": "User question...", "doc_id": "..."}`
    - **Process**: Runs both agents in parallel (or sequential).
    - **Output**:
      ```json
      {
        "standard": {
          "answer": "The paper states...",
          "metrics": { "tokens_used": 1500, "latency_ms": 1200, "steps": 1 }
        },
        "arag": {
          "answer": "After checking section 3...",
          "metrics": { "tokens_used": 450, "latency_ms": 3500, "steps": 5 }
        }
      }
      ```

### 2. Frontend Application (`/frontend`)
A defined **Single Page Application (SPA)** dashboard.

#### **UI Components**
1.  **Hero Section**: Big, bold typography. "A-RAG Visualizer".
2.  **Upload Card**:
    - Glassmorphism style.
    - Drag & Drop zone.
    - Progress bar during "Indexing...".
3.  **Comparison Arena** (appears after upload):
    - **Input Bar**: Floating input field.
    - **Results Split View**:
        - **Left (Standard)**: Blue-tinted glass card. Shows Answer + Retrieved Context snippets.
        - **Right (A-RAG)**: Purple-tinted glass card. Shows Answer + **"Agent Thought Process"** (e.g., "Searching for 'F1 score'...", "Reading chunk 5...").
4.  **Analytics Section**:
    - **Bar Chart**: Comparing Token Count (Validation of Efficiency).
    - **Bar Chart**: Comparing Latency (Trade-off visualization).

---

## Implementation Steps

### Phase 1: Backend Foundation
1.  Setup `fastapi`, `langchain`, `chromadb`.
2.  Implement `ingest_document` to create the indices.
3.  Implement the `StandardRAG` function.
4.  Implement the `AgenticRAG` function with the 3 specific tools.
5.  Expose via REST API.

### Phase 2: Frontend "Glass" UI
1.  Initialize Next.js + Tailwind.
2.  Create `globals.css` with custom `.glass` utility classes.
3.  Build the `UploadZone` component (API integration).
4.  Build the `ChatInterface` component.

### Phase 3: Integration & Polish
1.  Connect Frontend form to Backend `/compare`.
2.  Feed real data into the Charts.
3.  Refine animations (e.g., skeleton loaders while waiting for LLM).

## Verification Plan
1.  **Server Check**: `curl -X POST /upload ...` works.
2.  **Agent Logic Check**: A-RAG agent actually calls `read_chunk` instead of just hallucinating.
3.  **UI Check**: Dark mode toggles correctly; Glass effect is visible; Charts render dynamic data.
