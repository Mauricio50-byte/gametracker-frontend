import React, { useEffect, useState } from 'react';
import ListaReseñas from '../components/reviews/ListaReseñas';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

const API_BASE = 'http://localhost:4000';

const Reseñas = () => {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [games, setGames] = useState([]);
  const [gamesError, setGamesError] = useState('');
  const [gamesLoading, setGamesLoading] = useState(false);
  const [savingReview, setSavingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    juegoId: '',
    titulo: '',
    contenido: '',
    puntuacion: 5,
    aspectosPositivos: '',
    aspectosNegativos: '',
    recomendado: false
  });

  const load = async (p = 1) => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE}/api/reviews?page=${p}&limit=10`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Error');
      setItems(json.data || []);
      setMeta(json.meta);
      setPage(p);
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const loadGames = async () => {
    try {
      setGamesLoading(true);
      setGamesError('');
      const res = await fetch(`${API_BASE}/api/games?page=1&limit=50`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Error');
      setGames(json.data || []);
    } catch (e) {
      setGamesError(e.message || 'Error al cargar juegos');
    } finally {
      setGamesLoading(false);
    }
  };

  useEffect(() => { load(1); loadGames(); }, []);

  const setStars = (n) => setReviewForm((prev) => ({ ...prev, puntuacion: n }));
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      setSavingReview(true);
      setError('');
      if (!reviewForm.juegoId) throw new Error('Selecciona un juego');
      const positivos = (reviewForm.aspectosPositivos || '').split(',').map((s) => s.trim()).filter(Boolean);
      const negativos = (reviewForm.aspectosNegativos || '').split(',').map((s) => s.trim()).filter(Boolean);
      const payload = {
        juegoId: reviewForm.juegoId,
        titulo: reviewForm.titulo,
        contenido: reviewForm.contenido,
        puntuacion: Number(reviewForm.puntuacion),
        aspectosPositivos: positivos,
        aspectosNegativos: negativos,
        recomendado: !!reviewForm.recomendado
      };
      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Error creando reseña');
      setReviewForm({ juegoId: '', titulo: '', contenido: '', puntuacion: 5, aspectosPositivos: '', aspectosNegativos: '', recomendado: false });
      await load(1);
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setSavingReview(false);
    }
  };

  if (loading) return <div className="page"><Loading text="Cargando reseñas..." /></div>;
  if (error) return <div className="page"><ErrorMessage message={error} /></div>;

  return (
    <div className="page">
      <h1>Reseñas</h1>
      <form onSubmit={submitReview} className="card" style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <label>Juego</label>
            <select name="juegoId" value={reviewForm.juegoId} onChange={handleChange} required>
              <option value="">Selecciona juego</option>
              {games.map((g) => (
                <option key={g._id} value={g._id}>{g.titulo}</option>
              ))}
            </select>
            {gamesLoading && <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>Cargando juegos...</div>}
            {gamesError && <div style={{ fontSize: 12, color: 'red' }}>{gamesError}</div>}
          </div>
          <div style={{ flex: 1 }}>
            <label>Título</label>
            <input name="titulo" value={reviewForm.titulo} onChange={handleChange} required maxLength={120} />
            <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{reviewForm.titulo.length}/120</div>
          </div>
          <div style={{ width: 160 }}>
            <label>Puntuación</label>
            <div className="stars" style={{ cursor: 'pointer' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`star ${i < Number(reviewForm.puntuacion || 0) ? 'filled' : ''}`} onClick={() => setStars(i + 1)}>★</span>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label>Contenido</label>
          <textarea name="contenido" value={reviewForm.contenido} onChange={handleChange} rows={3} required maxLength={500} />
          <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{reviewForm.contenido.length}/500</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <label>Aspectos positivos (coma separados)</label>
            <input name="aspectosPositivos" value={reviewForm.aspectosPositivos} onChange={handleChange} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Aspectos negativos (coma separados)</label>
            <input name="aspectosNegativos" value={reviewForm.aspectosNegativos} onChange={handleChange} />
          </div>
        </div>
        <label>
          <input type="checkbox" name="recomendado" checked={reviewForm.recomendado} onChange={handleChange} />
          Recomendar
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={savingReview}>{savingReview ? 'Guardando...' : 'Agregar reseña'}</button>
        </div>
      </form>
      <ListaReseñas
        items={items}
        meta={meta}
        onPrev={() => load(page - 1)}
        onNext={() => load(page + 1)}
        onRefresh={() => load(page)}
      />
    </div>
  );
};

export default Reseñas;