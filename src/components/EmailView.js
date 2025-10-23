import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  StarOff, 
  Reply, 
  Forward, 
  Trash2, 
  Archive,
  MoreVertical,
  RotateCcw,
  X,
  Key,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';
import { useEmail } from '../context/EmailContext';
import pqcService from '../services/pqcService';

const EmailView = ({ email, onBack }) => {
  const { toggleStar, deleteEmail, restoreEmail, permanentDeleteEmail, currentFolder } = useEmail();
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [decryptedContent, setDecryptedContent] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState('');

  if (!email) {
    return (
      <div className="flex-grow-1 d-flex flex-column bg-white rounded shadow-sm m-3 overflow-hidden">
        <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted text-center">
          <div className="fs-1 mb-3 opacity-50">📧</div>
          <div className="fs-5 mb-2">Select an email to view</div>
          <div className="text-muted">Choose an email from the list to read its contents</div>
        </div>
      </div>
    );
  }

  const handleStarClick = () => {
    toggleStar(email.id);
  };

  const handleDeleteClick = () => {
    deleteEmail(email.id);
    onBack();
  };

  const handleRestoreClick = () => {
    restoreEmail(email.id);
    onBack();
  };

  const handlePermanentDeleteClick = () => {
    if (window.confirm('Are you sure you want to permanently delete this email? This action cannot be undone.')) {
      permanentDeleteEmail(email.id);
      onBack();
    }
  };

  const handleDecryptClick = async () => {
    if (isDecrypted) {
      setIsDecrypted(false);
      setDecryptedContent('');
      return;
    }

    setIsDecrypting(true);
    setDecryptError('');

    try {
      // Check if it's a PQC encrypted email
      if (email.body.includes('🔒 PQC ENCRYPTED MESSAGE 🔒')) {
        const decrypted = await pqcService.decryptEmailContent(email.body);
        setDecryptedContent(decrypted);
        setIsDecrypted(true);
      } else if (email.body.includes('🔒 ENCRYPTED MESSAGE 🔒')) {
        // Handle regular encrypted emails
        const lines = email.body.split('\n');
        let encryptedContent = '';
        let inEncryptedSection = false;
        
        for (const line of lines) {
          if (line.includes('🔒 ENCRYPTED MESSAGE 🔒')) {
            inEncryptedSection = true;
            continue;
          }
          if (line.includes('---') && inEncryptedSection) {
            break;
          }
          if (inEncryptedSection && line.trim()) {
            encryptedContent += line + '\n';
          }
        }
        
        if (encryptedContent.trim()) {
          // Simple decryption for regular encrypted emails (remove encryption markers)
          const decrypted = encryptedContent.trim();
          setDecryptedContent(decrypted);
          setIsDecrypted(true);
        } else {
          throw new Error('No encrypted content found');
        }
      } else {
        // For any other email, just show the original content
        setDecryptedContent(email.body);
        setIsDecrypted(true);
      }
    } catch (error) {
      console.error('Decryption failed:', error);
      setDecryptError('Failed to decrypt email. This email may not be encrypted or the encryption format is not supported.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleReplyClick = () => {
    // Reply functionality would go here
    console.log('Reply to:', email.id);
  };

  const handleForwardClick = () => {
    // Forward functionality would go here
    console.log('Forward:', email.id);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getSenderName = (email) => {
    const name = email.from.split('@')[0];
    return name.split('.').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');
  };

  return (
    <div className="flex-grow-1 d-flex flex-column bg-white rounded shadow-sm m-3 overflow-hidden">
      {/* Header */}
      <div className="d-flex align-items-center p-3 border-bottom bg-light">
        <button 
          className="btn btn-link d-flex align-items-center gap-2 me-3"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          Back
        </button>
        
        <div className="d-flex align-items-center gap-2 ms-auto">
          <button
            className={`btn btn-link p-2 ${email.isStarred ? 'text-warning' : 'text-muted'}`}
            onClick={handleStarClick}
            title={email.isStarred ? 'Remove star' : 'Add star'}
          >
            {email.isStarred ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
          </button>
          
          <button
            className="btn btn-link p-2 text-muted"
            onClick={handleReplyClick}
            title="Reply"
          >
            <Reply size={16} />
          </button>
          
          <button
            className="btn btn-link p-2 text-muted"
            onClick={handleForwardClick}
            title="Forward"
          >
            <Forward size={16} />
          </button>
          
          <button
            className="btn btn-link p-2 text-muted"
            title="Archive"
          >
            <Archive size={16} />
          </button>
          
          {currentFolder === 'trash' ? (
            <>
              <button
                className="btn btn-link p-2 text-success"
                onClick={handleRestoreClick}
                title="Restore"
              >
                <RotateCcw size={16} />
              </button>
              <button
                className="btn btn-link p-2 text-danger"
                onClick={handlePermanentDeleteClick}
                title="Permanently Delete"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <button
              className="btn btn-link p-2 text-muted"
              onClick={handleDeleteClick}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          )}
          
          <button
            className="btn btn-link p-2 text-muted"
            title="More"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow-1 p-4 overflow-auto">
        <div className="mb-4">
          <h1 className="h3 fw-normal text-dark mb-3">{email.subject}</h1>
          
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="d-flex align-items-center gap-3">
              <div 
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px', fontSize: '16px', fontWeight: '500' }}
              >
                {getInitials(getSenderName(email))}
              </div>
              <div>
                <div className="fw-medium text-dark">{getSenderName(email)}</div>
                <small className="text-muted">{email.from}</small>
              </div>
            </div>
            
            <small className="text-muted ms-auto">
              {format(new Date(email.timestamp), 'MMM d, yyyy \'at\' h:mm a')}
            </small>
          </div>
          
          <div className="text-muted small mb-3">
            <strong>To:</strong> {email.to}
          </div>
        </div>

        {/* PQC Encryption Status and Decrypt Button */}
        {(email.isPQCEncrypted || email.body.includes('🔒 PQC ENCRYPTED MESSAGE 🔒')) && (
          <div className="mb-3 p-3 bg-light rounded border">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <Shield className="text-primary" size={20} />
                <span className="fw-medium text-primary">Post-Quantum Encrypted Email</span>
                <span className="badge bg-primary">PQC Secured</span>
              </div>
              <button
                className={`btn btn-sm ${isDecrypted ? 'btn-outline-secondary' : 'btn-primary'}`}
                onClick={handleDecryptClick}
                disabled={isDecrypting}
              >
                {isDecrypting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Decrypting...
                  </>
                ) : isDecrypted ? (
                  <>
                    <Key size={16} className="me-1" />
                    Hide Content
                  </>
                ) : (
                  <>
                    <Key size={16} className="me-1" />
                    Decrypt Email
                  </>
                )}
              </button>
            </div>
            {decryptError && (
              <div className="alert alert-danger mt-2 mb-0" role="alert">
                {decryptError}
              </div>
            )}
          </div>
        )}

        {/* Always show decrypt button for any email with encryption markers */}
        {!email.isPQCEncrypted && !email.body.includes('🔒 PQC ENCRYPTED MESSAGE 🔒') && 
         (email.body.includes('🔒') || email.body.includes('ENCRYPTED') || email.body.includes('PQC')) && (
          <div className="mb-3 p-3 bg-warning bg-opacity-10 rounded border border-warning">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <Shield className="text-warning" size={20} />
                <span className="fw-medium text-warning">Encrypted Email Detected</span>
                <span className="badge bg-warning">Encrypted</span>
              </div>
              <button
                className={`btn btn-sm ${isDecrypted ? 'btn-outline-secondary' : 'btn-warning'}`}
                onClick={handleDecryptClick}
                disabled={isDecrypting}
              >
                {isDecrypting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Decrypting...
                  </>
                ) : isDecrypted ? (
                  <>
                    <Key size={16} className="me-1" />
                    Hide Content
                  </>
                ) : (
                  <>
                    <Key size={16} className="me-1" />
                    Decrypt Email
                  </>
                )}
              </button>
            </div>
            {decryptError && (
              <div className="alert alert-danger mt-2 mb-0" role="alert">
                {decryptError}
              </div>
            )}
          </div>
        )}

        {/* Always visible decrypt button for any email */}
        <div className="mb-3 d-flex justify-content-center">
          <button
            className={`btn ${isDecrypted ? 'btn-outline-secondary' : 'btn-primary'} btn-lg`}
            onClick={handleDecryptClick}
            disabled={isDecrypting}
            style={{ minWidth: '200px' }}
          >
            {isDecrypting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Decrypting...
              </>
            ) : isDecrypted ? (
              <>
                <Key size={18} className="me-2" />
                Hide Decrypted Content
              </>
            ) : (
              <>
                <Key size={18} className="me-2" />
                Decrypt Email Content
              </>
            )}
          </button>
        </div>

        <div className="text-dark" style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
          {isDecrypted && decryptedContent ? decryptedContent : email.body}
        </div>
      </div>
    </div>
  );
};

export default EmailView;
