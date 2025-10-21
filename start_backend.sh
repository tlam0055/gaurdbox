#!/bin/bash

echo "🔐 Starting Post-Quantum Cryptography Backend..."

# Navigate to backend directory
cd backend

# Activate virtual environment
source venv/bin/activate

# Start Flask server
echo "🚀 Starting Flask server on http://127.0.0.1:5000"
python3 server.py
