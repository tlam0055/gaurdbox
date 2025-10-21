# GuardBox PQC Troubleshooting Guide

## 🚨 "Failed to initialize Post-Quantum Cryptography" Error

### Quick Diagnosis

1. **Check if Flask server is running:**
   ```bash
   curl http://127.0.0.1:5000/
   ```
   Should return: `{"message": "Post-Quantum Mail Service - Server Running"}`

2. **Check if React app is running:**
   ```bash
   curl http://localhost:3000/
   ```
   Should return HTML content

3. **Test PQC endpoint:**
   ```bash
   curl http://127.0.0.1:5000/get_server_pk
   ```
   Should return JSON with public_key

### Common Issues & Solutions

#### Issue 1: Flask Server Not Running
**Symptoms:** "Failed to initialize Post-Quantum Cryptography" error

**Solution:**
```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
source venv/bin/activate

# Start Flask server
python3 server.py
```

**Expected Output:**
```
✅ Kyber512 keypair generated
Public Key (first 50 chars): [key]...
* Running on http://127.0.0.1:5000
```

#### Issue 2: CORS Errors
**Symptoms:** Browser console shows CORS errors, network requests fail

**Solution:**
```bash
# Install flask-cors if not already installed
cd backend
source venv/bin/activate
pip install flask-cors==4.0.0

# Restart Flask server
python3 server.py
```

**Verify CORS is working:**
```bash
curl -H "Origin: http://localhost:3000" -v http://127.0.0.1:5000/get_server_pk
```
Should show: `Access-Control-Allow-Origin: http://localhost:3000`

#### Issue 3: Port Conflicts
**Symptoms:** "Something is already running on port 3000" or Flask server won't start

**Solution:**
```bash
# Kill processes on port 3000
lsof -ti:3000 | xargs kill -9

# Kill processes on port 5000
lsof -ti:5000 | xargs kill -9

# Start servers again
npm start                    # React app
./start_backend.sh          # Flask server
```

#### Issue 4: Python Dependencies Missing
**Symptoms:** "Module not found" errors when starting Flask

**Solution:**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

#### Issue 5: PQC Library Issues
**Symptoms:** "smaj-kyber not found" or similar errors

**Solution:**
```bash
cd backend
source venv/bin/activate
pip install smaj-kyber==0.1.3
```

### Step-by-Step Debugging

#### Step 1: Verify Backend
```bash
# Test Flask server
curl http://127.0.0.1:5000/

# Test PQC endpoint
curl http://127.0.0.1:5000/get_server_pk

# Check CORS headers
curl -H "Origin: http://localhost:3000" -v http://127.0.0.1:5000/get_server_pk
```

#### Step 2: Verify Frontend
```bash
# Check React app
curl http://localhost:3000/

# Open browser console and check for errors
# Look for network requests to 127.0.0.1:5000
```

#### Step 3: Test PQC Integration
1. Open `http://localhost:3000`
2. Click "Compose"
3. Click the key icon (🔑) to enable PQC
4. Check browser console for PQC status messages
5. Look for "✅ PQC session initialized successfully"

### Browser Console Debugging

#### Check for these messages:
- ✅ `🔐 Initializing Post-Quantum Cryptography session...`
- ✅ `Server public key fetched: [key]...`
- ✅ `Client key pair generated`
- ✅ `Key encapsulation completed`
- ✅ `✅ PQC session initialized successfully`

#### Common error messages:
- ❌ `Failed to initialize Post-Quantum Cryptography`
- ❌ `Error fetching server public key: [error]`
- ❌ `CORS error: [details]`
- ❌ `Network error: [details]`

### Manual Testing

#### Test 1: Direct PQC Test
Open `test_pqc.html` in your browser and click "Test PQC Connection"

#### Test 2: Browser Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Open GuardBox and click Compose → PQC button
4. Look for requests to `127.0.0.1:5000/get_server_pk`
5. Check if requests succeed (status 200)

#### Test 3: Console Logging
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for PQC-related log messages
4. Check for any error messages

### Environment Verification

#### Check Python Environment:
```bash
cd backend
source venv/bin/activate
python3 --version
pip list | grep -E "(flask|smaj-kyber|flask-cors)"
```

#### Check Node.js Environment:
```bash
node --version
npm --version
npm list | grep -E "(react|bootstrap)"
```

### Complete Reset

If nothing works, try a complete reset:

```bash
# Stop all servers
pkill -f "python3 server.py"
pkill -f "npm start"

# Clean and restart backend
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 server.py &

# Clean and restart frontend
cd ..
npm install
npm start
```

### Success Indicators

When everything is working correctly, you should see:

1. **Flask Server:**
   ```
   ✅ Kyber512 keypair generated
   * Running on http://127.0.0.1:5000
   ```

2. **React App:**
   ```
   webpack compiled successfully
   Local:            http://localhost:3000
   ```

3. **Browser Console:**
   ```
   🔐 Initializing Post-Quantum Cryptography session...
   Server public key fetched: [key]...
   ✅ PQC session initialized successfully
   ```

4. **PQC Button:**
   - Shows green key icon (🔑) when connected
   - Shows "PQC Ready" status
   - Allows sending encrypted messages

### Still Having Issues?

If you're still experiencing problems:

1. **Check the logs** in both terminal windows
2. **Verify all dependencies** are installed correctly
3. **Test with the provided test file** (`test_pqc.html`)
4. **Check firewall/antivirus** settings that might block localhost connections
5. **Try different ports** if 3000/5000 are blocked

### Contact Support

If none of these solutions work, please provide:
- Operating system and version
- Python version (`python3 --version`)
- Node.js version (`node --version`)
- Complete error messages from browser console
- Complete error messages from terminal
- Steps you've already tried
