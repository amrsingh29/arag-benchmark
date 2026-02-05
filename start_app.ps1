# Start Backend
Write-Host "Starting Backend..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "& { . .\venv\Scripts\Activate.ps1; cd backend; uvicorn main:app --host 0.0.0.0 --port 9001 }"

# Start Frontend
Write-Host "Starting Frontend..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "& { cd frontend; npm run dev -- -p 4000 }"

Write-Host "A-RAG Benchmark is starting!"
Write-Host "Backend: http://localhost:9001"
Write-Host "Frontend: http://localhost:4000"
