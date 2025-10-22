# Requirement 1 Testing Guide: PQC KEM (Kyber) for Key Exchange

## 🎯 **Requirement 1: Post-Quantum Cryptography Key Encapsulation Mechanism (KEM)**

**Objective**: Use Post-Quantum Cryptography (PQC) Key Encapsulation Mechanisms (KEMs), such as Kyber, for securely exchanging information between the server and clients.

## 🔧 **Step-by-Step Testing Procedure**

### **Step 1: Start the Flask Server**

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
source venv/bin/activate

# Start the server
python3 server_final.py
```

**Expected Output:**
```
🔐 Generating Post-Quantum Cryptography keypairs...
✅ Kyber512 keypair generated
✅ Digital signature keypair generated
Public Key (first 50 chars): [key]...
Signature Public Key (first 50 chars): [key]...
* Running on http://127.0.0.1:5000
```

### **Step 2: Test Server Connectivity**

```bash
# Test if server is running
curl http://127.0.0.1:5000/
```

**Expected Response:**
```json
{
  "message": "Post-Quantum Mail Service - Server Running",
  "features": [
    "Kyber512 KEM for key exchange",
    "Digital signatures for message integrity",
    "Secure user authentication",
    "Encrypted key storage"
  ]
}
```

### **Step 3: Test Kyber512 Public Key Generation**

```bash
# Get server's Kyber512 public key
curl http://127.0.0.1:5000/get_server_pk
```

**Expected Response:**
```json
{
  "public_key": "a1b2c3d4e5f6...",
  "algorithm": "Kyber512"
}
```

**Validation:**
- ✅ Public key should be ~1600 characters long
- ✅ Algorithm should be "Kyber512"
- ✅ Key should be valid hexadecimal

### **Step 4: Test Client Key Generation**

Create a test script to generate client keypair:

```bash
# Create test script
cat > test_kyber_client.py << 'EOF'
#!/usr/bin/env python3
from smaj_kyber import keygen, encapsulate, decapsulate
import requests

# Generate client keypair
print("🔑 Generating client Kyber512 keypair...")
client_pk, client_sk = keygen()
print(f"✅ Client public key generated: {len(client_pk)} bytes")
print(f"✅ Client private key generated: {len(client_sk)} bytes")
print(f"Client public key (first 50 chars): {client_pk.hex()[:50]}...")

# Test key encapsulation with server
print("\n🔐 Testing key encapsulation with server...")
response = requests.post("http://127.0.0.1:5000/encapsulate", 
                        json={"client_public_key": client_pk.hex()})

if response.status_code == 200:
    data = response.json()
    ciphertext_hex = data.get('ciphertext')
    shared_secret_hex = data.get('shared_secret')
    
    print(f"✅ Server encapsulation successful")
    print(f"✅ Ciphertext length: {len(ciphertext_hex)} chars")
    print(f"✅ Shared secret length: {len(shared_secret_hex)} chars")
    
    # Verify shared secret
    ciphertext = bytes.fromhex(ciphertext_hex)
    decrypted_secret = decapsulate(client_sk, ciphertext)
    shared_secret = bytes.fromhex(shared_secret_hex)
    
    if decrypted_secret == shared_secret:
        print("✅ Shared secret verification: SUCCESS")
        print("✅ Kyber512 KEM working correctly!")
    else:
        print("❌ Shared secret verification: FAILED")
        print("❌ Kyber512 KEM not working correctly!")
else:
    print(f"❌ Server encapsulation failed: {response.status_code}")
    print(f"Error: {response.text}")

EOF

# Run the test
python3 test_kyber_client.py
```

### **Step 5: Manual Testing with curl**

```bash
# Generate a valid client public key first
python3 -c "
from smaj_kyber import keygen
client_pk, client_sk = keygen()
print('Client public key:', client_pk.hex())
" > client_key.txt

# Extract the key
CLIENT_PK=$(cat client_key.txt | grep "Client public key:" | cut -d' ' -f4)

# Test key encapsulation
curl -X POST http://127.0.0.1:5000/encapsulate \
  -H "Content-Type: application/json" \
  -d "{\"client_public_key\": \"$CLIENT_PK\"}"
```

**Expected Response:**
```json
{
  "ciphertext": "a1b2c3d4e5f6...",
  "shared_secret": "f6e5d4c3b2a1...",
  "algorithm": "Kyber512"
}
```

### **Step 6: Test PQC Integration Endpoint**

```bash
# Test the overall PQC integration
curl http://127.0.0.1:5000/test_pqc
```

**Expected Response:**
```json
{
  "kyber_test": {
    "success": true,
    "shared_secret_length": 32
  },
  "signature_test": {
    "success": true,
    "signature_length": 64
  },
  "server_info": {
    "kyber_public_key": "a1b2c3d4e5f6...",
    "signature_public_key": "f6e5d4c3b2a1..."
  }
}
```

## ✅ **Success Criteria for Requirement 1**

### **Must Pass All Tests:**

1. **✅ Server Key Generation**
   - Server generates Kyber512 keypair at startup
   - Public key is accessible via `/get_server_pk` endpoint
   - Key is valid hexadecimal format

2. **✅ Client Key Generation**
   - Client can generate Kyber512 keypair
   - Keys are proper length and format

3. **✅ Key Encapsulation**
   - Server can encapsulate client's public key
   - Returns valid ciphertext and shared secret
   - No errors in the process

4. **✅ Shared Secret Verification**
   - Client can decapsulate the ciphertext
   - Decrypted shared secret matches server's shared secret
   - Key exchange is successful

5. **✅ Integration Test**
   - `/test_pqc` endpoint shows `kyber_test.success: true`
   - All Kyber512 operations work correctly

## 🚨 **Common Issues and Solutions**

### **Issue 1: "Module not found: smaj_kyber"**
```bash
cd backend
source venv/bin/activate
pip install smaj-kyber==0.1.3
```

### **Issue 2: "Connection refused"**
```bash
# Check if server is running
curl http://127.0.0.1:5000/

# If not running, start it:
cd backend
source venv/bin/activate
python3 server_final.py
```

### **Issue 3: "Invalid hex data"**
- Make sure client public key is valid hexadecimal
- Use the test script above to generate proper keys

### **Issue 4: "Shared secrets don't match"**
- This indicates a problem with the Kyber implementation
- Check server logs for errors
- Verify both client and server are using the same Kyber512 mode

## 📊 **Test Results Template**

```
REQUIREMENT 1: PQC KEM (Kyber) TEST RESULTS
==========================================

Date: [Current Date]
Tester: [Your Name]

Test 1: Server Key Generation
Status: ✅ PASS / ❌ FAIL
Details: [Server generates Kyber512 keypair]

Test 2: Client Key Generation  
Status: ✅ PASS / ❌ FAIL
Details: [Client can generate Kyber512 keypair]

Test 3: Key Encapsulation
Status: ✅ PASS / ❌ FAIL
Details: [Server encapsulates client public key]

Test 4: Shared Secret Verification
Status: ✅ PASS / ❌ FAIL
Details: [Decrypted secret matches server secret]

Test 5: Integration Test
Status: ✅ PASS / ❌ FAIL
Details: [Overall PQC integration works]

OVERALL RESULT: ✅ PASS / ❌ FAIL
Requirement 1 Satisfied: [Yes/No]
```

## 🎯 **Quick Validation Commands**

```bash
# Quick test sequence
echo "Testing Requirement 1: PQC KEM (Kyber)"

# 1. Test server
curl -s http://127.0.0.1:5000/ | grep -q "Kyber512" && echo "✅ Server running" || echo "❌ Server not running"

# 2. Test key generation
curl -s http://127.0.0.1:5000/get_server_pk | grep -q "Kyber512" && echo "✅ Kyber512 key available" || echo "❌ Kyber512 key not available"

# 3. Test integration
curl -s http://127.0.0.1:5000/test_pqc | grep -q '"success": true' && echo "✅ PQC integration working" || echo "❌ PQC integration failed"
```

## 🏆 **Success Indicators**

When Requirement 1 is working correctly, you should see:

- ✅ Server generates Kyber512 keypair at startup
- ✅ Client can generate Kyber512 keypair
- ✅ Key encapsulation works without errors
- ✅ Shared secrets match between client and server
- ✅ `/test_pqc` endpoint shows `kyber_test.success: true`
- ✅ No error messages in server logs
- ✅ All curl commands return valid JSON responses

**Requirement 1 is satisfied when all the above conditions are met!** 🎉
