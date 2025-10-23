# 🔓 How to Find the Decrypt Button in GuardBox

## **📍 Where to Look for the Decrypt Button**

### **Step 1: Open Any Email**
1. **Click on any email** in your inbox or email list
2. **Email view opens** showing the email content

### **Step 2: Look for the Decrypt Button**
The decrypt button is now **ALWAYS VISIBLE** in the email view:

```
┌─────────────────────────────────────────┐
│  📧 Email Subject                      │
│  From: sender@example.com              │
│  To: recipient@example.com             │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │  🔒 Post-Quantum Encrypted Email   │ │  ← PQC Status Banner (if encrypted)
│  │  [PQC Secured] [Decrypt Email]     │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │  🔑 Decrypt Email Content           │ │  ← MAIN DECRYPT BUTTON (ALWAYS HERE!)
│  └─────────────────────────────────────┘ │
│                                         │
│  Email content appears here...          │
└─────────────────────────────────────────┘
```

## **🎯 The Main Decrypt Button**

**Location**: In the center of the email view, above the email content
**Appearance**: Large blue button with Key icon
**Text**: "Decrypt Email Content" (or "Hide Decrypted Content" after decryption)

## **🔍 Visual Indicators**

### **For PQC Encrypted Emails:**
- **Blue banner** at the top: "Post-Quantum Encrypted Email"
- **"PQC Secured" badge**
- **Shield icon (🔒)**
- **Additional decrypt button** in the banner

### **For Regular Encrypted Emails:**
- **Yellow banner**: "Encrypted Email Detected"
- **"Encrypted" badge**
- **Shield icon (🔒)**

### **For Any Email:**
- **Large blue button** in the center: "Decrypt Email Content"
- **Key icon (🔑)** on the button
- **Always visible** regardless of encryption type

## **🖱️ How to Use the Decrypt Button**

### **Method 1: Main Decrypt Button (Recommended)**
1. **Open any email** by clicking on it
2. **Look for the large blue button** in the center of the email view
3. **Click "Decrypt Email Content"**
4. **Wait for decryption** (shows "Decrypting..." with spinner)
5. **View decrypted content** when complete

### **Method 2: PQC Status Banner (For PQC Emails)**
1. **Look for blue banner** at the top of encrypted emails
2. **Click "Decrypt Email"** button in the banner
3. **Same decryption process** as above

## **📱 Button States**

### **Before Decryption:**
```
🔑 Decrypt Email Content
```

### **During Decryption:**
```
⏳ Decrypting...
```

### **After Decryption:**
```
🔑 Hide Decrypted Content
```

## **🎨 Visual Guide**

```
Email View Layout:
┌─────────────────────────────────────────┐
│  📧 Email Header (Subject, From, To)   │
│                                         │
│  🔒 PQC Status Banner (if encrypted)   │  ← Optional
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │  🔑 Decrypt Email Content           │ │  ← MAIN BUTTON HERE!
│  └─────────────────────────────────────┘ │
│                                         │
│  📄 Email Content                       │
└─────────────────────────────────────────┘
```

## **✅ Success Indicators**

- **Button appears**: Large blue button with Key icon
- **Button text**: "Decrypt Email Content"
- **Button location**: Center of email view, above content
- **Button size**: Large (btn-lg class)
- **Button color**: Blue (btn-primary)

## **🚨 Troubleshooting**

### **If you don't see the decrypt button:**
1. **Make sure you clicked on an email** (not just hovering)
2. **Check if email view is open** (not just email list)
3. **Look in the center** of the email view area
4. **Refresh the page** if needed

### **If decrypt button doesn't work:**
1. **Check browser console** for error messages
2. **Make sure PQC session is active** (for PQC encrypted emails)
3. **Try refreshing the page**
4. **Check if email is actually encrypted**

## **🎯 Quick Test**

1. **Send a PQC-encrypted email** from testuser1 to testuser2
2. **Login as testuser2**
3. **Click on the received email**
4. **Look for the large blue "Decrypt Email Content" button**
5. **Click it and watch the magic happen!**

## **📝 Notes**

- The decrypt button is **ALWAYS VISIBLE** for any email
- It works for both PQC-encrypted and regular encrypted emails
- The button is large and prominent for easy finding
- It's located in the center of the email view for maximum visibility
- The button changes text and color based on decryption state

**🎉 The decrypt button is now impossible to miss!** It's a large, blue button right in the center of every email view.
