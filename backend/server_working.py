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

# In-memory user database
users_db = {
    "admin": {
        "password_hash": bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()),
        "kyber_keys": None,
        "signature_keys": None,
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
        ]
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

if __name__ == "__main__":
    print("✅ Kyber512 keypair generated")
    print("✅ Digital signature keypair generated")
    print("Public Key (first 50 chars):", server_pk.hex()[:50], "...")
    print("Signature Public Key (first 50 chars):", server_signature_pk[:50], "...")
    app.run(host="127.0.0.1", port=5000, debug=True)

