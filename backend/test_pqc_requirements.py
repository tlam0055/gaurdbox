#!/usr/bin/env python3
"""
Comprehensive Testing Suite for Post-Quantum Cryptography Requirements
Tests all three requirements:
1. PQC KEM (Kyber) for key exchange
2. Digital signatures for message integrity  
3. Secure user authentication and key storage
"""

import requests
import json
import time
import hashlib
import hmac
from smaj_kyber import keygen, encapsulate, decapsulate

# Test configuration
BASE_URL = "http://127.0.0.1:5000"
TEST_USER = "testuser"
TEST_PASSWORD = "testpass123"

class PQCRequirementTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.test_results = {}
        
    def print_test_header(self, test_name):
        print(f"\n{'='*60}")
        print(f"🧪 TESTING: {test_name}")
        print(f"{'='*60}")
        
    def print_result(self, test_name, success, details=""):
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        self.test_results[test_name] = success
        
    def test_server_connectivity(self):
        """Test if the server is running and accessible"""
        self.print_test_header("Server Connectivity")
        
        try:
            response = self.session.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                self.print_result("Server Running", True, f"Message: {data.get('message')}")
                return True
            else:
                self.print_result("Server Running", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.print_result("Server Running", False, f"Error: {str(e)}")
            return False
    
    def test_requirement_1_kyber_kem(self):
        """Test Requirement 1: PQC KEM (Kyber) for key exchange"""
        self.print_test_header("Requirement 1: PQC KEM (Kyber) Key Exchange")
        
        try:
            # Test 1.1: Get server public key
            response = self.session.get(f"{self.base_url}/get_server_pk")
            if response.status_code != 200:
                self.print_result("Get Server Public Key", False, f"Status: {response.status_code}")
                return False
                
            server_data = response.json()
            server_pk_hex = server_data.get('public_key')
            if not server_pk_hex:
                self.print_result("Get Server Public Key", False, "No public key returned")
                return False
                
            self.print_result("Get Server Public Key", True, f"Key length: {len(server_pk_hex)} chars")
            
            # Test 1.2: Generate client keypair
            client_pk, client_sk = keygen()
            self.print_result("Generate Client Keypair", True, f"Key length: {len(client_pk)} bytes")
            
            # Test 1.3: Perform key encapsulation
            response = self.session.post(f"{self.base_url}/encapsulate", 
                                       json={"client_public_key": client_pk.hex()})
            if response.status_code != 200:
                self.print_result("Key Encapsulation", False, f"Status: {response.status_code}")
                return False
                
            encaps_data = response.json()
            ciphertext_hex = encaps_data.get('ciphertext')
            shared_secret_hex = encaps_data.get('shared_secret')
            
            if not ciphertext_hex or not shared_secret_hex:
                self.print_result("Key Encapsulation", False, "Missing ciphertext or shared secret")
                return False
                
            self.print_result("Key Encapsulation", True, f"Shared secret length: {len(shared_secret_hex)} chars")
            
            # Test 1.4: Verify shared secret consistency
            try:
                ciphertext = bytes.fromhex(ciphertext_hex)
                decrypted_secret = decapsulate(client_sk, ciphertext)
                shared_secret = bytes.fromhex(shared_secret_hex)
                
                if decrypted_secret == shared_secret:
                    self.print_result("Shared Secret Verification", True, "Secrets match")
                else:
                    self.print_result("Shared Secret Verification", False, "Secrets don't match")
                    return False
                    
            except Exception as e:
                self.print_result("Shared Secret Verification", False, f"Error: {str(e)}")
                return False
                
            return True
            
        except Exception as e:
            self.print_result("Kyber KEM Test", False, f"Error: {str(e)}")
            return False
    
    def test_requirement_2_digital_signatures(self):
        """Test Requirement 2: Digital signatures for message integrity"""
        self.print_test_header("Requirement 2: Digital Signatures for Message Integrity")
        
        try:
            # Test 2.1: Get server signature public key
            response = self.session.get(f"{self.base_url}/get_server_signature_pk")
            if response.status_code != 200:
                self.print_result("Get Server Signature Public Key", False, f"Status: {response.status_code}")
                return False
                
            sig_data = response.json()
            server_sig_pk = sig_data.get('public_key')
            if not server_sig_pk:
                self.print_result("Get Server Signature Public Key", False, "No signature public key returned")
                return False
                
            self.print_result("Get Server Signature Public Key", True, f"Key length: {len(server_sig_pk)} chars")
            
            # Test 2.2: Sign a message
            test_message = "Post-Quantum Cryptography Test Message"
            response = self.session.post(f"{self.base_url}/sign", 
                                       json={"message": test_message})
            if response.status_code != 200:
                self.print_result("Message Signing", False, f"Status: {response.status_code}")
                return False
                
            sign_data = response.json()
            signature = sign_data.get('signature')
            if not signature:
                self.print_result("Message Signing", False, "No signature returned")
                return False
                
            self.print_result("Message Signing", True, f"Signature length: {len(signature)} chars")
            
            # Test 2.3: Verify signature
            response = self.session.post(f"{self.base_url}/verify", 
                                       json={
                                           "message": test_message,
                                           "signature": signature,
                                           "public_key": server_sig_pk
                                       })
            if response.status_code != 200:
                self.print_result("Signature Verification", False, f"Status: {response.status_code}")
                return False
                
            verify_data = response.json()
            is_valid = verify_data.get('valid')
            if is_valid:
                self.print_result("Signature Verification", True, "Signature is valid")
            else:
                self.print_result("Signature Verification", False, "Signature is invalid")
                return False
                
            # Test 2.4: Test signature tampering detection
            tampered_message = "Tampered Message"
            response = self.session.post(f"{self.base_url}/verify", 
                                       json={
                                           "message": tampered_message,
                                           "signature": signature,
                                           "public_key": server_sig_pk
                                       })
            if response.status_code == 200:
                verify_data = response.json()
                is_valid = verify_data.get('valid')
                if not is_valid:
                    self.print_result("Tamper Detection", True, "Correctly detected tampered message")
                else:
                    self.print_result("Tamper Detection", False, "Failed to detect tampering")
                    return False
            else:
                self.print_result("Tamper Detection", False, f"Status: {response.status_code}")
                return False
                
            return True
            
        except Exception as e:
            self.print_result("Digital Signatures Test", False, f"Error: {str(e)}")
            return False
    
    def test_requirement_3_user_auth_and_key_storage(self):
        """Test Requirement 3: Secure user authentication and key storage"""
        self.print_test_header("Requirement 3: User Authentication and Key Storage")
        
        try:
            # Test 3.1: Register a new user
            response = self.session.post(f"{self.base_url}/register", 
                                       json={
                                           "username": TEST_USER,
                                           "password": TEST_PASSWORD
                                       })
            if response.status_code != 200:
                self.print_result("User Registration", False, f"Status: {response.status_code}")
                return False
                
            reg_data = response.json()
            user_kyber_pk = reg_data.get('user_kyber_pk')
            user_signature_pk = reg_data.get('user_signature_pk')
            
            if not user_kyber_pk or not user_signature_pk:
                self.print_result("User Registration", False, "Missing user keys")
                return False
                
            self.print_result("User Registration", True, f"User keys generated: Kyber={len(user_kyber_pk)}, Signature={len(user_signature_pk)}")
            
            # Test 3.2: User login
            response = self.session.post(f"{self.base_url}/login", 
                                       json={
                                           "username": TEST_USER,
                                           "password": TEST_PASSWORD
                                       })
            if response.status_code != 200:
                self.print_result("User Login", False, f"Status: {response.status_code}")
                return False
                
            login_data = response.json()
            token = login_data.get('token')
            returned_kyber_pk = login_data.get('user_kyber_pk')
            returned_signature_pk = login_data.get('user_signature_pk')
            
            if not token or not returned_kyber_pk or not returned_signature_pk:
                self.print_result("User Login", False, "Missing authentication data")
                return False
                
            self.print_result("User Login", True, f"JWT token generated, keys returned")
            
            # Test 3.3: Verify key consistency
            if (returned_kyber_pk == user_kyber_pk and 
                returned_signature_pk == user_signature_pk):
                self.print_result("Key Storage Consistency", True, "Stored keys match returned keys")
            else:
                self.print_result("Key Storage Consistency", False, "Stored keys don't match")
                return False
                
            # Test 3.4: Test authentication failure
            response = self.session.post(f"{self.base_url}/login", 
                                       json={
                                           "username": TEST_USER,
                                           "password": "wrongpassword"
                                       })
            if response.status_code == 401:
                self.print_result("Authentication Security", True, "Correctly rejected wrong password")
            else:
                self.print_result("Authentication Security", False, f"Status: {response.status_code}")
                return False
                
            # Test 3.5: Test duplicate registration
            response = self.session.post(f"{self.base_url}/register", 
                                       json={
                                           "username": TEST_USER,
                                           "password": "anotherpassword"
                                       })
            if response.status_code == 400:
                self.print_result("Duplicate Registration Prevention", True, "Correctly prevented duplicate registration")
            else:
                self.print_result("Duplicate Registration Prevention", False, f"Status: {response.status_code}")
                return False
                
            return True
            
        except Exception as e:
            self.print_result("User Authentication Test", False, f"Error: {str(e)}")
            return False
    
    def test_pqc_integration(self):
        """Test overall PQC integration"""
        self.print_test_header("PQC Integration Test")
        
        try:
            response = self.session.get(f"{self.base_url}/test_pqc")
            if response.status_code != 200:
                self.print_result("PQC Integration", False, f"Status: {response.status_code}")
                return False
                
            test_data = response.json()
            kyber_test = test_data.get('kyber_test', {})
            signature_test = test_data.get('signature_test', {})
            
            kyber_success = kyber_test.get('success', False)
            signature_success = signature_test.get('success', False)
            
            if kyber_success and signature_success:
                self.print_result("PQC Integration", True, "All PQC components working")
                return True
            else:
                self.print_result("PQC Integration", False, f"Kyber: {kyber_success}, Signature: {signature_success}")
                return False
                
        except Exception as e:
            self.print_result("PQC Integration", False, f"Error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all PQC requirement tests"""
        print("🔐 POST-QUANTUM CRYPTOGRAPHY REQUIREMENTS TESTING SUITE")
        print("=" * 60)
        print("Testing all three requirements:")
        print("1. PQC KEM (Kyber) for key exchange")
        print("2. Digital signatures for message integrity")
        print("3. Secure user authentication and key storage")
        print("=" * 60)
        
        # Run all tests
        tests = [
            ("Server Connectivity", self.test_server_connectivity),
            ("Requirement 1: PQC KEM", self.test_requirement_1_kyber_kem),
            ("Requirement 2: Digital Signatures", self.test_requirement_2_digital_signatures),
            ("Requirement 3: User Auth & Key Storage", self.test_requirement_3_user_auth_and_key_storage),
            ("PQC Integration", self.test_pqc_integration)
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            try:
                if test_func():
                    passed += 1
            except Exception as e:
                print(f"❌ FAIL {test_name}: Exception - {str(e)}")
        
        # Print summary
        print(f"\n{'='*60}")
        print(f"📊 TEST SUMMARY")
        print(f"{'='*60}")
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if passed == total:
            print("\n🎉 ALL REQUIREMENTS SATISFIED!")
            print("✅ PQC KEM (Kyber) implementation working")
            print("✅ Digital signatures implementation working") 
            print("✅ User authentication and key storage working")
        else:
            print(f"\n⚠️  {total - passed} REQUIREMENTS NOT SATISFIED")
            print("Please check the failed tests above for details.")
        
        return passed == total

if __name__ == "__main__":
    tester = PQCRequirementTester()
    success = tester.run_all_tests()
    exit(0 if success else 1)
