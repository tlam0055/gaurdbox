#!/usr/bin/env python3
"""
Working Test Suite for Post-Quantum Cryptography Requirements
"""

import requests
import json
from smaj_kyber import keygen, encapsulate, decapsulate

BASE_URL = "http://127.0.0.1:5000"

def test_kyber_kem():
    """Test Kyber KEM functionality"""
    print("🧪 Testing Kyber KEM...")
    
    try:
        # Generate client keypair
        client_pk, client_sk = keygen()
        
        # Test encapsulation
        response = requests.post(f"{BASE_URL}/encapsulate", 
                               json={"client_public_key": client_pk.hex()})
        
        if response.status_code == 200:
            data = response.json()
            ciphertext_hex = data.get('ciphertext')
            shared_secret_hex = data.get('shared_secret')
            
            # Verify shared secret
            ciphertext = bytes.fromhex(ciphertext_hex)
            decrypted_secret = decapsulate(client_sk, ciphertext)
            shared_secret = bytes.fromhex(shared_secret_hex)
            
            if decrypted_secret == shared_secret:
                print("✅ Kyber KEM working correctly")
                return True
            else:
                print("❌ Shared secrets don't match")
                return False
        else:
            print(f"❌ Encapsulation failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Kyber KEM test failed: {str(e)}")
        return False

def test_digital_signatures():
    """Test digital signatures"""
    print("🧪 Testing Digital Signatures...")
    
    try:
        # Get server signature public key
        response = requests.get(f"{BASE_URL}/get_server_signature_pk")
        if response.status_code != 200:
            print(f"❌ Failed to get signature public key: {response.status_code}")
            return False
            
        sig_data = response.json()
        server_sig_pk = sig_data.get('public_key')
        
        # Sign a message
        test_message = "Test message for signature"
        response = requests.post(f"{BASE_URL}/sign", 
                               json={"message": test_message})
        
        if response.status_code != 200:
            print(f"❌ Failed to sign message: {response.status_code}")
            return False
            
        sign_data = response.json()
        signature = sign_data.get('signature')
        
        # Verify signature
        response = requests.post(f"{BASE_URL}/verify", 
                               json={
                                   "message": test_message,
                                   "signature": signature,
                                   "public_key": server_sig_pk
                               })
        
        if response.status_code == 200:
            verify_data = response.json()
            is_valid = verify_data.get('valid')
            if is_valid:
                print("✅ Digital signatures working correctly")
                return True
            else:
                print("❌ Signature verification failed")
                return False
        else:
            print(f"❌ Signature verification failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Digital signatures test failed: {str(e)}")
        return False

def test_user_authentication():
    """Test user authentication and key storage"""
    print("🧪 Testing User Authentication...")
    
    try:
        # Register a test user
        response = requests.post(f"{BASE_URL}/register", 
                               json={
                                   "username": "testuser",
                                   "password": "testpass123"
                               })
        
        if response.status_code != 200:
            print(f"❌ User registration failed: {response.status_code}")
            return False
            
        # Login user
        response = requests.post(f"{BASE_URL}/login", 
                               json={
                                   "username": "testuser",
                                   "password": "testpass123"
                               })
        
        if response.status_code == 200:
            login_data = response.json()
            token = login_data.get('token')
            if token:
                print("✅ User authentication working correctly")
                return True
            else:
                print("❌ No token returned")
                return False
        else:
            print(f"❌ User login failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ User authentication test failed: {str(e)}")
        return False

def test_pqc_integration():
    """Test overall PQC integration"""
    print("🧪 Testing PQC Integration...")
    
    try:
        response = requests.get(f"{BASE_URL}/test_pqc")
        if response.status_code == 200:
            data = response.json()
            kyber_success = data.get('kyber_test', {}).get('success', False)
            signature_success = data.get('signature_test', {}).get('success', False)
            
            if kyber_success and signature_success:
                print("✅ PQC integration working correctly")
                return True
            else:
                print(f"❌ PQC integration failed: Kyber={kyber_success}, Signature={signature_success}")
                return False
        else:
            print(f"❌ PQC integration test failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ PQC integration test failed: {str(e)}")
        return False

def main():
    print("🔐 POST-QUANTUM CRYPTOGRAPHY TESTING")
    print("=" * 50)
    
    tests = [
        ("Kyber KEM", test_kyber_kem),
        ("Digital Signatures", test_digital_signatures),
        ("User Authentication", test_user_authentication),
        ("PQC Integration", test_pqc_integration)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n{test_name}:")
        if test_func():
            passed += 1
    
    print(f"\n{'='*50}")
    print(f"📊 RESULTS: {passed}/{total} tests passed")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    if passed == total:
        print("🎉 ALL REQUIREMENTS SATISFIED!")
    else:
        print(f"⚠️  {total - passed} requirements not satisfied")

if __name__ == "__main__":
    main()
