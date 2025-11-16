import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../common/Toast';

const API_BASE = 'http://localhost:4000';

const initial = {
  titulo: '',
  plataforma: '',
  genero: '',
  desarrollador: '',
  anioLanzamiento: new Date().getFullYear(),
  portada: '',
  completado: false,
  puntuacion: 0,
  horasJugadas: 0
};

const FormularioJuego = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE}/api/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Error');
      setToast('Juego guardado correctamente');
      setTimeout(() => navigate('/biblioteca'), 1000);
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gap: 12 }}>
      <Toast message={toast} onClose={() => setToast('')} />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <label>Título</label>
        <input name="titulo" value={form.titulo} onChange={handleChange} required />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label>Plataforma</label>
          <select name="plataforma" value={form.plataforma} onChange={handleChange} required>
            <option value="">Selecciona</option>
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
        <div style={{ flex: 1 }}>
          <label>Género</label>
          <select name="genero" value={form.genero} onChange={handleChange} required>
            <option value="">Selecciona</option>
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
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label>Desarrollador</label>
          <input name="desarrollador" value={form.desarrollador} onChange={handleChange} />
        </div>
        </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label>Año</label>
          <input type="number" name="anioLanzamiento" value={form.anioLanzamiento} onChange={handleChange} />
        </div>
        <div style={{ flex: 1 }}>
          <label>Puntuación</label>
          <input type="number" name="puntuacion" value={form.puntuacion} onChange={handleChange} min="0" max="5" />
        </div>
        <div style={{ flex: 1 }}>
          <label>Horas Jugadas</label>
          <input type="number" name="horasJugadas" value={form.horasJugadas} onChange={handleChange} min="0" />
        </div>
      </div>
      <div>
        <label>
          <input type="checkbox" name="completado" checked={form.completado} onChange={handleChange} />
          Completado
        </label>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={() => navigate('/biblioteca')}>Cancelar</button>
        <button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
      </div>
    </form>
  );
};

export default FormularioJuego;