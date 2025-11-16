import React, { useEffect, useState, useCallback } from 'react';
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
  const [sort, setSort] = useState('date_desc');
  const [filterText, setFilterText] = useState('');
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

  const load = useCallback(async (p = 1) => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE}/api/reviews?page=${p}&limit=10&sort=${sort}`);
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
  }, [sort]);

  const loadGames = useCallback(async () => {
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
  }, []);

  useEffect(() => { load(1); loadGames(); }, [load, loadGames]);

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

  if (loading) return <div className="container py-4"><Loading text="Cargando reseñas..." /></div>;
  if (error) return <div className="container py-4"><ErrorMessage message={error} /></div>;

  return (
    <div>
      <section className="py-4 text-white" style={{ backgroundImage: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)' }}>
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 fw-bold m-0">Reseñas</h1>
            <div className="mt-2">Crea, ordena y explora reseñas de tus juegos.</div>
          </div>
          <a href="/agregar" className="btn btn-light">Agregar juego</a>
        </div>
      </section>
      <section className="py-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card mb-3">
                <div className="card-header">Orden y filtros</div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6 d-flex align-items-center gap-2">
                      <span>Ordenar por</span>
                      <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)} style={{ maxWidth: 240 }}>
                        <option value="date_desc">Más recientes</option>
                        <option value="date_asc">Más antiguas</option>
                        <option value="rating_desc">Mejor puntuadas</option>
                        <option value="rating_asc">Peor puntuadas</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Buscar en reseñas</label>
                      <input className="form-control" placeholder="Texto en título, contenido o aspectos" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={submitReview} className="card mb-3">
                <div className="card-header">Crear reseña</div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label">Buscar juego</label>
                      <input className="form-control" type="text" placeholder="Buscar juego..." value={reviewForm.q || ''} onChange={(e) => setReviewForm((prev) => ({ ...prev, q: e.target.value }))} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Juego</label>
                      <select className="form-select" name="juegoId" value={reviewForm.juegoId} onChange={handleChange} required>
                        <option value="">Selecciona juego</option>
                        {games.filter((g) => {
                          const q = (reviewForm.q || '').toLowerCase();
                          if (!q) return true;
                          return g.titulo.toLowerCase().includes(q);
                        }).map((g) => (
                          <option key={g._id} value={g._id}>{g.titulo}</option>
                        ))}
                      </select>
                      {gamesLoading && <div className="form-text">Cargando juegos...</div>}
                      {gamesError && <div className="text-danger small">{gamesError}</div>}
                    </div>
                    <div className="col-md-8">
                      <label className="form-label">Título</label>
                      <input className="form-control" name="titulo" value={reviewForm.titulo} onChange={handleChange} required maxLength={120} />
                      <div className="form-text">{reviewForm.titulo.length}/120</div>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Puntuación</label>
                      <div className="stars" style={{ cursor: 'pointer' }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`star ${i < Number(reviewForm.puntuacion || 0) ? 'filled' : ''}`} onClick={() => setStars(i + 1)}>★</span>
                        ))}
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Contenido</label>
                      <textarea className="form-control" name="contenido" value={reviewForm.contenido} onChange={handleChange} rows={3} required maxLength={500} />
                      <div className="form-text">{reviewForm.contenido.length}/500</div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Aspectos positivos (coma separados)</label>
                      <input className="form-control" name="aspectosPositivos" value={reviewForm.aspectosPositivos} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Aspectos negativos (coma separados)</label>
                      <input className="form-control" name="aspectosNegativos" value={reviewForm.aspectosNegativos} onChange={handleChange} />
                    </div>
                    <div className="col-12 d-flex align-items-center gap-2">
                      <input type="checkbox" id="recomendarCheck" name="recomendado" checked={reviewForm.recomendado} onChange={handleChange} />
                      <label htmlFor="recomendarCheck" className="m-0">Recomendar</label>
                    </div>
                    <div className="col-12 d-flex gap-2">
                      <button type="submit" className="btn btn-primary" disabled={savingReview}>{savingReview ? 'Guardando...' : 'Agregar reseña'}</button>
                    </div>
                  </div>
                </div>
              </form>

              <div className="card">
                <div className="card-header">Reseñas</div>
                <div className="card-body">
                  <ListaReseñas
                    items={items}
                    meta={meta}
                    onPrev={() => load(page - 1)}
                    onNext={() => load(page + 1)}
                    onRefresh={() => load(page)}
                    filter={filterText}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card h-100">
                <div className="card-header">Consejos</div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">Usa títulos claros y concisos</li>
                    <li className="list-group-item">Sé específico en positivos y negativos</li>
                    <li className="list-group-item">Puntuación entre 1 y 5 estrellas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reseñas;