import React from 'react';
import ListaJuegos from '../components/games/ListaJuegos';

const BibliotecaJuegos = () => {
  return (
    <div className="page">
      <h1>Biblioteca de Juegos</h1>
      <ListaJuegos />
    </div>
  );
};

export default BibliotecaJuegos;