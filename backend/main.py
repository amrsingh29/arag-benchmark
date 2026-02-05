from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import tempfile
from rag_core import RAGCore
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="A-RAG Benchmark API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG Core
# We use a single global instance for this benchmark demo.
rag_system = RAGCore()

class CompareRequest(BaseModel):
    query: str
    doc_id: str

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = temp_file.name
            
        # Close file handle so ingest can open it if needed (windows specific issue sometimes)
        
        # Ingest
        doc_id = rag_system.ingest_document(temp_path)
        
        # Cleanup
        try:
            os.remove(temp_path)
        except OSError:
            pass # Best effort cleanup
        
        return {"status": "indexed", "doc_id": doc_id, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compare")
async def compare_rag(request: CompareRequest):
    if not rag_system.doc_id:
        raise HTTPException(status_code=400, detail="No document indexed. Please upload first.")
        
    # Warn if doc_id mismatch, but proceed with current loaded doc for demo
    if request.doc_id != rag_system.doc_id:
        print(f"Warning: Requested doc_id {request.doc_id} does not match loaded {rag_system.doc_id}")
        
    try:
        # Run Standard RAG
        standard_res = rag_system.standard_rag(request.query)
        
        # Run Agentic RAG
        arag_res = rag_system.run_agentic_rag(request.query)
        
        return {
            "standard": standard_res,
            "arag": arag_res
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
