import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const ResumenGeneral = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const cacheKey = 'stats_summary';
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.ts && Date.now() - parsed.ts < 60000) {
          setData(parsed.data);
          setLoading(false);
          return;
        }
      }
      const res = await fetch(`${API_BASE}/api/stats/summary`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Error');
      setData(json.data);
      sessionStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: json.data }));
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="card">Cargando resumen...</div>;
  if (error) return <div className="card">{error}</div>;
  if (!data) return null;

  return (
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
      <div className="card"><div>Total de juegos</div><strong style={{ fontSize: 22 }}>{data.totalGames}</strong></div>
      <div className="card"><div>Completados</div><strong style={{ fontSize: 22 }}>{data.completedGames}</strong></div>
      <div className="card"><div>Horas totales</div><strong style={{ fontSize: 22 }}>{data.totalHours}</strong></div>
      <div className="card"><div>Promedio de puntuación</div><strong style={{ fontSize: 22 }}>{data.avgRating}</strong></div>
      <div className="card"><div>Tasa de completitud</div><strong style={{ fontSize: 22 }}>{data.completionRate}%</strong></div>
    </div>
  );
};

export default ResumenGeneral;