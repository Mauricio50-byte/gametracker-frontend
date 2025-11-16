import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const PAGE_SIZE = 10;

const ListaJuegos = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, limit: PAGE_SIZE, total: 0, pages: 1 });
  const [q, setQ] = useState('');
  const [plataformaFilter, setPlataformaFilter] = useState('');
  const [generoFilter, setGeneroFilter] = useState('');

  const load = async (p = 1) => {
    try {
      setLoading(true);
      setError('');
      let url = `${API_BASE}/api/games?page=${p}&limit=${PAGE_SIZE}`;
      if (q.trim()) {
        url = `${API_BASE}/api/games/search?query=${encodeURIComponent(q.trim())}&page=${p}&limit=${PAGE_SIZE}`;
      } else if (plataformaFilter || generoFilter) {
        const params = new URLSearchParams();
        if (plataformaFilter) params.set('plataforma', plataformaFilter);
        if (generoFilter) params.set('genero', generoFilter);
        params.set('page', String(p));
        params.set('limit', String(PAGE_SIZE));
        url = `${API_BASE}/api/games/filter?${params.toString()}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Error');
      setItems(json.data || []);
      setMeta(json.meta || { page: p, limit: PAGE_SIZE, total: 0, pages: 1 });
      setPage(p);
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, []);
  useEffect(() => { load(1); }, [q, plataformaFilter, generoFilter]);

  const eliminar = async (id) => {
    const ok = window.confirm('¿Eliminar este juego?');
    if (!ok) return;
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE}/api/games/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Error eliminando juego');
      await load(page);
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (val) => {
    const n = Math.max(Math.min(Number(val || 0), 5), 0);
    return (
      <span className="stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`star ${i < n ? 'filled' : ''}`}>★</span>
        ))}
      </span>
    );
  };

  return (
    <div>
      {loading && <Loading text="Cargando juegos..." />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (
        <div>
          <div className="card mb-2">
            <div className="card-body">
              <div className="row g-2">
                <div className="col-md-4">
                  <label className="form-label">Buscar</label>
                  <input className="form-control" placeholder="Título..." value={q} onChange={(e) => setQ(e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Plataforma</label>
                  <select className="form-select" value={plataformaFilter} onChange={(e) => setPlataformaFilter(e.target.value)}>
                    <option value="">Todas</option>
                    <option value="PC">PC</option>
                    <option value="PlayStation 5">PlayStation 5</option>
                    <option value="PlayStation 4">PlayStation 4</option>
                    <option value="Xbox Series X/S">Xbox Series X/S</option>
                    <option value="Xbox One">Xbox One</option>
                    <option value="Nintendo Switch">Nintendo Switch</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Otra">Otra</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Género</label>
                  <select className="form-select" value={generoFilter} onChange={(e) => setGeneroFilter(e.target.value)}>
                    <option value="">Todos</option>
                    <option value="Acción">Acción</option>
                    <option value="Aventura">Aventura</option>
                    <option value="RPG">RPG</option>
                    <option value="Estrategia">Estrategia</option>
                    <option value="Deportes">Deportes</option>
                    <option value="Simulación">Simulación</option>
                    <option value="Puzzle">Puzzle</option>
                    <option value="Terror">Terror</option>
                    <option value="Indie">Indie</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {items.map((g) => (
              <div key={g._id} className="card">
                <div style={{ display: 'flex', gap: 12 }}>
                  <img
                    src={g.portada || 'https://via.placeholder.com/80x100?text=Portada'}
                    alt={g.titulo}
                    className="rounded border"
                    style={{ width: 80, height: 100, objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{g.titulo}</strong>
                      <span>{g.plataforma}</span>
                    </div>
                    <div style={{ color: 'var(--color-muted)' }}>{g.genero}</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                      {typeof g.puntuacion === 'number' && renderStars(g.puntuacion)}
                      {g.completado && <span className="badge success">Completado</span>}
                    </div>
                    {(((Array.isArray(g.aspectosPositivos) && g.aspectosPositivos.length > 0) || (Array.isArray(g.aspectosNegativos) && g.aspectosNegativos.length > 0))) && (
                      <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {Array.isArray(g.aspectosPositivos) && g.aspectosPositivos.slice(0, 3).map((a, i) => (
                          <span key={`pos-${i}`} className="badge bg-success">{a}</span>
                        ))}
                        {Array.isArray(g.aspectosNegativos) && g.aspectosNegativos.slice(0, 3).map((a, i) => (
                          <span key={`neg-${i}`} className="badge bg-danger">{a}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ marginTop: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
                      <Link to={`/juego/${g._id}`}>Ver detalle</Link>
                      <Link to={`/editar/${g._id}`}>Editar</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => eliminar(g._id)}>Eliminar</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && <div>No hay juegos</div>}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button disabled={page <= 1} onClick={() => load(page - 1)}>Anterior</button>
            <div>Pagina {meta.page} de {meta.pages}</div>
            <button disabled={page >= meta.pages} onClick={() => load(page + 1)}>Siguiente</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaJuegos;