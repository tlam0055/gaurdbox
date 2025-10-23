#!/usr/bin/env python3
from smaj_kyber import keygen
import requests

# Generate a proper Kyber keypair
print("Generating proper Kyber512 keypair...")
client_pk, client_sk = keygen()
print(f"Client public key length: {len(client_pk)} bytes")
print(f"Client public key hex length: {len(client_pk.hex())} chars")
print(f"Client public key (first 100 chars): {client_pk.hex()[:100]}...")

# Test with the server
print("\nTesting with server...")
response = requests.post("http://127.0.0.1:5000/encapsulate", 
                        json={"client_public_key": client_pk.hex()})

print(f"Response status: {response.status_code}")
print(f"Response: {response.text}")

