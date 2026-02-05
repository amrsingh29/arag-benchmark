# Start Backend
Write-Host "Starting Backend..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "& { . .\venv\Scripts\Activate.ps1; cd backend; uvicorn main:app --host 0.0.0.0 --port 8000 }"

# Start Frontend
Write-Host "Starting Frontend..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "& { cd frontend; npm run dev }"

Write-Host "A-RAG Benchmark is starting!"
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:3000"
