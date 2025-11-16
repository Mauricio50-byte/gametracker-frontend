import React from 'react';

const Loading = ({ text = 'Cargando...' }) => {
  return (
    <div className="d-flex align-items-center gap-2">
      <div className="spinner-border text-primary" role="status" style={{ width: 20, height: 20 }} />
      <span className="text-muted">{text}</span>
    </div>
  );
};

export default Loading;