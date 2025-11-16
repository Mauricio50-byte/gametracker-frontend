import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../common/Toast';
import ErrorMessage from '../common/ErrorMessage';

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

  const compressToBase64 = (file, maxSize = 600, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const scale = Math.min(1, maxSize / Math.max(width, height));
          width = Math.round(width * scale);
          height = Math.round(height * scale);
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          try {
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl);
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = reject;
        img.src = ev.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const base64 = await compressToBase64(file, 800, 0.75);
      setForm((prev) => ({ ...prev, portada: base64 }));
    } catch (err) {
      setError('No se pudo procesar la imagen');
    }
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
    <form onSubmit={handleSubmit} className="d-grid gap-3">
      <Toast message={toast} onClose={() => setToast('')} />
      <ErrorMessage message={error} />
      <div className="row g-3">
        <div className="col-lg-8">
          <div className="mb-2">
            <label className="form-label">Título</label>
            <input className="form-control" name="titulo" value={form.titulo} onChange={handleChange} required />
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Plataforma</label>
              <select className="form-select" name="plataforma" value={form.plataforma} onChange={handleChange} required>
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
            <div className="col-md-6">
              <label className="form-label">Género</label>
              <select className="form-select" name="genero" value={form.genero} onChange={handleChange} required>
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
          <div className="mt-3">
            <label className="form-label">Portada (imagen)</label>
            <input className="form-control" type="file" accept="image/*" onChange={handleImageChange} />
            {form.portada && (
              <div className="mt-2">
                <img src={form.portada} alt="Portada" className="img-fluid rounded border" style={{ maxHeight: 200, objectFit: 'cover' }} />
              </div>
            )}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">Desarrollador</label>
              <input className="form-control" name="desarrollador" value={form.desarrollador} onChange={handleChange} />
            </div>
            <div className="col-6">
              <label className="form-label">Año</label>
              <input className="form-control" type="number" name="anioLanzamiento" value={form.anioLanzamiento} onChange={handleChange} />
            </div>
            <div className="col-6">
              <label className="form-label">Puntuación</label>
              <input className="form-control" type="number" name="puntuacion" value={form.puntuacion} onChange={handleChange} min="0" max="5" />
            </div>
            <div className="col-12">
              <label className="form-label">Horas Jugadas</label>
              <input className="form-control" type="number" name="horasJugadas" value={form.horasJugadas} onChange={handleChange} min="0" />
            </div>
            <div className="col-12">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="completado" checked={form.completado} onChange={handleChange} id="completadoCheck" />
                <label className="form-check-label" htmlFor="completadoCheck">Completado</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex gap-2">
        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/biblioteca')}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
      </div>
    </form>
  );
};

export default FormularioJuego;