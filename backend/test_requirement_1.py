#!/usr/bin/env python3
"""
REQUIREMENT 1 TESTING: PQC KEM (Kyber) for Key Exchange
"""

from smaj_kyber import keygen, encapsulate, decapsulate
import requests
import json

def test_requirement_1():
    print("🔐 TESTING REQUIREMENT 1: PQC KEM (Kyber) for Key Exchange")
    print("=" * 60)
    
    # Test 1: Server connectivity
    print("\n1️⃣ Testing server connectivity...")
    try:
        response = requests.get("http://127.0.0.1:5000/")
        if response.status_code == 200:
            data = response.json()
            print("✅ Server is running")
            print(f"   Message: {data.get('message')}")
        else:
            print(f"❌ Server not responding: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to server: {e}")
        return False
    
    # Test 2: Get server public key
    print("\n2️⃣ Testing server public key generation...")
    try:
        response = requests.get("http://127.0.0.1:5000/get_server_pk")
        if response.status_code == 200:
            data = response.json()
            server_pk_hex = data.get('public_key')
            algorithm = data.get('algorithm')
            
            if server_pk_hex and algorithm == "Kyber512":
                print("✅ Server Kyber512 public key retrieved")
                print(f"   Key length: {len(server_pk_hex)} characters")
                print(f"   Algorithm: {algorithm}")
            else:
                print("❌ Invalid server public key response")
                return False
        else:
            print(f"❌ Failed to get server public key: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error getting server public key: {e}")
        return False
    
    # Test 3: Generate client keypair
    print("\n3️⃣ Testing client keypair generation...")
    try:
        client_pk, client_sk = keygen()
        print("✅ Client Kyber512 keypair generated")
        print(f"   Public key length: {len(client_pk)} bytes")
        print(f"   Private key length: {len(client_sk)} bytes")
        print(f"   Public key (first 50 chars): {client_pk.hex()[:50]}...")
    except Exception as e:
        print(f"❌ Failed to generate client keypair: {e}")
        return False
    
    # Test 4: Test key encapsulation
    print("\n4️⃣ Testing key encapsulation...")
    try:
        response = requests.post("http://127.0.0.1:5000/encapsulate", 
                               json={"client_public_key": client_pk.hex()})
        
        if response.status_code == 200:
            data = response.json()
            ciphertext_hex = data.get('ciphertext')
            shared_secret_hex = data.get('shared_secret')
            algorithm = data.get('algorithm')
            
            if ciphertext_hex and shared_secret_hex and algorithm == "Kyber512":
                print("✅ Key encapsulation successful")
                print(f"   Ciphertext length: {len(ciphertext_hex)} characters")
                print(f"   Shared secret length: {len(shared_secret_hex)} characters")
                print(f"   Algorithm: {algorithm}")
            else:
                print("❌ Invalid encapsulation response")
                return False
        else:
            print(f"❌ Key encapsulation failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error during key encapsulation: {e}")
        return False
    
    # Test 5: Verify shared secret
    print("\n5️⃣ Testing shared secret verification...")
    try:
        # Get the data from previous test
        response = requests.post("http://127.0.0.1:5000/encapsulate", 
                               json={"client_public_key": client_pk.hex()})
        data = response.json()
        ciphertext_hex = data.get('ciphertext')
        shared_secret_hex = data.get('shared_secret')
        
        # Convert to bytes
        ciphertext = bytes.fromhex(ciphertext_hex)
        shared_secret = bytes.fromhex(shared_secret_hex)
        
        # Decapsulate on client side
        decrypted_secret = decapsulate(client_sk, ciphertext)
        
        if decrypted_secret == shared_secret:
            print("✅ Shared secret verification successful")
            print("✅ Client and server have matching shared secrets")
        else:
            print("❌ Shared secret verification failed")
            print("❌ Client and server shared secrets don't match")
            return False
            
    except Exception as e:
        print(f"❌ Error during shared secret verification: {e}")
        return False
    
    # Test 6: Test PQC integration endpoint
    print("\n6️⃣ Testing PQC integration...")
    try:
        response = requests.get("http://127.0.0.1:5000/test_pqc")
        if response.status_code == 200:
            data = response.json()
            kyber_test = data.get('kyber_test', {})
            success = kyber_test.get('success', False)
            
            if success:
                print("✅ PQC integration test passed")
                print("✅ All Kyber512 operations working correctly")
            else:
                print("❌ PQC integration test failed")
                return False
        else:
            print(f"❌ PQC integration test failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error during PQC integration test: {e}")
        return False
    
    # Final result
    print("\n" + "=" * 60)
    print("🎉 REQUIREMENT 1 TEST RESULTS")
    print("=" * 60)
    print("✅ Server connectivity: PASS")
    print("✅ Server key generation: PASS") 
    print("✅ Client key generation: PASS")
    print("✅ Key encapsulation: PASS")
    print("✅ Shared secret verification: PASS")
    print("✅ PQC integration: PASS")
    print("\n🏆 REQUIREMENT 1 SATISFIED!")
    print("✅ PQC KEM (Kyber) for key exchange is working correctly!")
    
    return True

if __name__ == "__main__":
    success = test_requirement_1()
    exit(0 if success else 1)

