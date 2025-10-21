import React from 'react';
import { 
  Inbox, 
  Star, 
  Send, 
  Trash2, 
  AlertCircle, 
  Plus,
  Search
} from 'lucide-react';
import { useEmail } from '../context/EmailContext';

const Sidebar = ({ onCompose }) => {
  const { currentFolder, setCurrentFolder, emails, searchQuery, setSearchQuery } = useEmail();

  const navItems = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, count: emails.filter(e => !e.isRead).length },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'important', label: 'Important', icon: AlertCircle },
    { id: 'sent', label: 'Sent', icon: Send },
    { id: 'trash', label: 'Trash', icon: Trash2 }
  ];

  return (
    <div className="d-flex flex-column h-100">
      <button 
        className="gmail-compose-btn d-flex align-items-center"
        onClick={onCompose}
      >
        <Plus size={20} />
        <span className="ms-2">Compose</span>
      </button>
      
      <div className="position-relative mx-3 mb-3">
        <Search 
          size={16} 
          className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
        />
        <input
          type="text"
          className="form-control ps-5"
          placeholder="Search mail"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ borderRadius: '24px' }}
        />
      </div>

      <nav className="flex-grow-1 py-2">
        {navItems.map(item => (
          <div
            key={item.id}
            className={`gmail-nav-item ${currentFolder === item.id ? 'active' : ''}`}
            onClick={() => setCurrentFolder(item.id)}
          >
            <div className="me-3 d-flex align-items-center" style={{ width: '20px', height: '20px' }}>
              <item.icon size={20} />
            </div>
            <span className="flex-grow-1">{item.label}</span>
            {item.count > 0 && (
              <span 
                className="badge bg-primary rounded-pill"
                style={{ minWidth: '20px', fontSize: '12px' }}
              >
                {item.count}
              </span>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
