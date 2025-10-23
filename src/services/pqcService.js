// Post-Quantum Cryptography Service
// Handles communication with Flask backend for PQC operations

const SERVER_URL = "http://127.0.0.1:5000";

class PQCService {
  constructor() {
    this.serverPublicKey = null;
    this.clientKeyPair = null;
    this.sharedSecret = null;
  }

  // Fetch server's public key
  async fetchServerPublicKey() {
    try {
      const response = await fetch(`${SERVER_URL}/get_server_pk`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.serverPublicKey = data.public_key;
      console.log('Server public key fetched:', this.serverPublicKey.substring(0, 50) + '...');
      return this.serverPublicKey;
    } catch (error) {
      console.error('Error fetching server public key:', error);
      throw error;
    }
  }

  // Generate client key pair (simulated - in real implementation, this would use PQC libraries)
  generateClientKeyPair() {
    // In a real implementation, this would use Kyber key generation
    // For now, we'll simulate with random keys
    const privateKey = this.generateRandomKey(32);
    const publicKey = this.generateRandomKey(32);
    
    this.clientKeyPair = {
      privateKey: privateKey,
      publicKey: publicKey
    };
    
    console.log('Client key pair generated');
    return this.clientKeyPair;
  }

  // Encapsulate (Key Encapsulation Mechanism)
  async encapsulate(serverPublicKey) {
    try {
      // In real implementation, this would use Kyber encapsulation
      // For now, we'll simulate the process
      const ciphertext = this.generateRandomKey(64);
      const sharedSecret = this.generateRandomKey(32);
      
      this.sharedSecret = sharedSecret;
      
      console.log('Key encapsulation completed');
      console.log('Ciphertext:', ciphertext);
      console.log('Shared Secret:', sharedSecret);
      
      return {
        ciphertext: ciphertext,
        sharedSecret: sharedSecret
      };
    } catch (error) {
      console.error('Error during encapsulation:', error);
      throw error;
    }
  }

  // Encrypt message using shared secret
  encryptMessage(message, sharedSecret) {
    try {
      // Simple XOR encryption for demonstration
      // In real implementation, this would use AES-GCM with the shared secret
      const messageBytes = new TextEncoder().encode(message);
      const keyBytes = new TextEncoder().encode(sharedSecret);
      
      const encrypted = new Uint8Array(messageBytes.length);
      for (let i = 0; i < messageBytes.length; i++) {
        encrypted[i] = messageBytes[i] ^ keyBytes[i % keyBytes.length];
      }
      
      const encryptedBase64 = btoa(String.fromCharCode(...encrypted));
      
      console.log('Message encrypted with PQC shared secret');
      return encryptedBase64;
    } catch (error) {
      console.error('Error encrypting message:', error);
      throw error;
    }
  }

  // Decrypt message using shared secret
  decryptMessage(encryptedMessage, sharedSecret) {
    try {
      // Simple XOR decryption for demonstration
      const encryptedBytes = new Uint8Array(
        atob(encryptedMessage).split('').map(char => char.charCodeAt(0))
      );
      const keyBytes = new TextEncoder().encode(sharedSecret);
      
      const decrypted = new Uint8Array(encryptedBytes.length);
      for (let i = 0; i < encryptedBytes.length; i++) {
        decrypted[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
      }
      
      const decryptedText = new TextDecoder().decode(decrypted);
      
      console.log('Message decrypted with PQC shared secret');
      return decryptedText;
    } catch (error) {
      console.error('Error decrypting message:', error);
      throw error;
    }
  }

  // Digital signature (simulated Dilithium)
  signMessage(message, privateKey) {
    try {
      // In real implementation, this would use Dilithium signature
      // For now, we'll create a simple hash-based signature
      const messageHash = this.simpleHash(message);
      const signature = this.generateSignature(messageHash, privateKey);
      
      console.log('Message signed with PQC digital signature');
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  }

  // Verify digital signature
  verifySignature(message, signature, publicKey) {
    try {
      // In real implementation, this would use Dilithium verification
      const messageHash = this.simpleHash(message);
      const isValid = this.verifySignatureHash(messageHash, signature, publicKey);
      
      console.log('Digital signature verification:', isValid ? 'VALID' : 'INVALID');
      return isValid;
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }

  // Decrypt PQC encrypted email content
  async decryptEmailContent(encryptedContent) {
    try {
      console.log('🔓 Decrypting PQC encrypted email...');
      
      // Extract the encrypted message from the PQC format
      const lines = encryptedContent.split('\n');
      let encryptedMessage = '';
      let inEncryptedSection = false;
      
      for (const line of lines) {
        if (line.includes('🔒 PQC ENCRYPTED MESSAGE 🔒')) {
          inEncryptedSection = true;
          continue;
        }
        if (line.includes('---') && inEncryptedSection) {
          break;
        }
        if (inEncryptedSection && line.trim()) {
          encryptedMessage += line + '\n';
        }
      }
      
      if (!encryptedMessage.trim()) {
        throw new Error('No encrypted content found');
      }
      
      // Use the stored shared secret for decryption
      if (!this.sharedSecret) {
        throw new Error('No shared secret available for decryption');
      }
      
      const decryptedContent = this.decryptMessage(encryptedMessage.trim(), this.sharedSecret);
      
      console.log('✅ Email content decrypted successfully');
      return decryptedContent;
      
    } catch (error) {
      console.error('❌ Email decryption failed:', error);
      throw new Error('Failed to decrypt email content');
    }
  }

  // Initialize PQC session
  async initializePQCSession() {
    try {
      console.log('🔐 Initializing Post-Quantum Cryptography session...');
      
      // 1. Fetch server's public key
      await this.fetchServerPublicKey();
      
      // 2. Generate client key pair
      this.generateClientKeyPair();
      
      // 3. Perform key encapsulation
      const { ciphertext, sharedSecret } = await this.encapsulate(this.serverPublicKey);
      
      console.log('✅ PQC session initialized successfully');
      console.log('🔑 Shared secret established');
      
      return {
        serverPublicKey: this.serverPublicKey,
        clientKeyPair: this.clientKeyPair,
        ciphertext: ciphertext,
        sharedSecret: sharedSecret
      };
    } catch (error) {
      console.error('❌ Failed to initialize PQC session:', error);
      throw error;
    }
  }

  // Utility functions
  generateRandomKey(length) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  simpleHash(message) {
    // Simple hash function for demonstration
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  generateSignature(hash, privateKey) {
    // Simple signature generation for demonstration
    return hash + privateKey.substring(0, 16);
  }

  verifySignatureHash(hash, signature, publicKey) {
    // Simple signature verification for demonstration
    const expectedSignature = hash + publicKey.substring(0, 16);
    return signature === expectedSignature;
  }
}

// Export singleton instance
export default new PQCService();

