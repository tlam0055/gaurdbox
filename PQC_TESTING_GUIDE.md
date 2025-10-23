# Post-Quantum Cryptography Testing Guide

## 🎯 **Requirements Validation**

This guide provides comprehensive testing procedures for all three PQC requirements:

### **Requirement 1: PQC KEM (Kyber) for Key Exchange**
- ✅ **Kyber512 Key Encapsulation Mechanism**
- ✅ **Secure key exchange between server and clients**
- ✅ **Shared secret generation and verification**

### **Requirement 2: Digital Signatures for Message Integrity**
- ✅ **HMAC-SHA256 digital signatures (simulating Dilithium)**
- ✅ **Message integrity verification**
- ✅ **Tamper detection capabilities**

### **Requirement 3: Secure User Authentication and Key Storage**
- ✅ **bcrypt password hashing**
- ✅ **JWT token-based authentication**
- ✅ **Encrypted key storage for user PQC keys**
- ✅ **User registration and login system**

## 🚀 **Quick Start Testing**

### **Step 1: Start the Enhanced Server**
```bash
cd backend
source venv/bin/activate
python3 server_enhanced.py
```

### **Step 2: Run Automated Tests**
```bash
python3 test_pqc_requirements.py
```

### **Step 3: Manual Testing**
Open `http://localhost:3000` and test the GuardBox interface.

## 📋 **Detailed Testing Procedures**

### **Test 1: Server Connectivity**
```bash
curl http://127.0.0.1:5000/
```
**Expected:** Server status and feature list

### **Test 2: PQC KEM (Kyber) Testing**
```bash
# Get server public key
curl http://127.0.0.1:5000/get_server_pk

# Test key encapsulation (requires client implementation)
curl -X POST http://127.0.0.1:5000/encapsulate \
  -H "Content-Type: application/json" \
  -d '{"client_public_key": "your_client_public_key_hex"}'
```

### **Test 3: Digital Signatures Testing**
```bash
# Get server signature public key
curl http://127.0.0.1:5000/get_server_signature_pk

# Sign a message
curl -X POST http://127.0.0.1:5000/sign \
  -H "Content-Type: application/json" \
  -d '{"message": "Test message"}'

# Verify signature
curl -X POST http://127.0.0.1:5000/verify \
  -H "Content-Type: application/json" \
  -d '{"message": "Test message", "signature": "signature_hex", "public_key": "public_key_hex"}'
```

### **Test 4: User Authentication Testing**
```bash
# Register a new user
curl -X POST http://127.0.0.1:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'

# Login user
curl -X POST http://127.0.0.1:5000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'
```

### **Test 5: PQC Integration Test**
```bash
curl http://127.0.0.1:5000/test_pqc
```

## 🔍 **Manual Testing Steps**

### **Frontend Integration Testing**

1. **Start React App:**
   ```bash
   npm start
   ```

2. **Open GuardBox:**
   - Navigate to `http://localhost:3000`
   - Verify GuardBox interface loads

3. **Test PQC Features:**
   - Click "Compose" to start new email
   - Click the key icon (🔑) to enable PQC
   - Check browser console for PQC status messages
   - Send a test encrypted email

4. **Verify PQC Status:**
   - Look for "🔐 Initializing Post-Quantum Cryptography session..."
   - Check for "✅ PQC session initialized successfully"
   - Verify key icon turns green when connected

### **Browser Console Testing**

Open browser DevTools (F12) and check for:

**Success Messages:**
```
🔐 Initializing Post-Quantum Cryptography session...
Server public key fetched: [key]...
Client key pair generated
Key encapsulation completed
✅ PQC session initialized successfully
🔑 Shared secret established
```

**Error Messages to Watch For:**
```
❌ Failed to initialize Post-Quantum Cryptography
Error fetching server public key: [error]
CORS error: [details]
Network error: [details]
```

## 📊 **Test Results Interpretation**

### **Automated Test Results**

The test suite will show:
- ✅ **PASS**: Requirement satisfied
- ❌ **FAIL**: Requirement not satisfied

### **Expected Test Output**
```
🔐 POST-QUANTUM CRYPTOGRAPHY REQUIREMENTS TESTING SUITE
============================================================
Testing all three requirements:
1. PQC KEM (Kyber) for key exchange
2. Digital signatures for message integrity
3. Secure user authentication and key storage
============================================================

============================================================
🧪 TESTING: Server Connectivity
============================================================
✅ PASS Server Running
   Details: Message: Post-Quantum Mail Service - Server Running

============================================================
🧪 TESTING: Requirement 1: PQC KEM (Kyber) Key Exchange
============================================================
✅ PASS Get Server Public Key
   Details: Key length: 1632 chars
✅ PASS Generate Client Keypair
   Details: Key length: 800 bytes
✅ PASS Key Encapsulation
   Details: Shared secret length: 32 chars
✅ PASS Shared Secret Verification
   Details: Secrets match

============================================================
🧪 TESTING: Requirement 2: Digital Signatures for Message Integrity
============================================================
✅ PASS Get Server Signature Public Key
   Details: Key length: 64 chars
✅ PASS Message Signing
   Details: Signature length: 64 chars
✅ PASS Signature Verification
   Details: Signature is valid
✅ PASS Tamper Detection
   Details: Correctly detected tampered message

============================================================
🧪 TESTING: Requirement 3: User Authentication and Key Storage
============================================================
✅ PASS User Registration
   Details: User keys generated: Kyber=1632, Signature=64
✅ PASS User Login
   Details: JWT token generated, keys returned
✅ PASS Key Storage Consistency
   Details: Stored keys match returned keys
✅ PASS Authentication Security
   Details: Correctly rejected wrong password
✅ PASS Duplicate Registration Prevention
   Details: Correctly prevented duplicate registration

============================================================
🧪 TESTING: PQC Integration Test
============================================================
✅ PASS PQC Integration
   Details: All PQC components working

============================================================
📊 TEST SUMMARY
============================================================
Total Tests: 5
Passed: 5
Failed: 0
Success Rate: 100.0%

🎉 ALL REQUIREMENTS SATISFIED!
✅ PQC KEM (Kyber) implementation working
✅ Digital signatures implementation working
✅ User authentication and key storage working
```

## 🛠️ **Troubleshooting**

### **Common Issues**

1. **"Module not found: flask_cors"**
   ```bash
   cd backend
   source venv/bin/activate
   pip install flask-cors==4.0.0
   ```

2. **"smaj-kyber not found"**
   ```bash
   pip install smaj-kyber==0.1.3
   ```

3. **"Connection refused"**
   - Ensure Flask server is running on port 5000
   - Check if port is blocked by firewall

4. **"CORS errors"**
   - Verify flask-cors is installed
   - Check server logs for CORS configuration

### **Debug Commands**

```bash
# Check if server is running
curl http://127.0.0.1:5000/

# Test PQC endpoints
curl http://127.0.0.1:5000/test_pqc

# Check Python dependencies
cd backend && source venv/bin/activate && pip list | grep -E "(flask|smaj|bcrypt)"
```

## 📈 **Performance Testing**

### **Key Exchange Performance**
- Measure time for key generation
- Test encapsulation/decapsulation speed
- Monitor memory usage during operations

### **Signature Performance**
- Measure signing time
- Test verification speed
- Check signature size

### **Authentication Performance**
- Test login/logout speed
- Measure JWT token generation
- Monitor key storage operations

## 🔒 **Security Validation**

### **Password Security**
- ✅ bcrypt hashing with salt
- ✅ Password strength requirements
- ✅ Secure password storage

### **Key Security**
- ✅ Secure key generation
- ✅ Encrypted key storage
- ✅ Key rotation capabilities

### **Authentication Security**
- ✅ JWT token expiration
- ✅ Secure token generation
- ✅ Session management

## 📝 **Test Report Template**

```
POST-QUANTUM CRYPTOGRAPHY TEST REPORT
=====================================

Date: [Current Date]
Tester: [Your Name]
Environment: [OS, Python Version, Node Version]

REQUIREMENT 1: PQC KEM (Kyber)
Status: ✅ PASS / ❌ FAIL
Details: [Test results and observations]

REQUIREMENT 2: Digital Signatures
Status: ✅ PASS / ❌ FAIL
Details: [Test results and observations]

REQUIREMENT 3: User Authentication & Key Storage
Status: ✅ PASS / ❌ FAIL
Details: [Test results and observations]

OVERALL ASSESSMENT:
- All requirements satisfied: [Yes/No]
- Security level: [High/Medium/Low]
- Performance: [Good/Acceptable/Poor]
- Recommendations: [Any improvements needed]
```

## 🎯 **Success Criteria**

All requirements are considered satisfied when:

1. **PQC KEM**: Kyber512 key exchange works correctly
2. **Digital Signatures**: Message signing and verification work
3. **Authentication**: User registration, login, and key storage work
4. **Integration**: All components work together seamlessly
5. **Security**: All security measures are properly implemented

## 🚀 **Next Steps**

After successful testing:

1. **Deploy to production** with proper security measures
2. **Implement real Dilithium signatures** (when library available)
3. **Add more PQC algorithms** (Kyber768, Kyber1024)
4. **Enhance security** with additional measures
5. **Performance optimization** for production use

---

**Note**: This testing guide ensures all PQC requirements are properly validated and working correctly in your GuardBox application.

