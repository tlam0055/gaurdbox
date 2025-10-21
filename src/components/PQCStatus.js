import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import pqcService from '../services/pqcService';

const PQCStatus = () => {
  const [status, setStatus] = useState('disconnected');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check PQC service status periodically
    const checkStatus = () => {
      if (pqcService.sharedSecret) {
        setStatus('connected');
        setIsVisible(true);
      } else {
        setStatus('disconnected');
        setIsVisible(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle size={16} className="text-success" />;
      case 'error':
        return <XCircle size={16} className="text-danger" />;
      default:
        return <Key size={16} className="text-muted" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'PQC Ready';
      case 'error':
        return 'PQC Error';
      default:
        return 'PQC Offline';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-success';
      case 'error':
        return 'text-danger';
      default:
        return 'text-muted';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`d-flex align-items-center gap-2 small ${getStatusColor()}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  );
};

export default PQCStatus;
