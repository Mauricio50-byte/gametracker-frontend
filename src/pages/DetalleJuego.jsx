import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import ListaReseñas from '../components/reviews/ListaReseñas';

const API_BASE = 'http://localhost:4000';

const DetalleJuego = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('date_desc');
  const [reviewForm, setReviewForm] = useState({
    titulo: '',
    contenido: '',
    puntuacion: 5,
    aspectosPositivos: '',
    aspectosNegativos: '',
    recomendado: false
  });
  const [savingReview, setSavingReview] = useState(false);
  const setStars = (n) => setReviewForm((prev) => ({ ...prev, puntuacion: n }));

  const handleReviewChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      setSavingReview(true);
      setError('');
      const positivos = (reviewForm.aspectosPositivos || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const negativos = (reviewForm.aspectosNegativos || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const payload = {
        juegoId: id,
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
      setReviewForm({ titulo: '', contenido: '', puntuacion: 5, aspectosPositivos: '', aspectosNegativos: '', recomendado: false });
      await load(1);
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setSavingReview(false);
    }
  };

  const load = async (p = 1) => {
    try {
      setLoading(true);
      setError('');
      const [gRes, rRes] = await Promise.all([
        fetch(`${API_BASE}/api/games/${id}`),
        fetch(`${API_BASE}/api/reviews/game/${id}?page=${p}&limit=10&sort=${sort}`)
      ]);
      const gJson = await gRes.json();
      const rJson = await rRes.json();
      if (!gJson.success) throw new Error(gJson.message || 'Error');
      if (!rJson.success) throw new Error(rJson.message || 'Error');
      setGame(gJson.data);
      setReviews(rJson.data || []);
      setMeta(rJson.meta);
      setPage(p);
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, [id, sort]);

  if (loading) return <div className="container py-4"><Loading text="Cargando detalle..." /></div>;
  if (error) return <div className="container py-4"><ErrorMessage message={error} /></div>;
  if (!game) return <div className="container py-4">No encontrado</div>;

  return (
    <div>
      <section className="py-4 text-white" style={{ backgroundImage: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)' }}>
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 fw-bold m-0">{game.titulo}</h1>
            <div className="mt-2 d-flex gap-3 align-items-center">
              <span className="badge bg-primary">{game.plataforma}</span>
              <span className="badge bg-secondary">{game.genero}</span>
            </div>
          </div>
          <a href="/biblioteca" className="btn btn-light">Volver</a>
        </div>
      </section>

      <section className="py-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    {game.horasJugadas > 0 && <div><strong>Horas:</strong> {game.horasJugadas}</div>}
                    {game.completado && <span className="badge success">Completado</span>}
                  </div>
                  {typeof game.puntuacion === 'number' && (
                    <div className="stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`star ${i < Number(game.puntuacion || 0) ? 'filled' : ''}`}>★</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="card mt-3">
                <div className="card-body d-flex gap-2 align-items-center">
                  <span>Ordenar por</span>
                  <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)} style={{ maxWidth: 240 }}>
                    <option value="date_desc">Más recientes</option>
                    <option value="date_asc">Más antiguas</option>
                    <option value="rating_desc">Mejor puntuadas</option>
                    <option value="rating_asc">Peor puntuadas</option>
                  </select>
                </div>
              </div>

              <form onSubmit={submitReview} className="card mt-3" style={{ display: 'grid', gap: 8 }}>
                <div className="card-body">
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label>Título</label>
              <input name="titulo" value={reviewForm.titulo} onChange={handleReviewChange} required maxLength={120} />
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
            <textarea name="contenido" value={reviewForm.contenido} onChange={handleReviewChange} rows={3} required maxLength={500} />
            <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{reviewForm.contenido.length}/500</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label>Aspectos positivos (coma separados)</label>
              <input name="aspectosPositivos" value={reviewForm.aspectosPositivos} onChange={handleReviewChange} />
            </div>
            <div style={{ flex: 1 }}>
              <label>Aspectos negativos (coma separados)</label>
              <input name="aspectosNegativos" value={reviewForm.aspectosNegativos} onChange={handleReviewChange} />
            </div>
          </div>
          <label>
            <input type="checkbox" name="recomendado" checked={reviewForm.recomendado} onChange={handleReviewChange} />
            Recomendar
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={savingReview}>{savingReview ? 'Guardando...' : 'Agregar reseña'}</button>
          </div>
                </div>
        </form>
              <div className="mt-3">
                <ListaReseñas
                  items={reviews}
                  meta={meta}
                  onPrev={() => load(page - 1)}
                  onNext={() => load(page + 1)}
                  onRefresh={() => load(page)}
                />
              </div>
            </div>
            <div className="col-lg-4">
              
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DetalleJuego;