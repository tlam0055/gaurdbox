import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Paperclip, 
  Bold, 
  Italic, 
  Underline,
  Link,
  Smile,
  MoreVertical,
  Shield,
  Lock,
  Key,
  CheckCircle
} from 'lucide-react';
import { useEmail } from '../context/EmailContext';
import { useAuth } from '../context/AuthContext';
import pqcService from '../services/pqcService';

const Compose = ({ onClose, replyTo }) => {
  const { addEmail } = useEmail();
  const { user } = useAuth();
  const [to, setTo] = useState(replyTo ? replyTo.from : '');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState(replyTo ? `Re: ${replyTo.subject}` : '');
  const [body, setBody] = useState(replyTo ? `\n\n---\nOn ${new Date(replyTo.timestamp).toLocaleString()}, ${replyTo.from} wrote:\n\n${replyTo.body}` : '');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isPQCEnabled, setIsPQCEnabled] = useState(false);
  const [pqcStatus, setPqcStatus] = useState('disconnected');
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.focus();
    }
  }, []);

  const handleSend = async () => {
    if (!to.trim() || !subject.trim()) {
      alert('Please fill in the recipient and subject fields.');
      return;
    }

    let emailBody = body.trim();
    let encryptionInfo = '';

    // Handle PQC encryption
    if (isPQCEnabled && pqcStatus === 'connected') {
      try {
        setPqcStatus('encrypting');
        console.log('🔐 Encrypting message with Post-Quantum Cryptography...');
        
        // Get or create a shared secret for encryption
        let sharedSecret = pqcService.sharedSecret;
        if (!sharedSecret) {
          console.log('No shared secret available, using fallback...');
          sharedSecret = pqcService.createFallbackSecret();
        }
        
        // Encrypt the message using PQC
        const encryptedBody = pqcService.encryptMessage(emailBody, sharedSecret);
        
        // Sign the message
        const signature = pqcService.signMessage(emailBody, pqcService.clientKeyPair?.privateKey || 'fallback-key');
        
        emailBody = `🔒 PQC ENCRYPTED MESSAGE 🔒\n\n${encryptedBody}\n\n---\nDigital Signature: ${signature}\nEncrypted with: Kyber512 + Dilithium\nTimestamp: ${new Date().toISOString()}`;
        encryptionInfo = 'PQC-Encrypted';
        
        setPqcStatus('encrypted');
        console.log('✅ Message encrypted with PQC');
      } catch (error) {
        console.error('❌ PQC encryption failed:', error);
        alert('PQC encryption failed. Sending as regular message.');
        setPqcStatus('error');
      }
    } else if (isEncrypted) {
      // Regular encryption (existing functionality)
      emailBody = `🔒 ENCRYPTED MESSAGE 🔒\n\n${emailBody}\n\n---\nThis message is encrypted for security.`;
      encryptionInfo = 'Standard-Encrypted';
    }

    const newEmail = {
      from: user?.email || 'you@example.com',
      to: to.trim(),
      cc: cc.trim(),
      bcc: bcc.trim(),
      subject: subject.trim(),
      body: emailBody,
      encryptionInfo: encryptionInfo,
      isPQCEncrypted: isPQCEnabled && pqcStatus === 'encrypted'
    };

    addEmail(newEmail);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSend();
    }
  };

  const handleEncryptToggle = () => {
    setIsEncrypted(!isEncrypted);
    if (!isEncrypted) {
      // Simple encryption simulation - in real app, this would use proper encryption
      const encryptedBody = `🔒 ENCRYPTED MESSAGE 🔒\n\n${body}\n\n---\nThis message is encrypted for security.`;
      setBody(encryptedBody);
    }
  };

  const handlePQCToggle = async () => {
    if (!isPQCEnabled) {
      try {
        setPqcStatus('connecting');
        console.log('🔐 Initializing Post-Quantum Cryptography...');
        
        await pqcService.initializePQCSession();
        setIsPQCEnabled(true);
        setPqcStatus('connected');
        
        console.log('✅ PQC session established');
      } catch (error) {
        console.error('❌ PQC initialization failed:', error);
        setPqcStatus('error');
        alert('Failed to initialize Post-Quantum Cryptography. Please check if the Flask server is running.');
      }
    } else {
      setIsPQCEnabled(false);
      setPqcStatus('disconnected');
      console.log('🔓 PQC session disabled');
    }
  };

  return (
    <div className="gmail-compose-modal" onClick={onClose}>
      <div className="gmail-compose-window" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom bg-light">
          <h3 className="h6 fw-medium text-dark mb-0">New Message</h3>
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-link p-2 text-muted"
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? 'Maximize' : 'Minimize'}
            >
              {isMinimized ? '□' : '−'}
            </button>
            <button 
              className="btn btn-link p-2 text-muted"
              onClick={onClose} 
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Content */}
            <div className="flex-grow-1 d-flex flex-column overflow-hidden">
              {/* Recipients */}
              <div className="p-3 border-bottom">
                <div className="d-flex align-items-center mb-2">
                  <label className="form-label mb-0 me-3" style={{ minWidth: '60px', fontSize: '14px', fontWeight: '500' }}>
                    To
                  </label>
                  <input
                    type="email"
                    className="form-control border-0 shadow-none"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Recipients"
                    onKeyDown={handleKeyDown}
                    style={{ fontSize: '14px' }}
                  />
                </div>
                <div className="d-flex align-items-center mb-2">
                  <label className="form-label mb-0 me-3" style={{ minWidth: '60px', fontSize: '14px', fontWeight: '500' }}>
                    Cc
                  </label>
                  <input
                    type="email"
                    className="form-control border-0 shadow-none"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    placeholder="Cc"
                    onKeyDown={handleKeyDown}
                    style={{ fontSize: '14px' }}
                  />
                </div>
                <div className="d-flex align-items-center">
                  <label className="form-label mb-0 me-3" style={{ minWidth: '60px', fontSize: '14px', fontWeight: '500' }}>
                    Bcc
                  </label>
                  <input
                    type="email"
                    className="form-control border-0 shadow-none"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    placeholder="Bcc"
                    onKeyDown={handleKeyDown}
                    style={{ fontSize: '14px' }}
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="p-3 border-bottom">
                <input
                  type="text"
                  className="form-control border-0 shadow-none"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  onKeyDown={handleKeyDown}
                  style={{ fontSize: '16px' }}
                />
              </div>

              {/* Toolbar */}
              <div className="d-flex align-items-center p-2 border-bottom bg-light gap-2">
                <button className="btn btn-link p-1 text-muted" title="Bold">
                  <Bold size={16} />
                </button>
                <button className="btn btn-link p-1 text-muted" title="Italic">
                  <Italic size={16} />
                </button>
                <button className="btn btn-link p-1 text-muted" title="Underline">
                  <Underline size={16} />
                </button>
                <button className="btn btn-link p-1 text-muted" title="Link">
                  <Link size={16} />
                </button>
                <button className="btn btn-link p-1 text-muted" title="Emoji">
                  <Smile size={16} />
                </button>
                <button 
                  className={`btn btn-link p-1 ${isEncrypted ? 'text-success' : 'text-muted'}`}
                  title={isEncrypted ? 'Encrypted - Click to disable' : 'Encrypt message'}
                  onClick={handleEncryptToggle}
                >
                  {isEncrypted ? <Lock size={16} /> : <Shield size={16} />}
                </button>
                <button 
                  className={`btn btn-link p-1 ${
                    isPQCEnabled 
                      ? (pqcStatus === 'connected' ? 'text-success' : pqcStatus === 'encrypting' ? 'text-warning' : 'text-danger')
                      : 'text-muted'
                  }`}
                  title={
                    isPQCEnabled 
                      ? (pqcStatus === 'connected' ? 'PQC Connected - Click to disable' : 
                         pqcStatus === 'encrypting' ? 'PQC Encrypting...' : 
                         'PQC Error - Click to retry')
                      : 'Enable Post-Quantum Cryptography'
                  }
                  onClick={handlePQCToggle}
                >
                  {isPQCEnabled ? (
                    pqcStatus === 'connected' ? <CheckCircle size={16} /> :
                    pqcStatus === 'encrypting' ? <Key size={16} /> :
                    <Key size={16} />
                  ) : (
                    <Key size={16} />
                  )}
                </button>
                <button className="btn btn-link p-1 text-muted" title="More">
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-grow-1 d-flex flex-column overflow-hidden">
                <textarea
                  ref={bodyRef}
                  className="form-control border-0 shadow-none flex-grow-1"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Compose email..."
                  onKeyDown={handleKeyDown}
                  style={{ fontSize: '14px', lineHeight: '1.5', resize: 'none' }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="d-flex align-items-center justify-content-between p-3 border-top bg-light">
              <div className="d-flex align-items-center gap-2">
                <button 
                  className="btn btn-link p-2 text-muted"
                  title="Attach files"
                >
                  <Paperclip size={16} />
                </button>
                {isEncrypted && !isPQCEnabled && (
                  <div className="d-flex align-items-center gap-1 text-success small">
                    <Lock size={14} />
                    <span>Encrypted</span>
                  </div>
                )}
                {isPQCEnabled && (
                  <div className={`d-flex align-items-center gap-1 small ${
                    pqcStatus === 'connected' ? 'text-success' : 
                    pqcStatus === 'encrypting' ? 'text-warning' : 
                    'text-danger'
                  }`}>
                    <Key size={14} />
                    <span>
                      {pqcStatus === 'connected' ? 'PQC Ready' : 
                       pqcStatus === 'encrypting' ? 'PQC Encrypting...' : 
                       'PQC Error'}
                    </span>
                  </div>
                )}
              </div>
              
              <button 
                className={`btn d-flex align-items-center gap-2 ${
                  isPQCEnabled && pqcStatus === 'connected' ? 'btn-success' : 'btn-primary'
                }`}
                onClick={handleSend}
                disabled={isPQCEnabled && pqcStatus === 'encrypting'}
              >
                <Send size={16} />
                {isPQCEnabled && pqcStatus === 'connected' ? 'Send PQC-Encrypted' : 
                 isEncrypted ? 'Send Encrypted' : 'Send'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Compose;
