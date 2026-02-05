# A-RAG Benchmark


A benchmark application comparing Standard RAG vs Agentic RAG (A-RAG) approaches for document retrieval and question answering.

## Overview

This application demonstrates the difference between two RAG (Retrieval-Augmented Generation) approaches:

- **Standard RAG**: Traditional approach with fixed retrieval strategy (retrieve top-K documents → generate answer)
- **Agentic RAG (A-RAG)**: Advanced approach where an AI agent autonomously decides how to retrieve information using multiple tools and strategies

Upload a PDF document and ask questions to see both approaches side-by-side, comparing their reasoning processes, retrieval strategies, and answer quality.

### Based on Research

This benchmark implements concepts from the research paper **"A-RAG: Scaling Agentic Retrieval-Augmented Generation via Hierarchical Retrieval Interfaces"** (February 2026). The key insight is that giving language models **autonomy** in the retrieval process leads to better results than following fixed retrieval patterns.

**Want to see the difference?** Check out the [detailed comparison with screenshots and analysis →](docs/IMPLEMENTATION.md#comparison-results)

**Key Features**:
- 📄 PDF document upload and indexing
- 🔍 Side-by-side comparison of RAG approaches
- 📊 Performance metrics visualization
- 🤖 Transparent agent reasoning process
- ⚡ Real-time comparison


## Project Structure

```
arag-benchmark/
├── backend/          # FastAPI backend with RAG implementation
├── frontend/         # Next.js frontend application
├── docs/             # Documentation files
└── README.md         # This file
```

## Documentation

- **[QUICKSTART.md](docs/QUICKSTART.md)** - Quick setup and usage guide
- **[IMPLEMENTATION.md](docs/IMPLEMENTATION.md)** - Technical implementation details of Standard RAG vs Agentic RAG
  - [📊 View Comparison Results with Screenshots](docs/IMPLEMENTATION.md#comparison-results)
  - [Standard RAG Implementation](docs/IMPLEMENTATION.md#standard-rag-implementation)
  - [Agentic RAG Implementation](docs/IMPLEMENTATION.md#agentic-rag-implementation)
  - [Key Differences](docs/IMPLEMENTATION.md#key-differences)

## Prerequisites

- **Python**: 3.9 or higher
- **uv**: Python package manager ([Install uv](https://github.com/astral-sh/uv))
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **OpenAI API Key**: Required for RAG functionality

## Setup Instructions

### 1. Backend Setup (Python with uv)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment using uv
uv venv

# Activate virtual environment
source .venv/bin/activate

# Install dependencies
uv pip install -r requirements.txt
```

### 2. Frontend Setup (Next.js with npm)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory with your OpenAI API key:

```bash
# backend/.env
OPENAI_API_KEY=your_openai_api_key_here
```

## Running the Application

### Option 1: Run Both Services Separately

**Terminal 1 - Backend:**
```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 9000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: Use Startup Scripts

**macOS/Linux:**
```bash
./start_app.sh
```

**Windows:**
```powershell
.\start_app.ps1
```

## Accessing the Application

- **Frontend**: http://localhost:4000
- **Backend API**: http://localhost:9000
- **API Documentation**: http://localhost:9000/docs

## API Endpoints

- `POST /upload` - Upload a PDF document for indexing
- `POST /compare` - Compare Standard RAG vs Agentic RAG responses
- `GET /health` - Health check endpoint

## Development

### Backend Development

The backend uses:
- **FastAPI** for the web framework
- **LangChain** for RAG implementation
- **ChromaDB** for vector storage
- **OpenAI** for embeddings and LLM

Main files:
- `backend/main.py` - FastAPI application and endpoints
- `backend/rag_core.py` - RAG implementation logic
- `backend/requirements.txt` - Python dependencies

### Frontend Development

The frontend uses:
- **Next.js 16** with App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Recharts** for visualizations

To modify the frontend:
1. Edit files in `frontend/app/` for pages
2. Edit files in `frontend/components/` for components
3. The app auto-reloads on file changes


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

- 🐛 **Report bugs** - Open an issue describing the problem
- 💡 **Suggest features** - Share ideas for improvements
- 📝 **Improve documentation** - Fix typos, add examples, clarify instructions
- 🔧 **Submit code** - Fix bugs or implement new features

### Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/arag-benchmark.git
   cd arag-benchmark
   ```
3. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** and test thoroughly
5. **Commit your changes**:
   ```bash
   git commit -m "Add: description of your changes"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** with a clear description of your changes

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

### Questions?

Feel free to open an issue for any questions or discussions!

**For detailed guidelines**, see [CONTRIBUTING.md](CONTRIBUTING.md)

