from flask import Flask, jsonify, request
from flask_cors import CORS
from smaj_kyber import keygen, set_mode, encapsulate, decapsulate
import bcrypt
import hashlib
import hmac
from datetime import datetime, timedelta
import jwt
import secrets

app = Flask(__name__)
CORS(app)

# Use Kyber512
set_mode("512")

# Generate server keypairs at startup
print("🔐 Generating Post-Quantum Cryptography keypairs...")
server_pk, server_sk = keygen()
server_signature_pk, server_signature_sk = secrets.token_hex(32), secrets.token_hex(32)

# In-memory user database with test users
users_db = {
    "admin": {
        "password_hash": bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()),
        "kyber_keys": None,
        "signature_keys": None,
        "created_at": datetime.now()
    },
    "testuser1@guardbox.com": {
        "password_hash": bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()),
        "kyber_keys": {
            "public": "testuser1_kyber_pk_placeholder",
            "private": "testuser1_kyber_sk_placeholder"
        },
        "signature_keys": {
            "public": "testuser1_sig_pk_placeholder",
            "private": "testuser1_sig_sk_placeholder"
        },
        "created_at": datetime.now()
    },
    "testuser2@guardbox.com": {
        "password_hash": bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()),
        "kyber_keys": {
            "public": "testuser2_kyber_pk_placeholder",
            "private": "testuser2_kyber_sk_placeholder"
        },
        "signature_keys": {
            "public": "testuser2_sig_pk_placeholder",
            "private": "testuser2_sig_sk_placeholder"
        },
        "created_at": datetime.now()
    }
}

JWT_SECRET = "your-secret-key-change-in-production"

def sign_message(private_key, message):
    return hmac.new(
        private_key.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()

def verify_signature(public_key, message, signature):
    expected_signature = hmac.new(
        public_key.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected_signature)

@app.route("/")
def home():
    return jsonify({
        "message": "Post-Quantum Mail Service - Server Running",
        "features": [
            "Kyber512 KEM for key exchange",
            "Digital signatures for message integrity", 
            "Secure user authentication",
            "Encrypted key storage"
        ],
        "test_users": ["testuser1", "testuser2"]
    })

@app.route("/get_server_pk", methods=["GET"])
def get_server_pk():
    return jsonify({
        "public_key": server_pk.hex(),
        "algorithm": "Kyber512"
    })

@app.route("/get_server_signature_pk", methods=["GET"])
def get_server_signature_pk():
    return jsonify({
        "public_key": server_signature_pk,
        "algorithm": "HMAC-SHA256"
    })

@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400
            
        if username in users_db:
            return jsonify({"error": "User already exists"}), 400
            
        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Generate user's PQC keypairs
        user_kyber_pk, user_kyber_sk = keygen()
        user_signature_pk, user_signature_sk = secrets.token_hex(32), secrets.token_hex(32)
        
        # Store user
        users_db[username] = {
            "password_hash": password_hash,
            "kyber_keys": {
                "public": user_kyber_pk.hex(),
                "private": user_kyber_sk.hex()
            },
            "signature_keys": {
                "public": user_signature_pk, 
                "private": user_signature_sk
            },
            "created_at": datetime.now()
        }
        
        return jsonify({
            "message": "User registered successfully",
            "user_kyber_pk": user_kyber_pk.hex(),
            "user_signature_pk": user_signature_pk
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get('email') or data.get('username')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400
            
        if email not in users_db:
            return jsonify({"error": "User not found"}), 404
            
        user = users_db[email]
        
        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash']):
            return jsonify({"error": "Invalid password"}), 401
            
        # Generate JWT token
        token = jwt.encode({
            'email': email,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, JWT_SECRET, algorithm='HS256')
        
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user_kyber_pk": user['kyber_keys']['public'],
            "user_signature_pk": user['signature_keys']['public']
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/encapsulate", methods=["POST"])
def encapsulate_key():
    try:
        data = request.get_json()
        client_pk_hex = data.get('client_public_key')
        
        if not client_pk_hex:
            return jsonify({"error": "Client public key required"}), 400
        
        # Convert hex to bytes
        client_pk = bytes.fromhex(client_pk_hex)
        
        # Perform Kyber encapsulation
        ciphertext, shared_secret = encapsulate(client_pk)
        
        return jsonify({
            "ciphertext": ciphertext.hex(),
            "shared_secret": shared_secret.hex(),
            "algorithm": "Kyber512"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/sign", methods=["POST"])
def sign_message_endpoint():
    try:
        data = request.get_json()
        message = data.get('message')
        
        if not message:
            return jsonify({"error": "Message required"}), 400
            
        # Sign message with server's signature private key
        signature = sign_message(server_signature_sk, message)
        
        return jsonify({
            "signature": signature,
            "message": message,
            "algorithm": "HMAC-SHA256"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/verify", methods=["POST"])
def verify_signature_endpoint():
    try:
        data = request.get_json()
        message = data.get('message')
        signature = data.get('signature')
        public_key = data.get('public_key')
        
        if not all([message, signature, public_key]):
            return jsonify({"error": "Message, signature, and public key required"}), 400
            
        # Verify signature
        is_valid = verify_signature(public_key, message, signature)
        
        return jsonify({
            "valid": is_valid,
            "message": message,
            "algorithm": "HMAC-SHA256"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/test_pqc", methods=["GET"])
def test_pqc():
    try:
        # Test Kyber KEM
        test_pk, test_sk = keygen()
        ciphertext, shared_secret = encapsulate(test_pk)
        decrypted_secret = decapsulate(test_sk, ciphertext)
        
        # Test digital signatures
        test_signature_pk, test_signature_sk = secrets.token_hex(32), secrets.token_hex(32)
        test_message = "Post-Quantum Cryptography Test"
        test_signature = sign_message(test_signature_sk, test_message)
        signature_valid = verify_signature(test_signature_pk, test_message, test_signature)
        
        return jsonify({
            "kyber_test": {
                "success": shared_secret == decrypted_secret,
                "shared_secret_length": len(shared_secret)
            },
            "signature_test": {
                "success": signature_valid,
                "signature_length": len(test_signature)
            },
            "server_info": {
                "kyber_public_key": server_pk.hex()[:50] + "...",
                "signature_public_key": server_signature_pk[:50] + "..."
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/users", methods=["GET"])
def get_users():
    """Get list of available test users"""
    return jsonify({
        "users": list(users_db.keys()),
        "test_users": ["testuser1@guardbox.com", "testuser2@guardbox.com"]
    })

# Email storage (in-memory for demo)
emails_db = []

@app.route("/send_email", methods=["POST"])
def send_email():
    """Send an email between users"""
    try:
        # Get user from token
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "No token provided"}), 401
            
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            user_email = payload['email']
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        # Validate required fields
        required_fields = ['to', 'subject', 'body']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Create email object
        email_id = len(emails_db) + 1
        email = {
            "id": email_id,
            "from": user_email,
            "to": data['to'],
            "cc": data.get('cc', ''),
            "bcc": data.get('bcc', ''),
            "subject": data['subject'],
            "body": data['body'],
            "timestamp": datetime.now().isoformat(),
            "is_read": False,
            "is_starred": False,
            "is_important": False,
            "is_deleted": False,
            "encryption_info": data.get('encryptionInfo', ''),
            "is_pqc_encrypted": data.get('isPQCEncrypted', False)
        }
        
        # Store email
        emails_db.append(email)
        
        print(f"📧 Email sent from {user_email} to {data['to']}")
        
        return jsonify({
            "message": "Email sent successfully",
            "email_id": email_id
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_emails", methods=["GET"])
def get_emails():
    """Get emails for a user"""
    try:
        # Get user from token
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "No token provided"}), 401
            
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            user_email = payload['email']
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        
        folder = request.args.get('folder', 'inbox')
        
        # Filter emails based on folder and user
        user_emails = []
        for email in emails_db:
            if folder == 'inbox' and email['to'] == user_email and not email['is_deleted']:
                user_emails.append(email)
            elif folder == 'sent' and email['from'] == user_email and not email['is_deleted']:
                user_emails.append(email)
            elif folder == 'starred' and (email['to'] == user_email or email['from'] == user_email) and email['is_starred'] and not email['is_deleted']:
                user_emails.append(email)
            elif folder == 'important' and (email['to'] == user_email or email['from'] == user_email) and email['is_important'] and not email['is_deleted']:
                user_emails.append(email)
            elif folder == 'trash' and (email['to'] == user_email or email['from'] == user_email) and email['is_deleted']:
                user_emails.append(email)
        
        # Sort by timestamp (newest first)
        user_emails.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return jsonify({
            "emails": user_emails,
            "folder": folder,
            "count": len(user_emails)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/mark_read", methods=["POST"])
def mark_read():
    """Mark an email as read"""
    try:
        # Get user from token
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "No token provided"}), 401
            
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            user_email = payload['email']
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        
        data = request.get_json()
        email_id = data.get('email_id')
        
        if not email_id:
            return jsonify({"error": "Email ID required"}), 400
        
        # Find and update email
        for email in emails_db:
            if email['id'] == email_id and (email['to'] == user_email or email['from'] == user_email):
                email['is_read'] = True
                return jsonify({"message": "Email marked as read"})
        
        return jsonify({"error": "Email not found"}), 404
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/delete_email", methods=["POST"])
def delete_email():
    """Delete an email (move to trash)"""
    try:
        # Get user from token
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "No token provided"}), 401
            
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            user_email = payload['email']
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        
        data = request.get_json()
        email_id = data.get('email_id')
        
        if not email_id:
            return jsonify({"error": "Email ID required"}), 400
        
        # Find and update email
        for email in emails_db:
            if email['id'] == email_id and (email['to'] == user_email or email['from'] == user_email):
                email['is_deleted'] = True
                return jsonify({"message": "Email moved to trash"})
        
        return jsonify({"error": "Email not found"}), 404
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("✅ Kyber512 keypair generated")
    print("✅ Digital signature keypair generated")
    print("✅ Test users pre-created: testuser1@guardbox.com, testuser2@guardbox.com")
    print("Public Key (first 50 chars):", server_pk.hex()[:50], "...")
    print("Signature Public Key (first 50 chars):", server_signature_pk[:50], "...")
    app.run(host="127.0.0.1", port=5000, debug=True)

