import React, { useState } from 'react';

const API_BASE = 'http://localhost:4000';

const TarjetaReseña = ({ review, onRefresh }) => {
  const filled = Math.max(Math.min(Number(review.puntuacion || 0), 5), 0);
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [form, setForm] = useState({
    titulo: review.titulo,
    contenido: review.contenido,
    puntuacion: review.puntuacion,
    aspectosPositivos: Array.isArray(review.aspectosPositivos) ? review.aspectosPositivos.join(', ') : '',
    aspectosNegativos: Array.isArray(review.aspectosNegativos) ? review.aspectosNegativos.join(', ') : '',
    recomendado: !!review.recomendado
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const save = async () => {
    try {
      setLoading(true);
      setError('');
      const payload = {
        titulo: form.titulo,
        contenido: form.contenido,
        puntuacion: Number(form.puntuacion),
        aspectosPositivos: (form.aspectosPositivos || '').split(',').map((s) => s.trim()).filter(Boolean),
        aspectosNegativos: (form.aspectosNegativos || '').split(',').map((s) => s.trim()).filter(Boolean),
        recomendado: !!form.recomendado
      };
      const res = await fetch(`${API_BASE}/api/reviews/${review._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Error');
      setEditing(false);
      onRefresh && onRefresh();
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE}/api/reviews/${review._id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Error');
      onRefresh && onRefresh();
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const startDelete = () => {
    setConfirmingDelete(true);
  };
  const cancelDelete = () => {
    setConfirmingDelete(false);
  };
  const confirmDelete = async () => {
    await remove();
    setConfirmingDelete(false);
  };

  const EditModal = () => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div className="card" style={{ width: 'min(640px, 92vw)', display: 'grid', gap: 8 }}>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <div style={{ display: 'flex', gap: 8 }}>
          <input name="titulo" value={form.titulo} onChange={handleChange} maxLength={120} />
          <input type="number" name="puntuacion" value={form.puntuacion} onChange={handleChange} min="1" max="5" style={{ width: 80 }} />
        </div>
        <textarea name="contenido" value={form.contenido} onChange={handleChange} rows={4} />
        <div style={{ display: 'flex', gap: 8 }}>
          <input name="aspectosPositivos" value={form.aspectosPositivos} onChange={handleChange} placeholder="Positivos" />
          <input name="aspectosNegativos" value={form.aspectosNegativos} onChange={handleChange} placeholder="Negativos" />
        </div>
        <label>
          <input type="checkbox" name="recomendado" checked={form.recomendado} onChange={handleChange} />
          Recomendar
        </label>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={() => setEditing(false)} disabled={loading}>Cancelar</button>
          <button onClick={save} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card">
      {editing && <EditModal />}
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <strong>{review.titulo}</strong>
          <span className="stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`star ${i < filled ? 'filled' : ''}`}>★</span>
            ))}
          </span>
        </div>
        <div className="mt-2 text-muted">{review.contenido}</div>
        {Array.isArray(review.aspectosPositivos) && review.aspectosPositivos.length > 0 && (
          <div className="mt-2 d-flex gap-2 flex-wrap">
            {review.aspectosPositivos.map((p, idx) => (
              <span key={idx} className="badge bg-success">{p}</span>
            ))}
          </div>
        )}
        {Array.isArray(review.aspectosNegativos) && review.aspectosNegativos.length > 0 && (
          <div className="mt-1 d-flex gap-2 flex-wrap">
            {review.aspectosNegativos.map((n, idx) => (
              <span key={idx} className="badge bg-danger">{n}</span>
            ))}
          </div>
        )}
        <div className="mt-2">
          {review.recomendado ? (
            <span className="badge bg-success">Recomendado</span>
          ) : (
            <span className="badge bg-secondary">No recomendado</span>
          )}
        </div>
        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-outline-primary btn-sm" onClick={() => setEditing(true)}>Editar</button>
          <button className="btn btn-outline-danger btn-sm" onClick={startDelete}>Eliminar</button>
        </div>
        {error && <div className="text-danger mt-2 small">{error}</div>}
        {confirmingDelete && (
          <div className="mt-2 d-flex gap-2 align-items-center">
            <span>¿Seguro que deseas eliminar esta reseña?</span>
            <button className="btn btn-danger btn-sm" onClick={confirmDelete} disabled={loading}>Sí</button>
            <button className="btn btn-outline-secondary btn-sm" onClick={cancelDelete} disabled={loading}>No</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TarjetaReseña;