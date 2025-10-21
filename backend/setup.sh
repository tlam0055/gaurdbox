#!/bin/bash

echo "🔐 Setting up Post-Quantum Cryptography Backend..."

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️ Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📚 Installing Python dependencies..."
pip install -r requirements.txt

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the Flask server:"
echo "   source venv/bin/activate"
echo "   python3 server.py"
echo ""
echo "🧪 To test the client:"
echo "   python3 client.py"
