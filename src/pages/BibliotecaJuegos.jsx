import React from 'react';
import ListaJuegos from '../components/games/ListaJuegos';

const BibliotecaJuegos = () => {
  return (
    <div>
      <section className="py-4 text-white" style={{ backgroundImage: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)' }}>
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 fw-bold m-0">Biblioteca de Juegos</h1>
            <div className="mt-2">Explora, organiza y accede al detalle de cada juego.</div>
          </div>
          <a href="/agregar" className="btn btn-light">Agregar juego</a>
        </div>
      </section>
      <section className="py-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-header">Listado</div>
                <div className="card-body">
                  <ListaJuegos />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card h-100">
                <div className="card-header">Consejos</div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">Usa el detalle para editar o reseñar</li>
                    <li className="list-group-item">Organiza por plataforma y género</li>
                    <li className="list-group-item">Agrega nuevos títulos desde el botón superior</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BibliotecaJuegos;