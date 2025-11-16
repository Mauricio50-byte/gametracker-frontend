import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const EstadisticasPersonales = () => {
  const [rate, setRate] = useState(null);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const [rRes, gRes] = await Promise.all([
        fetch(`${API_BASE}/api/stats/completion-rate`),
        fetch(`${API_BASE}/api/stats/by-genre`)
      ]);
      const rJson = await rRes.json();
      const gJson = await gRes.json();
      if (!rJson.success) throw new Error(rJson.message || 'Error');
      if (!gJson.success) throw new Error(gJson.message || 'Error');
      setRate(rJson.data);
      setGenres(gJson.data || []);
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="card">Cargando estadísticas...</div>;
  if (error) return <div className="card">{error}</div>;

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {rate && (
        <div className="card" style={{ display: 'grid', gap: 8 }}>
          <strong>Tasa de Completitud</strong>
          <div className="progress" style={{ height: 10 }}>
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${rate.completionRate}%` }}
              aria-valuenow={rate.completionRate}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <div>{rate.completionRate}% ({rate.completedGames}/{rate.totalGames})</div>
        </div>
      )}
      <div className="card" style={{ display: 'grid', gap: 6 }}>
        <strong>Géneros</strong>
        {genres.map((g) => (
          <div key={g.genre} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{g.genre}</span>
            <span>{g.count}</span>
          </div>
        ))}
        {genres.length === 0 && <div>No hay datos</div>}
      </div>
    </div>
  );
};

export default EstadisticasPersonales;