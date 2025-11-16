import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-light border-top mt-4 py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="text-muted">GameTracker</div>
        <div className="d-flex gap-3">
          <NavLink className="text-muted" to="/reseñas">Reseñas</NavLink>
          <NavLink className="text-muted" to="/estadisticas">Estadísticas</NavLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;