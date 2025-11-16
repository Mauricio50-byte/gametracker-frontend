import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-40">
      <nav className="navbar navbar-light bg-light border-bottom">
        <div className="container d-flex justify-content-between align-items-center">
          <a className="navbar-brand fw-semibold" href="/">GameTracker</a>
          <div className="d-flex gap-3">
            <NavLink className="nav-link" to="/">Inicio</NavLink>
            <NavLink className="nav-link" to="/biblioteca">Biblioteca</NavLink>
            <NavLink className="nav-link" to="/agregar">Agregar</NavLink>
            <NavLink className="nav-link" to="/reseñas">Reseñas</NavLink>
            <NavLink className="nav-link" to="/estadisticas">Estadísticas</NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;