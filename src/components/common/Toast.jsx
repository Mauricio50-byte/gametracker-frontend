import React, { useEffect } from 'react';

const Toast = ({ message, onClose, duration = 1500, type = 'success' }) => {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;
  return (
    <div className={`toast ${type} alert ${type === 'error' ? 'alert-danger' : 'alert-info'}`}>
      {message}
    </div>
  );
};

export default Toast;