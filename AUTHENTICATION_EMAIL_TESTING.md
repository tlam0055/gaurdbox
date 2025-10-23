# GuardBox Authentication & Email System Testing Guide

## Overview
This guide provides comprehensive testing procedures for the GuardBox authentication system and email functionality between users.

## Prerequisites
1. Flask backend server running on `http://127.0.0.1:5000`
2. React frontend running on `http://localhost:3000`
3. Two test users created: `testuser1@guardbox.com` and `testuser2@guardbox.com`

## Test Users
- **testuser1@guardbox.com** / password: `password123`
- **testuser2@guardbox.com** / password: `password123`

## Testing Procedures

### 1. Authentication Testing

#### 1.1 Login Testing
1. **Open the application** in your browser at `http://localhost:3000`
2. **Verify login page appears** with GuardBox branding
3. **Test login with testuser1:**
   - Email: `testuser1@guardbox.com`
   - Password: `password123`
   - Click "Sign In"
   - Verify successful login and redirect to email interface
4. **Test login with testuser2:**
   - Logout from testuser1
   - Login with `testuser2@guardbox.com` / `password123`
   - Verify successful login

#### 1.2 Registration Testing
1. **Click "Create one here"** on login page
2. **Fill registration form:**
   - Full Name: `Test User`
   - Email: `newuser@guardbox.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. **Submit registration**
4. **Verify success message** and automatic redirect to login
5. **Login with new user** to verify account creation

### 2. Email System Testing

#### 2.1 Send Email from testuser1 to testuser2
1. **Login as testuser1@guardbox.com**
2. **Click "Compose" button**
3. **Fill email form:**
   - To: `testuser2@guardbox.com`
   - Subject: `Hello from testuser1`
   - Body: `This is a test email from testuser1 to testuser2!`
4. **Click "Send"**
5. **Verify email appears in testuser1's "Sent" folder**

#### 2.2 Receive Email as testuser2
1. **Logout from testuser1**
2. **Login as testuser2@guardbox.com**
3. **Check inbox** - should see the email from testuser1
4. **Click on the email** to open it
5. **Verify email content** matches what was sent
6. **Mark as read** by opening the email

#### 2.3 Send Reply Email from testuser2 to testuser1
1. **While logged in as testuser2**
2. **Click "Reply" on the received email**
3. **Add reply message:**
   - Subject: `Re: Hello from testuser1`
   - Body: `Thanks for the email! This is a reply from testuser2.`
4. **Send the reply**
5. **Verify email appears in testuser2's "Sent" folder**

#### 2.4 Check Reply in testuser1's Inbox
1. **Logout from testuser2**
2. **Login as testuser1@guardbox.com**
3. **Check inbox** - should see the reply from testuser2
4. **Open the reply** and verify content

### 3. Folder Navigation Testing

#### 3.1 Inbox Testing
- **Verify received emails appear in inbox**
- **Test email selection and viewing**
- **Test mark as read functionality**

#### 3.2 Sent Folder Testing
- **Navigate to "Sent" folder**
- **Verify sent emails appear**
- **Test opening sent emails**

#### 3.3 Trash Functionality Testing
1. **Select an email in inbox**
2. **Click "Delete" button**
3. **Navigate to "Trash" folder**
4. **Verify deleted email appears**
5. **Test "Restore" functionality**
6. **Test "Permanent Delete" functionality**

### 4. PQC Integration Testing

#### 4.1 PQC Status Indicator
- **Check PQC status in header** (should show "PQC Connected" or "PQC Offline")
- **Verify status updates** when backend is running/stopped

#### 4.2 PQC Email Encryption
1. **Open compose window**
2. **Click PQC button** (Key icon) to enable PQC encryption
3. **Verify PQC status changes** to "PQC Connected"
4. **Compose email with PQC enabled**
5. **Send email** and verify PQC encryption indicators
6. **Check received email** for PQC encryption markers

### 5. User Interface Testing

#### 5.1 Responsive Design
- **Test on desktop** (full sidebar visible)
- **Test on mobile** (hamburger menu)
- **Test sidebar toggle** on mobile

#### 5.2 Navigation
- **Test folder switching** (Inbox, Sent, Starred, Important, Trash)
- **Test search functionality**
- **Test compose modal** opening/closing

### 6. Backend API Testing

#### 6.1 Authentication Endpoints
```bash
# Test login
curl -X POST http://127.0.0.1:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser1@guardbox.com", "password": "password123"}'

# Test registration
curl -X POST http://127.0.0.1:5000/register \
  -H "Content-Type: application/json" \
  -d '{"email": "newuser@guardbox.com", "password": "password123", "full_name": "New User"}'
```

#### 6.2 Email Endpoints
```bash
# Send email (replace TOKEN with actual JWT token)
curl -X POST http://127.0.0.1:5000/send_email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"to": "testuser2@guardbox.com", "subject": "Test Email", "body": "Test message"}'

# Get emails
curl -X GET "http://127.0.0.1:5000/get_emails?folder=inbox" \
  -H "Authorization: Bearer TOKEN"
```

## Expected Results

### Successful Authentication
- ✅ Login page displays with GuardBox branding
- ✅ Users can login with correct credentials
- ✅ Users are redirected to email interface after login
- ✅ User email is displayed in header
- ✅ Logout functionality works

### Successful Email System
- ✅ Emails sent from one user appear in recipient's inbox
- ✅ Sent emails appear in sender's "Sent" folder
- ✅ Email content is preserved correctly
- ✅ Email timestamps are accurate
- ✅ Folder navigation works correctly

### Successful PQC Integration
- ✅ PQC status indicator shows connection status
- ✅ PQC encryption can be enabled in compose
- ✅ PQC encrypted emails are marked appropriately
- ✅ Backend PQC endpoints respond correctly

## Troubleshooting

### Common Issues
1. **"Connection error" on login**
   - Check if Flask server is running on port 5000
   - Verify CORS is enabled in backend

2. **Emails not appearing**
   - Check if user is logged in with correct account
   - Verify email addresses match exactly
   - Check browser console for errors

3. **PQC status shows "Offline"**
   - Ensure Flask server is running
   - Check if PQC endpoints are accessible
   - Verify backend PQC key generation

### Debug Steps
1. **Check browser console** for JavaScript errors
2. **Check Flask server logs** for backend errors
3. **Verify network requests** in browser dev tools
4. **Test API endpoints directly** with curl commands

## Test Completion Checklist

- [ ] Login with testuser1@guardbox.com
- [ ] Login with testuser2@guardbox.com
- [ ] Send email from testuser1 to testuser2
- [ ] Receive email as testuser2
- [ ] Send reply from testuser2 to testuser1
- [ ] Check sent folders for both users
- [ ] Test trash functionality
- [ ] Test PQC encryption
- [ ] Test responsive design
- [ ] Test all folder navigation

## Notes
- All email data is stored in-memory and will be lost when server restarts
- PQC encryption is simulated for demonstration purposes
- Test users are pre-created in the backend
- The system supports real-time email sending between authenticated users
