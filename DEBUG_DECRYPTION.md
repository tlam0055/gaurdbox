# 🔍 Debugging Email Decryption Issues

## Problem
You're getting the error: "Failed to decrypt email. This email may not be encrypted or the encryption format is not supported."

## Debugging Steps

### 1. Check Browser Console
Open your browser's Developer Tools (F12) and look at the Console tab when you try to decrypt an email. You should see detailed logs like:

```
🔓 Attempting to decrypt email...
Email body preview: 🔒 PQC ENCRYPTED MESSAGE 🔒...
Is PQC encrypted: true
Encryption info: PQC-Encrypted
Detected PQC encrypted email, attempting decryption...
🔓 Decrypting PQC encrypted email...
Encrypted content preview: 🔒 PQC ENCRYPTED MESSAGE 🔒...
```

### 2. Test the Complete Flow

#### Step 1: Send a PQC Encrypted Email
1. Click "Compose" button
2. Click the **Key icon** (🔑) in the toolbar to enable PQC
3. Wait for "PQC Ready" status
4. Write a test message
5. Click "Send PQC-Encrypted"
6. Check that the email appears in your inbox with a shield icon

#### Step 2: Try to Decrypt
1. Click on the PQC encrypted email
2. Look for the **"Decrypt Email Content"** button (it should be prominent)
3. Click the button
4. Check the browser console for detailed error messages

### 3. Common Issues and Solutions

#### Issue 1: "This email is not PQC encrypted"
**Cause**: The email doesn't contain the expected PQC markers
**Solution**: Make sure you enabled PQC encryption when composing the email

#### Issue 2: "No shared secret available"
**Cause**: The PQC session wasn't properly initialized
**Solution**: 
1. Refresh the page
2. Try composing a new PQC encrypted email
3. The PQC session should reinitialize automatically

#### Issue 3: "No encrypted content found in PQC format"
**Cause**: The email format is corrupted or incomplete
**Solution**: Try sending a new PQC encrypted email

### 4. Manual Testing

You can also test the decryption manually in the browser console:

```javascript
// Open browser console (F12) and run this:
const emailBody = `🔒 PQC ENCRYPTED MESSAGE 🔒

[your encrypted content here]

---
Digital Signature: [signature]
Encrypted with: Kyber512 + Dilithium
Timestamp: [timestamp]`;

// Test if the service can detect it
console.log('Contains PQC markers:', emailBody.includes('🔒 PQC ENCRYPTED MESSAGE 🔒'));

// Test decryption
pqcService.decryptEmailContent(emailBody).then(result => {
  console.log('Decryption successful:', result);
}).catch(error => {
  console.error('Decryption failed:', error);
});
```

### 5. Expected Behavior

When working correctly, you should see:

1. **Compose**: Key icon turns green when PQC is enabled
2. **Send**: Button shows "Send PQC-Encrypted"
3. **Inbox**: Email shows with shield icon
4. **Email View**: Prominent "Decrypt Email Content" button
5. **Decryption**: Content is decrypted and displayed

### 6. If Still Not Working

If you're still having issues, please share:

1. The exact error message from the browser console
2. Whether the PQC button turns green when composing
3. Whether the email shows a shield icon in the inbox
4. Whether you see the "Decrypt Email Content" button

This will help identify exactly where the process is failing.
