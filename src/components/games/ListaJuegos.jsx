import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:4000';
const PAGE_SIZE = 10;

const ListaJuegos = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, limit: PAGE_SIZE, total: 0, pages: 1 });

  const load = async (p = 1) => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE}/api/games?page=${p}&limit=${PAGE_SIZE}`);
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

  return (
    <div>
      {loading && <div>Cargando...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && (
        <div>
          <div style={{ display: 'grid', gap: 12 }}>
            {items.map((g) => (
              <div key={g._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{g.titulo}</strong>
                  <span>{g.plataforma}</span>
                </div>
                <div style={{ color: 'var(--color-muted)' }}>{g.genero}</div>
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