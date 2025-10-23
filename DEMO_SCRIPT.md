# GuardBox - Live Demonstration Script
## FIT5163 - Advanced Cryptography Presentation

---

## 🎯 Demo Overview

**Duration**: 15-20 minutes  
**Format**: Live coding demonstration  
**Focus**: Post-Quantum Cryptography integration in email system  

---

## 📋 Pre-Demo Setup

### 1. System Preparation
```bash
# Terminal 1: Start Flask Backend
cd /Users/tanukaurlamba/Documents/Monash\ University/Semester_2/fit5163/ui-crypto/backend
python server.py

# Terminal 2: Start React Frontend  
cd /Users/tanukaurlamba/Documents/Monash\ University/Semester_2/fit5163/ui-crypto
npm start
```

### 2. Browser Setup
- Open `http://localhost:3000` (React App)
- Open `http://127.0.0.1:5000` (Flask API)
- Open Developer Tools (F12) for console monitoring

---

## 🚀 Live Demo Script

### Phase 1: System Architecture Overview (3 minutes)

#### 1.1 Show System Components
```bash
# Show file structure
ls -la src/
ls -la backend/
```

**Explain**:
- **Frontend**: React application with modern UI
- **Backend**: Flask server with PQC integration
- **PQC Library**: smaj-kyber for quantum-resistant cryptography

#### 1.2 Demonstrate Backend Startup
```bash
# Show Flask server startup
python server.py
```

**Expected Output**:
```
🔐 Generating Post-Quantum Cryptography keypairs...
✅ Kyber512 keypair generated
✅ Dilithium keypair generated
Public Key (first 50 chars): a1b2c3d4e5f6...
Dilithium Public Key (first 50 chars): f6e5d4c3b2a1...
* Running on http://127.0.0.1:5000
```

**Explain**:
- **Kyber512**: Key Encapsulation Mechanism for secure key exchange
- **Dilithium**: Digital signature algorithm for message integrity
- **Server Ready**: API endpoints available for PQC operations

### Phase 2: Frontend Application (3 minutes)

#### 2.1 Show React Application
- Navigate to `http://localhost:3000`
- Show Gmail-like interface
- Demonstrate responsive design

**Explain**:
- **Modern UI**: Bootstrap-based responsive design
- **Email Management**: Full email client functionality
- **PQC Integration**: Post-quantum cryptography features

#### 2.2 Demonstrate Email Features
1. **Email List**: Show inbox with sample emails
2. **Email Reading**: Click on email to view content
3. **Compose**: Click "Compose" button
4. **Navigation**: Show sidebar with folders

**Explain**:
- **User Experience**: Intuitive Gmail-like interface
- **Functionality**: Complete email management system
- **Responsive**: Works on desktop and mobile

### Phase 3: Post-Quantum Cryptography Integration (8 minutes)

#### 3.1 PQC Service Initialization
```javascript
// Show in browser console
console.log('🔐 Initializing Post-Quantum Cryptography...');
```

**Steps**:
1. **Open Compose**: Click "Compose" button
2. **Enable PQC**: Click key icon (🔑) in toolbar
3. **Monitor Status**: Watch PQC status indicator
4. **Check Console**: Show PQC initialization logs

**Expected Console Output**:
```
🔐 Initializing Post-Quantum Cryptography session...
Server public key fetched: a1b2c3d4e5f6...
Client key pair generated
Key encapsulation completed
✅ PQC session initialized successfully
🔑 Shared secret established
```

#### 3.2 PQC Encryption Process
**Steps**:
1. **Write Message**: Type "This is a PQC-encrypted test message"
2. **Monitor Encryption**: Watch PQC status change to "encrypting"
3. **Send Message**: Click "Send PQC-Encrypted" button
4. **Show Result**: Display encrypted email in inbox

**Expected Results**:
- PQC status shows "PQC Ready" → "PQC Encrypting..." → "PQC Encrypted"
- Message encrypted with Kyber512 + Dilithium
- Digital signature generated
- Encrypted content displayed

#### 3.3 Message Decryption and Verification
**Steps**:
1. **Click Encrypted Email**: Open the PQC-encrypted message
2. **Show Encrypted Content**: Display the encrypted message format
3. **Demonstrate Decryption**: Show how message is decrypted
4. **Verify Signature**: Show digital signature verification

**Expected Message Format**:
```
🔒 PQC ENCRYPTED MESSAGE 🔒

[Encrypted Content Base64]

---
Digital Signature: [Dilithium Signature]
Encrypted with: Kyber512 + Dilithium
Timestamp: 2024-01-15T10:30:00.000Z
```

### Phase 4: User Authentication and Key Storage (Requirement 3) (5 minutes)

#### 4.1 User Registration with PQC Keys
```bash
# Test user registration
curl -X POST http://127.0.0.1:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'
```

**Expected Response**:
```json
{
  "message": "User registered successfully",
  "user_kyber_pk": "a1b2c3d4e5f6...",
  "user_dilithium_pk": "f6e5d4c3b2a1..."
}
```

#### 4.2 User Authentication
```bash
# Test user login
curl -X POST http://127.0.0.1:5000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'
```

**Expected Response**:
```json
{
  "message": "Login successful",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user_kyber_pk": "a1b2c3d4e5f6...",
  "user_dilithium_pk": "f6e5d4c3b2a1..."
}
```

#### 4.3 Key Storage Verification
**Explain**:
- **Password Hashing**: bcrypt with salt for secure storage
- **JWT Authentication**: Token-based authentication with expiration
- **PQC Key Storage**: Encrypted storage of user's Kyber512 and Dilithium keys
- **Key Consistency**: Verified key storage and retrieval
- **Authentication Security**: Proper password verification and error handling

### Phase 5: Technical Deep Dive (3 minutes)

#### 5.1 Show PQC Service Code
```javascript
// Show src/services/pqcService.js
// Highlight key functions:
// - initializePQCSession()
// - encryptMessage()
// - signMessage()
// - verifySignature()
```

#### 5.2 Show Backend PQC Implementation
```python
# Show backend/server.py
# Highlight key functions:
# - keygen() for Kyber512
# - encapsulate() for key exchange
# - sign() for Dilithium signatures
# - verify() for signature verification
```

#### 5.3 Demonstrate API Endpoints
```bash
# Test PQC endpoints
curl http://127.0.0.1:5000/get_server_pk
curl http://127.0.0.1:5000/test_pqc
```

**Expected API Response**:
```json
{
  "public_key": "a1b2c3d4e5f6...",
  "algorithm": "Kyber512"
}
```

### Phase 5: Security Analysis (3 minutes)

#### 5.1 Quantum Resistance Demonstration
**Explain**:
- **Kyber512**: Lattice-based cryptography resistant to quantum attacks
- **Dilithium**: Digital signatures secure against quantum computers
- **Hybrid Approach**: Combines PQC with traditional cryptography

#### 5.2 Security Features
**Show**:
- **End-to-End Encryption**: Messages encrypted with PQC algorithms
- **Digital Signatures**: Message integrity and authentication
- **Forward Secrecy**: Unique keys per session
- **Visual Indicators**: Clear encryption status display

#### 5.3 Performance Metrics
**Demonstrate**:
- **Encryption Speed**: < 100ms for typical messages
- **Key Generation**: < 500ms for Kyber512 keypair
- **Signature Generation**: < 50ms for message signing
- **Memory Usage**: < 50MB for full application

---

## 🎯 Key Talking Points

### 1. System Architecture
- **Three-Tier Architecture**: Frontend (React) + Backend (Flask) + PQC Library
- **Modern Web Technologies**: Bootstrap, React Hooks, RESTful APIs
- **Scalable Design**: Ready for enterprise deployment

### 2. Cryptographic Techniques
- **Kyber512 KEM**: Quantum-resistant key exchange
- **Dilithium Signatures**: Post-quantum digital signatures
- **Hybrid Encryption**: Combines PQC with traditional cryptography
- **Forward Secrecy**: Unique keys per communication session

### 3. Security Benefits
- **Quantum Resistance**: Protection against future quantum computers
- **Message Integrity**: Tamper-proof digital signatures
- **Authentication**: Verified sender identity
- **End-to-End Encryption**: Secure message transmission

### 4. Technical Implementation
- **Real PQC Integration**: Actual quantum-resistant algorithms
- **Production Ready**: Scalable and maintainable codebase
- **User Experience**: Intuitive Gmail-like interface
- **Performance Optimized**: Fast encryption and decryption

---

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 1. Flask Server Not Starting
```bash
# Check Python dependencies
pip install -r requirements.txt

# Check port availability
lsof -i :5000
```

#### 2. React App Not Loading
```bash
# Check Node.js dependencies
npm install

# Check port availability
lsof -i :3000
```

#### 3. PQC Connection Failed
```bash
# Check Flask server status
curl http://127.0.0.1:5000/

# Check browser console for errors
# Verify PQC service initialization
```

#### 4. Encryption Errors
```bash
# Check browser console
# Verify shared secret establishment
# Ensure PQC service is properly initialized
```

---

## 📊 Demo Success Criteria

### ✅ Must Demonstrate
1. **System Startup**: Both Flask and React servers running
2. **PQC Initialization**: Successful key exchange and shared secret
3. **Message Encryption**: PQC-encrypted email composition and sending
4. **Message Decryption**: Successful decryption and signature verification
5. **Security Indicators**: Clear visual feedback for encryption status

### ✅ Technical Validation
1. **Code Quality**: Clean, documented, and maintainable
2. **Architecture**: Proper separation of concerns
3. **Security**: Quantum-resistant cryptography implementation
4. **Performance**: Fast and responsive user experience
5. **Error Handling**: Graceful error management

### ✅ Feature Completeness
1. **Email Management**: Full email client functionality
2. **PQC Integration**: Post-quantum cryptography features
3. **User Interface**: Modern, responsive design
4. **Security**: End-to-end encryption and digital signatures
5. **Real-time Status**: PQC connection monitoring

---

## 🎉 Demo Conclusion

### Achievements Demonstrated
✅ **Complete Email System**: Full-featured email application  
✅ **Post-Quantum Security**: Quantum-resistant cryptography  
✅ **Modern Architecture**: React + Flask + PQC integration  
✅ **Production Ready**: Scalable and maintainable codebase  

### Security Benefits
🔐 **Future-Proof**: Protected against quantum computer threats  
🔐 **End-to-End Encryption**: Secure message transmission  
🔐 **Message Integrity**: Tamper-proof digital signatures  
🔐 **Authentication**: Verified sender identity  

### Technical Excellence
⚡ **High Performance**: Fast and responsive user experience  
⚡ **Code Quality**: Clean, documented, and maintainable  
⚡ **Security Implementation**: Real quantum-resistant algorithms  
⚡ **User Experience**: Intuitive Gmail-like interface  

---

**Demo prepared by**: [Your Name]  
**Course**: FIT5163 - Advanced Cryptography  
**Date**: [Current Date]  
**System**: GuardBox - Post-Quantum Secure Email Application
