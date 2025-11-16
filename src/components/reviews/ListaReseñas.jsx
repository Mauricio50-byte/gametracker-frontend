import React from 'react';
import TarjetaReseña from './TarjetaReseña';

const ListaReseñas = ({ items = [], meta, onPrev, onNext, onRefresh }) => {
  return (
    <div>
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((r) => (
          <TarjetaReseña key={r._id} review={r} onRefresh={onRefresh} />
        ))}
        {items.length === 0 && <div>No hay reseñas</div>}
      </div>
      {meta && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button disabled={meta.page <= 1} onClick={onPrev}>Anterior</button>
          <div>Pagina {meta.page} de {meta.pages}</div>
          <button disabled={meta.page >= meta.pages} onClick={onNext}>Siguiente</button>
        </div>
      )}
    </div>
  );
};

export default ListaReseñas;