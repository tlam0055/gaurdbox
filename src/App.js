import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import EmailList from './components/EmailList';
import EmailView from './components/EmailView';
import Compose from './components/Compose';
import PQCStatus from './components/PQCStatus';
import { EmailProvider } from './context/EmailContext';

function App() {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleEmailSelect = (email) => {
    console.log('Email selected:', email);
    setSelectedEmail(email);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleCompose = () => {
    setShowCompose(true);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <EmailProvider>
      <div className="d-flex flex-column" style={{ height: '100vh', backgroundColor: '#f5f5f5' }}>
          {/* Desktop Header */}
          {!isMobile && (
            <div className="bg-white border-bottom shadow-sm">
              <div className="d-flex align-items-center justify-content-between px-3 py-2">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-primary text-white rounded d-flex align-items-center justify-content-center" 
                         style={{ width: '32px', height: '32px', fontSize: '14px', fontWeight: '600' }}>
                      GB
                    </div>
                    <div>
                      <h1 className="h5 fw-bold text-dark mb-0">GuardBox</h1>
                      <small className="text-muted">Secure Email</small>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <PQCStatus />
                  <button 
                    className="btn btn-primary btn-sm rounded-pill px-3"
                    onClick={handleCompose}
                  >
                    ✏️ Compose
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Header */}
          {isMobile && (
            <div className="gmail-mobile-header">
              <button 
                className="btn btn-link text-white p-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                ☰
              </button>
              <div className="d-flex align-items-center gap-2">
                <div className="bg-white text-primary rounded d-flex align-items-center justify-content-center" 
                     style={{ width: '24px', height: '24px', fontSize: '12px', fontWeight: '600' }}>
                  GB
                </div>
                <h1 className="fs-5 fw-bold mb-0">GuardBox</h1>
              </div>
              <button 
                className="btn btn-outline-light btn-sm rounded-pill px-3"
                onClick={handleCompose}
              >
                ✏️ Compose
              </button>
            </div>
          )}

          {/* Overlay for mobile */}
          {isMobile && sidebarOpen && (
            <div 
              className="gmail-overlay"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content Area */}
          <div className="flex-grow-1 d-flex overflow-hidden">
            {/* Sidebar */}
            <div className={`gmail-sidebar ${isMobile ? (sidebarOpen ? 'open' : '') : ''}`}>
              <Sidebar onCompose={handleCompose} />
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 d-flex flex-column overflow-hidden">
              {selectedEmail ? (
                <EmailView 
                  email={selectedEmail}
                  onBack={() => setSelectedEmail(null)}
                />
              ) : (
                <EmailList 
                  onEmailSelect={handleEmailSelect}
                  selectedEmail={selectedEmail}
                />
              )}
            </div>
          </div>
          
          {/* Compose Modal */}
          {showCompose && (
            <Compose 
              onClose={() => setShowCompose(false)}
              replyTo={selectedEmail}
            />
          )}
        </div>
    </EmailProvider>
  );
}

export default App;
