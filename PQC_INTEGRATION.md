# Post-Quantum Cryptography Integration

## Overview

GuardBox now integrates Post-Quantum Cryptography (PQC) to protect against quantum computing threats. The system uses:

- **Kyber512** for Key Encapsulation Mechanism (KEM)
- **Dilithium** for Digital Signatures
- **Flask Backend** for PQC operations

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GuardBox      │    │   Flask Server  │    │   PQC Library   │
│   Frontend      │◄──►│   (Backend)     │◄──►│   (smaj_kyber)  │
│   (React)       │    │   (Python)      │    │   (Python)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Features

### 🔐 Post-Quantum Encryption
- **Kyber512 KEM**: Secure key exchange resistant to quantum attacks
- **Dilithium Signatures**: Digital signatures for message integrity
- **End-to-End Encryption**: Messages encrypted with PQC algorithms

### 🛡️ Security Features
- **Quantum-Resistant**: Protection against future quantum computers
- **Forward Secrecy**: Each message uses unique encryption keys
- **Message Integrity**: Digital signatures prevent tampering
- **Authentication**: Sender identity verification

## Setup Instructions

### 1. Backend Setup (Flask Server)

```bash
# Install Python dependencies
pip install flask smaj-kyber requests

# Run the Flask server
python server.py
```

The server will run on `http://127.0.0.1:5000`

### 2. Frontend Setup (GuardBox)

```bash
# Install dependencies
npm install

# Start the React application
npm start
```

The application will run on `http://localhost:3000`

## Usage

### 1. Enable PQC Encryption

1. **Open Compose**: Click the "Compose" button
2. **Enable PQC**: Click the key icon (🔑) in the toolbar
3. **Wait for Connection**: The system will connect to the Flask server
4. **PQC Ready**: Green indicator shows when PQC is ready

### 2. Send PQC-Encrypted Messages

1. **Write Message**: Type your email content
2. **PQC Encryption**: The message will be encrypted with Kyber512
3. **Digital Signature**: Message will be signed with Dilithium
4. **Send**: Click "Send PQC-Encrypted" button

### 3. Message Format

PQC-encrypted messages include:
```
🔒 PQC ENCRYPTED MESSAGE 🔒

[Encrypted Content]

---
Digital Signature: [Dilithium Signature]
Encrypted with: Kyber512 + Dilithium
Timestamp: [ISO Timestamp]
```

## Technical Implementation

### Frontend (React)

- **PQC Service**: `src/services/pqcService.js`
- **Compose Integration**: PQC buttons and status indicators
- **Status Monitoring**: Real-time PQC connection status

### Backend (Flask)

- **Server Key Generation**: Kyber512 keypair at startup
- **Public Key Endpoint**: `/get_server_pk` for key exchange
- **PQC Operations**: Key encapsulation and decapsulation

### Key Exchange Process

1. **Client Request**: Frontend requests server's public key
2. **Key Generation**: Client generates Kyber512 keypair
3. **Encapsulation**: Client performs key encapsulation
4. **Shared Secret**: Both parties derive shared secret
5. **Message Encryption**: Messages encrypted with shared secret
6. **Digital Signature**: Messages signed with Dilithium

## Security Considerations

### ✅ Implemented
- **Quantum-Resistant Algorithms**: Kyber512 + Dilithium
- **Secure Key Exchange**: PQC-based key encapsulation
- **Message Integrity**: Digital signatures
- **Forward Secrecy**: Unique keys per message

### 🔄 Future Enhancements
- **Perfect Forward Secrecy**: Ephemeral key generation
- **Multi-Recipient Encryption**: Group message encryption
- **Key Rotation**: Automatic key renewal
- **Hardware Security**: HSM integration

## Troubleshooting

### Common Issues

1. **PQC Connection Failed**
   - Ensure Flask server is running on port 5000
   - Check network connectivity
   - Verify smaj-kyber installation

2. **Encryption Errors**
   - Check browser console for errors
   - Verify PQC service initialization
   - Ensure shared secret is established

3. **Performance Issues**
   - PQC operations are computationally intensive
   - Consider using Web Workers for large messages
   - Implement progress indicators for long operations

### Debug Mode

Enable debug logging in the browser console:
```javascript
// Check PQC service status
console.log('PQC Status:', pqcService.sharedSecret ? 'Connected' : 'Disconnected');

// Check server connection
fetch('http://127.0.0.1:5000/get_server_pk')
  .then(response => response.json())
  .then(data => console.log('Server Response:', data));
```

## API Endpoints

### Flask Server Endpoints

- `GET /` - Server status
- `GET /get_server_pk` - Retrieve server's public key

### Request/Response Format

```json
// GET /get_server_pk
{
  "public_key": "hex_encoded_public_key"
}
```

## Dependencies

### Backend
- `flask` - Web framework
- `smaj-kyber` - Post-quantum cryptography library
- `requests` - HTTP client

### Frontend
- `react` - UI framework
- `bootstrap` - CSS framework
- `lucide-react` - Icons

## Security Notes

⚠️ **Important**: This is a demonstration implementation. For production use:

1. **Use Real PQC Libraries**: Replace simulation with actual PQC implementations
2. **Secure Key Storage**: Implement proper key management
3. **Certificate Validation**: Add proper certificate chain validation
4. **Audit Logging**: Implement comprehensive security logging
5. **Penetration Testing**: Conduct thorough security assessments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement PQC enhancements
4. Add tests for security features
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
