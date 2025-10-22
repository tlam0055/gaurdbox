#!/usr/bin/env python3
from smaj_kyber import keygen, encapsulate, decapsulate
import requests

print("🔐 TESTING REQUIREMENT 1: PQC KEM (Kyber) for Key Exchange")
print("=" * 60)

# Generate client keypair
print("🔑 Generating client Kyber512 keypair...")
client_pk, client_sk = keygen()
print(f"✅ Client public key generated: {len(client_pk)} bytes")
print(f"✅ Client private key generated: {len(client_sk)} bytes")
print(f"Client public key (first 50 chars): {client_pk.hex()[:50]}...")

# Test key encapsulation with server
print("\n🔐 Testing key encapsulation with server...")
response = requests.post("http://127.0.0.1:5000/encapsulate", 
                        json={"client_public_key": client_pk.hex()})

if response.status_code == 200:
    data = response.json()
    ciphertext_hex = data.get('ciphertext')
    shared_secret_hex = data.get('shared_secret')
    
    print(f"✅ Server encapsulation successful")
    print(f"✅ Ciphertext length: {len(ciphertext_hex)} chars")
    print(f"✅ Shared secret length: {len(shared_secret_hex)} chars")
    
    # Verify shared secret
    ciphertext = bytes.fromhex(ciphertext_hex)
    decrypted_secret = decapsulate(client_sk, ciphertext)
    shared_secret = bytes.fromhex(shared_secret_hex)
    
    if decrypted_secret == shared_secret:
        print("✅ Shared secret verification: SUCCESS")
        print("✅ Kyber512 KEM working correctly!")
        print("\n🎉 REQUIREMENT 1 SATISFIED!")
    else:
        print("❌ Shared secret verification: FAILED")
        print("❌ Kyber512 KEM not working correctly!")
else:
    print(f"❌ Server encapsulation failed: {response.status_code}")
    print(f"Error: {response.text}")
