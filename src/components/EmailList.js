import React, { useState } from 'react';
import { 
  Star, 
  StarOff, 
  Trash2, 
  Archive, 
  MoreVertical,
  RefreshCw,
  RotateCcw,
  X,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';
import { useEmail } from '../context/EmailContext';

const EmailList = ({ onEmailSelect, selectedEmail }) => {
  const { 
    emails, 
    markAsRead, 
    markAsUnread, 
    toggleStar, 
    deleteEmail,
    restoreEmail,
    permanentDeleteEmail,
    currentFolder
  } = useEmail();
  
  const [selectedEmails, setSelectedEmails] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const handleEmailClick = (email) => {
    console.log('Email clicked:', email);
    onEmailSelect(email);
    if (!email.isRead) {
      markAsRead(email.id);
    }
  };

  const handleStarClick = (e, email) => {
    e.stopPropagation();
    toggleStar(email.id);
  };

  const handleDeleteClick = (e, email) => {
    e.stopPropagation();
    deleteEmail(email.id);
  };

  const handleArchiveClick = (e, email) => {
    e.stopPropagation();
    // Archive functionality would go here
  };

  const handleRestoreClick = (e, email) => {
    e.stopPropagation();
    restoreEmail(email.id);
  };

  const handlePermanentDeleteClick = (e, email) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to permanently delete this email? This action cannot be undone.')) {
      permanentDeleteEmail(email.id);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmails(new Set());
    } else {
      setSelectedEmails(new Set(emails.map(email => email.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleEmailSelect = (emailId) => {
    const newSelected = new Set(selectedEmails);
    if (newSelected.has(emailId)) {
      newSelected.delete(emailId);
    } else {
      newSelected.add(emailId);
    }
    setSelectedEmails(newSelected);
  };

  if (emails.length === 0) {
    return (
      <div className="flex-grow-1 d-flex flex-column bg-white rounded shadow-sm m-3 overflow-hidden">
        <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted text-center">
          <div className="fs-1 mb-3 opacity-50">📧</div>
          <div className="fs-5 mb-2">No emails found</div>
          <div className="text-muted">Try adjusting your search or filters</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow-1 d-flex flex-column bg-white rounded shadow-sm m-3 overflow-hidden">
      {/* Header */}
      <div className="d-flex align-items-center p-3 border-bottom bg-light">
        <input
          type="checkbox"
          className="form-check-input me-3"
          checked={selectAll}
          onChange={handleSelectAll}
        />
        <div className="d-flex align-items-center gap-2 ms-auto">
          <button 
            className="btn btn-link p-2 text-muted"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          <button 
            className="btn btn-link p-2 text-muted"
            title="More"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-grow-1 overflow-auto">
        {emails.map(email => (
          <div
            key={email.id}
            className={`gmail-email-item ${!email.isRead ? 'unread' : ''}`}
            onClick={() => handleEmailClick(email)}
          >
            <input
              type="checkbox"
              className="form-check-input me-3"
              checked={selectedEmails.has(email.id)}
              onChange={() => handleEmailSelect(email.id)}
              onClick={(e) => e.stopPropagation()}
            />
            
            <button
              className={`gmail-star-btn ${email.isStarred ? 'starred' : ''}`}
              onClick={(e) => handleStarClick(e, email)}
            >
              {email.isStarred ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
            </button>

            <div className="flex-grow-1 min-w-0">
              <div className="d-flex align-items-center mb-1">
                <span className={`sender ${!email.isRead ? 'fw-bold' : ''} me-2`} style={{ maxWidth: '200px' }}>
                  {email.from}
                </span>
                <span className={`subject ${!email.isRead ? 'fw-bold' : ''} flex-grow-1`}>
                  {email.subject}
                  {email.isPQCEncrypted && (
                    <Shield size={14} className="text-primary ms-2" title="PQC Encrypted" />
                  )}
                </span>
                <small className="text-muted ms-2">
                  {format(new Date(email.timestamp), 'MMM d')}
                </small>
              </div>
              <div className="text-muted small text-truncate">
                {email.body.substring(0, 100)}...
              </div>
            </div>

            <div className="d-flex align-items-center gap-1 email-actions" style={{ opacity: 0 }}>
              {currentFolder === 'trash' ? (
                <>
                  <button
                    className="btn btn-link p-1 text-success"
                    title="Restore"
                    onClick={(e) => handleRestoreClick(e, email)}
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    className="btn btn-link p-1 text-danger"
                    title="Permanently Delete"
                    onClick={(e) => handlePermanentDeleteClick(e, email)}
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-link p-1 text-muted"
                    title="Archive"
                    onClick={(e) => handleArchiveClick(e, email)}
                  >
                    <Archive size={16} />
                  </button>
                  <button
                    className="btn btn-link p-1 text-muted"
                    title="Delete"
                    onClick={(e) => handleDeleteClick(e, email)}
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailList;
