# Quick Start Guide - A-RAG Benchmark

## ✅ Setup Complete!

Your project has been successfully set up with:
- ✓ Backend virtual environment created with `uv`
- ✓ All Python dependencies installed
- ✓ Frontend dependencies installed with `npm`
- ✓ Startup scripts created

## 🚀 How to Run

### Option 1: Use the Startup Script (Recommended)

```bash
./start_app.sh
```

This will start both backend and frontend services automatically.

### Option 2: Run Services Manually

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

## 🔑 Important: Set Up Your OpenAI API Key

Before running the application, you need to configure your OpenAI API key:

1. Copy the example environment file:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Edit `backend/.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

## 🌐 Access Points

Once running, you can access:

- **Frontend Application**: http://localhost:4000
- **Backend API**: http://localhost:9000
- **API Documentation (Swagger)**: http://localhost:9000/docs
- **API Documentation (ReDoc)**: http://localhost:9000/redoc

## 📝 How to Use the Application

1. **Upload a PDF Document**
   - Use the upload interface to submit a PDF document
   - The system will index it for RAG queries

2. **Ask Questions**
   - Enter your question about the document
   - The system will compare responses from:
     - Standard RAG (traditional retrieval)
     - Agentic RAG (advanced multi-step reasoning)

3. **Compare Results**
   - View side-by-side comparison of both approaches
   - Analyze performance metrics and response quality

## 🛠️ Development Commands

### Backend

```bash
cd backend

# Activate virtual environment
source .venv/bin/activate

# Run with auto-reload (development)
uvicorn main:app --reload

# Run tests (if available)
pytest

# Add new dependencies
uv pip install package-name
uv pip freeze > requirements.txt
```

### Frontend

```bash
cd frontend

# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run linter
npm run lint

# Add new dependencies
npm install package-name
```

## 📦 Project Structure

```
arag-benchmark/
├── backend/
│   ├── .venv/              # Python virtual environment
│   ├── main.py             # FastAPI application
│   ├── rag_core.py         # RAG implementation
│   ├── requirements.txt    # Python dependencies
│   ├── pyproject.toml      # UV project configuration
│   └── .env               # Environment variables (create this!)
│
├── frontend/
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── public/           # Static assets
│   ├── package.json      # Node dependencies
│   └── ...
│
├── start_app.sh          # Startup script (macOS/Linux)
├── start_app.ps1         # Startup script (Windows)
└── README.md             # Full documentation
```

## 🐛 Troubleshooting

### Backend won't start
- Ensure virtual environment is activated: `source backend/.venv/bin/activate`
- Check if port 9000 is available: `lsof -i :9000`
- Verify OpenAI API key is set in `backend/.env`

### Frontend won't start
- Check if port 4000 is available: `lsof -i :4000`
- Try deleting `node_modules` and reinstalling: `rm -rf node_modules && npm install`
- Clear Next.js cache: `rm -rf .next`

### Import errors
- Make sure you're in the virtual environment
- Reinstall dependencies: `uv pip install -r requirements.txt`

## 📚 Next Steps

1. Set up your OpenAI API key (see above)
2. Run the application using `./start_app.sh`
3. Upload a test PDF document
4. Try asking questions to compare RAG approaches
5. Review the code in `backend/rag_core.py` to understand the implementation

## 🤝 Need Help?

- Check the full [README.md](README.md) for detailed documentation
- Review API documentation at http://localhost:9000/docs
- Examine the implementation in `backend/rag_core.py`

---

**Happy benchmarking! 🎉**
