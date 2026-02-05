#!/bin/bash

# A-RAG Benchmark Startup Script
# This script starts both the backend and frontend services

echo "🚀 Starting A-RAG Benchmark Application..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if backend virtual environment exists
if [ ! -d "backend/.venv" ]; then
    echo "❌ Backend virtual environment not found!"
    echo "Please run: cd backend && uv venv && uv pip install -r requirements.txt"
    exit 1
fi

# Check if frontend node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Frontend dependencies not installed!"
    echo "Please run: cd frontend && npm install"
    exit 1
fi

# Check for OpenAI API key
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env file not found!"
    echo "Please create backend/.env with your OPENAI_API_KEY"
    echo ""
fi

echo "${GREEN}✓${NC} Starting Backend (FastAPI) on http://localhost:8080"
echo "${GREEN}✓${NC} Starting Frontend (Next.js) on http://localhost:4000"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

# Start backend in background
cd backend
source .venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8080 &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 2

# Start frontend in background
cd frontend
npm run dev -- -p 4000 &
FRONTEND_PID=$!
cd ..

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✓ Services stopped"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup INT TERM

# Wait for both processes
wait
