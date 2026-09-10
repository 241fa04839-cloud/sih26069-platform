#!/bin/bash
echo "=== SIH26069 National Weather Big Data Analytics Platform ==="
echo ""

# Backend setup
echo "📦 Setting up backend..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
echo "✅ Backend dependencies installed"

cd ..

# Frontend setup
echo "📦 Setting up frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    ln -sf ../../node_modules node_modules
fi
npm install
echo "✅ Frontend dependencies installed"

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "To run the platform:"
echo "  Terminal 1:"
echo "    cd backend && source venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
echo "  Terminal 2:"
echo "    cd frontend && npm run dev"
echo ""
echo "Open http://localhost:3000 in your browser"
echo "API Docs: http://localhost:8000/api/v1/docs"
