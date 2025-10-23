# PQC Email Decryption Testing Guide

## Overview
This guide provides step-by-step instructions for testing the Post-Quantum Cryptography (PQC) email decryption functionality in GuardBox.

## Prerequisites
1. Flask backend server running on `http://127.0.0.1:5000`
2. React frontend running on `http://localhost:3000`
3. Two test users logged in: `testuser1@guardbox.com` and `testuser2@guardbox.com`

## Testing the Complete PQC Email Flow

### Step 1: Send PQC-Encrypted Email

1. **Login as testuser1@guardbox.com**
   - Go to `http://localhost:3000`
   - Enter email: `testuser1@guardbox.com`
   - Enter password: `password123`
   - Click "Sign In"

2. **Compose PQC-Encrypted Email**
   - Click "Compose" button
   - **Enable PQC Encryption:**
     - Click the PQC button (Key icon) in the compose toolbar
     - Wait for "PQC Connected" status
   - Fill email details:
     - To: `testuser2@guardbox.com`
     - Subject: `PQC Encrypted Test Message`
     - Body: `This is a secret message encrypted with Post-Quantum Cryptography!`
   - Click "Send"

3. **Verify Email Sent**
   - Check "Sent" folder
   - Email should show with Shield icon (🔒) indicating PQC encryption
   - Subject should have a blue shield icon

### Step 2: Receive and Decrypt Email

1. **Login as testuser2@guardbox.com**
   - Logout from testuser1
   - Login with `testuser2@guardbox.com` / `password123`

2. **Check Inbox**
   - Navigate to "Inbox"
   - Look for email from testuser1
   - Email should show Shield icon (🔒) in subject line
   - Email should show "PQC Secured" badge

3. **Open and Decrypt Email**
   - Click on the PQC-encrypted email
   - Email view should show:
     - Blue banner: "Post-Quantum Encrypted Email"
     - Badge: "PQC Secured"
     - Button: "Decrypt Email" (with Key icon)
   - **Click "Decrypt Email" button**
   - Wait for decryption to complete
   - Original message should appear: "This is a secret message encrypted with Post-Quantum Cryptography!"

4. **Test Decrypt Toggle**
   - Click "Hide Content" to re-encrypt the view
   - Click "Decrypt Email" again to show decrypted content
   - Verify content is the same both times

### Step 3: Test Error Handling

1. **Test Without PQC Session**
   - Logout and login again
   - Try to decrypt the email without initializing PQC
   - Should show error: "Failed to decrypt email. Make sure you have the correct PQC session active."

2. **Test Invalid PQC Session**
   - Initialize PQC session
   - Try to decrypt a non-PQC encrypted email
   - Should handle gracefully

### Step 4: Visual Indicators Testing

1. **Email List Indicators**
   - Shield icon (🔒) appears next to PQC-encrypted email subjects
   - Tooltip shows "PQC Encrypted" on hover
   - Visual distinction from regular emails

2. **Email View Indicators**
   - Blue banner for PQC-encrypted emails
   - "PQC Secured" badge
   - Decrypt button with Key icon
   - Loading state during decryption

## Expected Results

### Successful Decryption
- ✅ PQC-encrypted emails show Shield icon in list
- ✅ Email view shows PQC encryption banner
- ✅ Decrypt button works and shows original content
- ✅ Toggle between encrypted/decrypted view works
- ✅ Loading states display correctly

### Error Handling
- ✅ Error messages for failed decryption
- ✅ Graceful handling of missing PQC session
- ✅ User-friendly error messages

### Visual Indicators
- ✅ Shield icons throughout the interface
- ✅ PQC status badges and banners
- ✅ Loading states and button states
- ✅ Clear visual distinction for encrypted emails

## Troubleshooting

### Common Issues

1. **"Failed to decrypt email" Error**
   - Ensure PQC session is initialized
   - Check if email is actually PQC-encrypted
   - Verify shared secret is available

2. **Decrypt Button Not Appearing**
   - Check if email has `isPQCEncrypted: true` property
   - Verify email was sent with PQC encryption enabled

3. **Decryption Shows Garbled Text**
   - Ensure same PQC session is used for encryption and decryption
   - Check if shared secret is consistent

### Debug Steps

1. **Check Browser Console**
   - Look for PQC initialization messages
   - Check for decryption error messages
   - Verify shared secret availability

2. **Check Network Tab**
   - Verify PQC endpoints are accessible
   - Check for CORS issues
   - Ensure backend is running

3. **Check Email Properties**
   - Verify `isPQCEncrypted: true`
   - Check email body contains PQC format
   - Ensure encryption markers are present

## Test Scenarios

### Scenario 1: Normal PQC Flow
1. User A enables PQC and sends encrypted email
2. User B receives email with PQC indicators
3. User B clicks decrypt and reads content
4. User B can toggle between encrypted/decrypted view

### Scenario 2: Error Handling
1. User tries to decrypt without PQC session
2. User tries to decrypt non-PQC email
3. User tries to decrypt with invalid session

### Scenario 3: Visual Indicators
1. PQC emails show Shield icons in list
2. PQC emails show encryption banner in view
3. Decrypt button shows correct states
4. Loading states work properly

## Success Criteria

- [ ] PQC-encrypted emails are visually distinct
- [ ] Decrypt button appears for encrypted emails
- [ ] Decryption works and shows original content
- [ ] Toggle between encrypted/decrypted view works
- [ ] Error handling works for invalid scenarios
- [ ] Loading states display correctly
- [ ] Visual indicators are clear and consistent

## Notes
- PQC encryption/decryption is simulated for demonstration
- Real implementation would use actual Kyber/Dilithium libraries
- Shared secrets are stored in memory for demo purposes
- All PQC operations include proper error handling and user feedback
