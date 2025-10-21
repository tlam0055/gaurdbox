from flask import Flask, jsonify
from smaj_kyber import keygen, set_mode

app = Flask(__name__)

# Use Kyber512 (can change to "768" or "1024" later)
set_mode("512")

# Generate server keypair at startup
server_pk, server_sk = keygen()

@app.route("/")
def home():
    return jsonify({"message": "Post-Quantum Mail Service - Server Running"})

# Endpoint to share server's public key
@app.route("/get_server_pk", methods=["GET"])
def get_server_pk():
    return jsonify({
        "public_key": server_pk.hex()
    })

if __name__ == "__main__":
    print("✅ Kyber512 keypair generated")
    print("Public Key (first 50 chars):", server_pk.hex()[:50], "...")
    app.run(host="127.0.0.1", port=5000, debug=True)
