import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-light border-top mt-4 py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="text-muted">GameTracker</div>
        <div className="d-flex gap-3">
          <a className="text-muted" href="/reseñas">Reseñas</a>
          <a className="text-muted" href="/estadisticas">Estadísticas</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;