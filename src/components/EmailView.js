import React from 'react';
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
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { useEmail } from '../context/EmailContext';

const EmailView = ({ email, onBack }) => {
  const { toggleStar, deleteEmail, restoreEmail, permanentDeleteEmail, currentFolder } = useEmail();

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

        <div className="text-dark" style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
          {email.body}
        </div>
      </div>
    </div>
  );
};

export default EmailView;
