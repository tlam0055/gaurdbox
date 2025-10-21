import React, { createContext, useContext, useState, useReducer } from 'react';
import { format } from 'date-fns';

// Mock email data
const mockEmails = [
  {
    id: 1,
    from: 'john.doe@example.com',
    to: 'you@example.com',
    subject: 'Meeting Tomorrow',
    body: 'Hi there! Just wanted to confirm our meeting tomorrow at 2 PM. Please let me know if you need to reschedule.',
    timestamp: new Date('2024-01-15T10:30:00'),
    isRead: false,
    isStarred: false,
    isImportant: true,
    isDeleted: false,
    deletedAt: null,
    labels: ['work']
  },
  {
    id: 2,
    from: 'sarah.wilson@company.com',
    to: 'you@example.com',
    subject: 'Project Update',
    body: 'The project is progressing well. We have completed 75% of the tasks and are on track to meet the deadline.',
    timestamp: new Date('2024-01-15T09:15:00'),
    isRead: true,
    isStarred: true,
    isImportant: false,
    isDeleted: false,
    deletedAt: null,
    labels: ['work', 'project']
  },
  {
    id: 3,
    from: 'newsletter@techcrunch.com',
    to: 'you@example.com',
    subject: 'Weekly Tech News',
    body: 'This week in tech: AI breakthroughs, new startup funding, and the latest in cryptocurrency.',
    timestamp: new Date('2024-01-14T16:45:00'),
    isRead: false,
    isStarred: false,
    isImportant: false,
    isDeleted: false,
    deletedAt: null,
    labels: ['newsletters']
  },
  {
    id: 4,
    from: 'mom@family.com',
    to: 'you@example.com',
    subject: 'Family Dinner',
    body: 'Don\'t forget about dinner this Sunday! Grandma is making her famous lasagna.',
    timestamp: new Date('2024-01-14T14:20:00'),
    isRead: true,
    isStarred: false,
    isImportant: false,
    isDeleted: false,
    deletedAt: null,
    labels: ['family']
  },
  {
    id: 5,
    from: 'support@github.com',
    to: 'you@example.com',
    subject: 'Security Alert',
    body: 'We detected a new login to your GitHub account from an unrecognized device.',
    timestamp: new Date('2024-01-13T11:30:00'),
    isRead: false,
    isStarred: false,
    isImportant: true,
    isDeleted: false,
    deletedAt: null,
    labels: ['security']
  }
];

const EmailContext = createContext();

const emailReducer = (state, action) => {
  switch (action.type) {
    case 'MARK_AS_READ':
      return state.map(email => 
        email.id === action.id ? { ...email, isRead: true } : email
      );
    case 'MARK_AS_UNREAD':
      return state.map(email => 
        email.id === action.id ? { ...email, isRead: false } : email
      );
    case 'TOGGLE_STAR':
      return state.map(email => 
        email.id === action.id ? { ...email, isStarred: !email.isStarred } : email
      );
    case 'DELETE_EMAIL':
      return state.map(email => 
        email.id === action.id ? { ...email, isDeleted: true, deletedAt: new Date() } : email
      );
    case 'RESTORE_EMAIL':
      return state.map(email => 
        email.id === action.id ? { ...email, isDeleted: false, deletedAt: null } : email
      );
    case 'PERMANENT_DELETE':
      return state.filter(email => email.id !== action.id);
    case 'ADD_EMAIL':
      return [...state, action.email];
    case 'SET_EMAILS':
      return action.emails;
    default:
      return state;
  }
};

export const EmailProvider = ({ children }) => {
  const [emails, dispatch] = useReducer(emailReducer, mockEmails);
  const [currentFolder, setCurrentFolder] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');

  const markAsRead = (id) => {
    dispatch({ type: 'MARK_AS_READ', id });
  };

  const markAsUnread = (id) => {
    dispatch({ type: 'MARK_AS_UNREAD', id });
  };

  const toggleStar = (id) => {
    dispatch({ type: 'TOGGLE_STAR', id });
  };

  const deleteEmail = (id) => {
    dispatch({ type: 'DELETE_EMAIL', id });
  };

  const restoreEmail = (id) => {
    dispatch({ type: 'RESTORE_EMAIL', id });
  };

  const permanentDeleteEmail = (id) => {
    dispatch({ type: 'PERMANENT_DELETE', id });
  };

  const addEmail = (email) => {
    const newEmail = {
      ...email,
      id: Date.now(),
      timestamp: new Date(),
      isRead: false,
      isStarred: false,
      isImportant: false,
      isDeleted: false,
      deletedAt: null,
      labels: []
    };
    dispatch({ type: 'ADD_EMAIL', email: newEmail });
  };

  const getFilteredEmails = () => {
    let filtered = emails;

    // Filter by folder
    if (currentFolder === 'inbox') {
      filtered = emails.filter(email => !email.isDeleted);
    } else if (currentFolder === 'starred') {
      filtered = emails.filter(email => email.isStarred && !email.isDeleted);
    } else if (currentFolder === 'important') {
      filtered = emails.filter(email => email.isImportant && !email.isDeleted);
    } else if (currentFolder === 'sent') {
      filtered = emails.filter(email => email.from === 'you@example.com' && !email.isDeleted);
    } else if (currentFolder === 'trash') {
      filtered = emails.filter(email => email.isDeleted);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(email => 
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.body.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const value = {
    emails: getFilteredEmails(),
    currentFolder,
    setCurrentFolder,
    searchQuery,
    setSearchQuery,
    markAsRead,
    markAsUnread,
    toggleStar,
    deleteEmail,
    restoreEmail,
    permanentDeleteEmail,
    addEmail
  };

  return (
    <EmailContext.Provider value={value}>
      {children}
    </EmailContext.Provider>
  );
};

export const useEmail = () => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  return context;
};
