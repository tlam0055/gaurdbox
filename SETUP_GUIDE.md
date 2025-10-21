# GuardBox - Post-Quantum Email Setup Guide

## 🚀 Quick Start

### 1. Start the Flask Backend (PQC Server)

```bash
# Option 1: Use the startup script
./start_backend.sh

# Option 2: Manual startup
cd backend
source venv/bin/activate
python3 server.py
```

The Flask server will run on `http://127.0.0.1:5000`

### 2. Start the React Frontend

```bash
# In a new terminal
npm start
```

The React app will run on `http://localhost:3000`

## 🔐 Post-Quantum Cryptography Features

### What's Implemented

- **Kyber512 KEM**: Key Encapsulation Mechanism for quantum-resistant key exchange
- **Dilithium Signatures**: Digital signatures for message integrity
- **Flask Backend**: Python server handling PQC operations
- **React Frontend**: GuardBox email client with PQC integration

### How to Use PQC Encryption

1. **Open GuardBox**: Navigate to `http://localhost:3000`
2. **Click Compose**: Start a new email
3. **Enable PQC**: Click the key icon (🔑) in the toolbar
4. **Wait for Connection**: System connects to Flask backend
5. **PQC Ready**: Green indicator shows when ready
6. **Send Encrypted**: Click "Send PQC-Encrypted"

### PQC Status Indicators

- **🔑 Gray**: PQC disabled
- **🔑 Green**: PQC connected and ready
- **🔑 Yellow**: PQC encrypting message
- **🔑 Red**: PQC connection error

## 🛠️ Development Setup

### Backend Dependencies

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Required Python packages:**
- `flask==3.0.0` - Web framework
- `smaj-kyber==0.1.3` - Post-quantum cryptography
- `requests==2.31.0` - HTTP client

### Frontend Dependencies

```bash
npm install
```

**Required Node.js packages:**
- `react` - UI framework
- `react-bootstrap` - UI components
- `bootstrap` - CSS framework
- `lucide-react` - Icons

## 🧪 Testing the Integration

### 1. Test Flask Backend

```bash
# Test server status
curl http://127.0.0.1:5000/

# Test public key endpoint
curl http://127.0.0.1:5000/get_server_pk
```

### 2. Test PQC Client

```bash
cd backend
source venv/bin/activate
python3 client.py
```

### 3. Test Frontend Integration

1. Open `http://localhost:3000`
2. Click "Compose"
3. Click the key icon (🔑) to enable PQC
4. Check browser console for PQC status
5. Send a test message

## 📁 Project Structure

```
ui-crypto/
├── backend/                 # Flask PQC server
│   ├── server.py           # Flask app with Kyber512
│   ├── client.py           # PQC client test
│   ├── requirements.txt    # Python dependencies
│   ├── setup.sh           # Setup script
│   └── venv/              # Virtual environment
├── src/                   # React frontend
│   ├── components/        # React components
│   ├── services/         # PQC service
│   └── context/          # State management
├── start_backend.sh      # Backend startup script
└── SETUP_GUIDE.md        # This file
```

## 🔧 Troubleshooting

### Common Issues

1. **"python: command not found"**
   ```bash
   # Use python3 instead
   python3 server.py
   ```

2. **"smaj-kyber not found"**
   ```bash
   cd backend
   source venv/bin/activate
   pip install smaj-kyber==0.1.3
   ```

3. **"Flask server not responding"**
   - Check if server is running on port 5000
   - Verify virtual environment is activated
   - Check for port conflicts

4. **"PQC connection failed"**
   - Ensure Flask server is running
   - Check browser console for errors
   - Verify CORS settings (if needed)

### Debug Commands

```bash
# Check Python version
python3 --version

# Check if Flask is running
curl http://127.0.0.1:5000/

# Check PQC library
cd backend && source venv/bin/activate && python3 -c "import smaj_kyber; print('PQC library loaded')"

# Check React app
npm start
```

## 🔒 Security Notes

⚠️ **Important**: This is a demonstration implementation. For production:

1. **Use Real PQC Libraries**: Replace simulation with actual implementations
2. **Secure Key Storage**: Implement proper key management
3. **Certificate Validation**: Add proper certificate chain validation
4. **Audit Logging**: Implement comprehensive security logging
5. **Penetration Testing**: Conduct thorough security assessments

## 📚 API Documentation

### Flask Endpoints

- `GET /` - Server status
- `GET /get_server_pk` - Retrieve server's public key

### Request/Response Format

```json
// GET /get_server_pk
{
  "public_key": "hex_encoded_public_key"
}
```

## 🎯 Next Steps

1. **Test PQC Integration**: Send encrypted emails
2. **Monitor Performance**: Check encryption/decryption speed
3. **Add Features**: Implement additional PQC algorithms
4. **Security Audit**: Review implementation for vulnerabilities
5. **Production Setup**: Deploy with proper security measures

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify Flask server is running
3. Ensure all dependencies are installed
4. Review the setup logs for any errors

## 🎉 Success!

Once everything is running:

- ✅ Flask server on `http://127.0.0.1:5000`
- ✅ React app on `http://localhost:3000`
- ✅ PQC encryption working
- ✅ GuardBox ready for secure email!

Enjoy your quantum-resistant email system! 🔐
