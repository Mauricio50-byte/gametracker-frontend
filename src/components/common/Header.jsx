import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
      <nav style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/biblioteca">Biblioteca</NavLink>
        <NavLink to="/agregar">Agregar</NavLink>
        <NavLink to="/reseñas">Reseñas</NavLink>
        <NavLink to="/estadisticas">Estadísticas</NavLink>
      </nav>
    </header>
  );
};

export default Header;