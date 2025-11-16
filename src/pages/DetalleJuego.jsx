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

  const load = async (p = 1) => {
    try {
      setLoading(true);
      setError('');
      const [gRes, rRes] = await Promise.all([
        fetch(`${API_BASE}/api/games/${id}`),
        fetch(`${API_BASE}/api/reviews/game/${id}?page=${p}&limit=10`)
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

  useEffect(() => { load(1); }, [id]);

  if (loading) return <div className="page"><Loading text="Cargando detalle..." /></div>;
  if (error) return <div className="page"><ErrorMessage message={error} /></div>;
  if (!game) return <div className="page">No encontrado</div>;

  return (
    <div className="page">
      <h1>{game.titulo}</h1>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div><strong>Plataforma:</strong> {game.plataforma}</div>
            <div><strong>Género:</strong> {game.genero}</div>
          </div>
          {typeof game.puntuacion === 'number' && (
            <div className="stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`star ${i < Number(game.puntuacion || 0) ? 'filled' : ''}`}>★</span>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
          {game.horasJugadas > 0 && <div><strong>Horas:</strong> {game.horasJugadas}</div>}
          {game.completado && <span className="badge success">Completado</span>}
        </div>
      </div>

      <h2>Reseñas</h2>
      <ListaReseñas
        items={reviews}
        meta={meta}
        onPrev={() => load(page - 1)}
        onNext={() => load(page + 1)}
      />
    </div>
  );
};

export default DetalleJuego;