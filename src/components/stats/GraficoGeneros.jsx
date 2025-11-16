import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:4000';

const GraficoGeneros = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const cacheKey = 'stats_by_genre';
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.ts && Date.now() - parsed.ts < 60000) {
          setItems(parsed.data || []);
          setLoading(false);
          return;
        }
      }
      const res = await fetch(`${API_BASE}/api/stats/by-genre`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Error');
      setItems(json.data || []);
      sessionStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: json.data || [] }));
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="card">Cargando géneros...</div>;
  if (error) return <div className="card">{error}</div>;

  const total = items.reduce((acc, it) => acc + it.count, 0) || 1;

  return (
    <div className="card" style={{ display: 'grid', gap: 8 }}>
      <strong>Juegos por Género</strong>
      <div style={{ display: 'grid', gap: 6 }}>
        {items.map((it) => (
          <div key={it.genre} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 140 }}>{it.genre}</span>
            <div style={{ flex: 1, background: 'var(--color-border)', height: 8, borderRadius: 999 }}>
              <div style={{ width: `${Math.round((it.count / total) * 100)}%`, height: 8, background: 'var(--color-primary)', borderRadius: 999 }} />
            </div>
            <span>{it.count}</span>
          </div>
        ))}
        {items.length === 0 && <div>No hay datos</div>}
      </div>
    </div>
  );
};

export default GraficoGeneros;