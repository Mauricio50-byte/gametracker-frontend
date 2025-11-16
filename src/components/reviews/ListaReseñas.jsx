import React from 'react';
import TarjetaReseña from './TarjetaReseña';

const ListaReseñas = ({ items = [], meta, onPrev, onNext, onRefresh, filter = '' }) => {
  const q = String(filter || '').toLowerCase();
  const filtered = q
    ? items.filter((r) =>
        (r.titulo || '').toLowerCase().includes(q) ||
        (r.contenido || '').toLowerCase().includes(q) ||
        (Array.isArray(r.aspectosPositivos) && r.aspectosPositivos.join(' ').toLowerCase().includes(q)) ||
        (Array.isArray(r.aspectosNegativos) && r.aspectosNegativos.join(' ').toLowerCase().includes(q))
      )
    : items;

  return (
    <div>
      <div className="d-grid gap-3">
        {filtered.map((r) => (
          <TarjetaReseña key={r._id} review={r} onRefresh={onRefresh} />
        ))}
        {filtered.length === 0 && <div className="text-muted">No hay reseñas</div>}
      </div>
      {meta && (
        <div className="d-flex align-items-center gap-2 mt-3">
          <button className="btn btn-outline-secondary btn-sm" disabled={meta.page <= 1} onClick={onPrev}>Anterior</button>
          <div className="text-muted">Página {meta.page} de {meta.pages}</div>
          <button className="btn btn-outline-secondary btn-sm" disabled={meta.page >= meta.pages} onClick={onNext}>Siguiente</button>
        </div>
      )}
    </div>
  );
};

export default ListaReseñas;