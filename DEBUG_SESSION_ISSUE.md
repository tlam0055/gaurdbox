# 🔍 Debugging Session Key Issue

## Problem
You're still getting garbled text after decryption, which means the shared secret used for encryption and decryption are still different.

## Quick Fix Steps

### Step 1: Clear All Session Data
1. Open Browser Developer Tools (F12)
2. Go to **Application** tab → **Storage** → **Local Storage**
3. Find and **delete** the `pqc-session` entry
4. **Refresh the page**

### Step 2: Test with Fresh Session
1. **Compose** a new email
2. **Enable PQC** (click the Key icon 🔑)
3. Wait for **"PQC Ready"** status
4. Write a simple test message: **"Hello World Test"**
5. **Send PQC-Encrypted**
6. **Immediately** try to decrypt it (don't refresh the page)

### Step 3: Check Browser Console
Look for these debug messages:
```
🔐 Initializing Post-Quantum Cryptography session...
✅ PQC session initialized successfully
🔑 Shared secret established
Session ID: pqc-session-[timestamp]-[random]
PQC session stored locally
```

When decrypting:
```
🔓 Decrypting PQC encrypted email...
=== PQC Session Debug ===
Session ID: pqc-session-[same-timestamp]-[same-random]
Is Initialized: true
Has Shared Secret: true
Has Server Public Key: true
Shared Secret (first 20 chars): [same-key]...
Server Public Key (first 20 chars): [same-key]...
========================
Using shared secret for decryption: [same-key]...
✅ Email content decrypted successfully
```

## Manual Testing in Console

You can also test this manually in the browser console:

```javascript
// Clear session
pqcService.clearSession();

// Check session state
pqcService.debugSession();

// Initialize new session
await pqcService.initializePQCSession();

// Check session again
pqcService.debugSession();

// Test encryption/decryption
const testMessage = "Hello World Test";
const encrypted = pqcService.encryptMessage(testMessage, pqcService.sharedSecret);
console.log('Encrypted:', encrypted);

const decrypted = pqcService.decryptMessage(encrypted, pqcService.sharedSecret);
console.log('Decrypted:', decrypted);
console.log('Match:', testMessage === decrypted);
```

## Expected Results

### ✅ Success:
- Session ID should be the same for encryption and decryption
- Shared secret should be the same
- Decrypted text should match original message

### ❌ Failure:
- Different session IDs
- Different shared secrets
- Garbled decrypted text

## If Still Not Working

If you're still getting garbled text, try this **nuclear option**:

1. **Clear all browser data** for localhost:3000
2. **Restart the React app** (`npm start`)
3. **Restart the Flask server** (Ctrl+C, then restart)
4. **Try the test again**

This ensures a completely fresh start with no cached session data.
