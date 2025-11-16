import React from 'react';

const TarjetaReseña = ({ review }) => {
  const filled = Math.max(Math.min(Number(review.puntuacion || 0), 5), 0);
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong>{review.titulo}</strong>
        <span className="stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`star ${i < filled ? 'filled' : ''}`}>★</span>
          ))}
        </span>
      </div>
      <div style={{ color: 'var(--color-muted)', marginTop: 6 }}>{review.contenido}</div>
      {Array.isArray(review.aspectosPositivos) && review.aspectosPositivos.length > 0 && (
        <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {review.aspectosPositivos.map((p, idx) => (
            <span key={idx} className="badge">{p}</span>
          ))}
        </div>
      )}
      {Array.isArray(review.aspectosNegativos) && review.aspectosNegativos.length > 0 && (
        <div style={{ marginTop: 4, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {review.aspectosNegativos.map((n, idx) => (
            <span key={idx} className="badge muted">{n}</span>
          ))}
        </div>
      )}
      {review.recomendado && <div style={{ marginTop: 8 }}>✅ Recomendado</div>}
    </div>
  );
};

export default TarjetaReseña;