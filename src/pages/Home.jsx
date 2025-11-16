import React from 'react';

const Home = () => {
  return (
    <div className="w-100">
      <section className="py-5 text-white" style={{ backgroundImage: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-7">
              <h1 className="display-5 fw-bold">Bienvenido a GameTracker</h1>
              <p className="lead mt-3">Organiza tu biblioteca, escribe reseñas y conoce tus estadísticas como gamer. Todo en una sola aplicación rápida y moderna.</p>
              <div className="d-flex gap-2 mt-4">
                <a href="/biblioteca" className="btn btn-light btn-lg">Ver biblioteca</a>
                <a href="/agregar" className="btn btn-outline-light btn-lg">Agregar juego</a>
              </div>
            </div>
            <div className="col-md-5 mt-4 mt-md-0">
              <div className="bg-white rounded-3 shadow p-4 text-dark">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-primary" style={{ width: 48, height: 48 }} />
                  <div>
                    <div className="fw-semibold">Tu espacio gamer</div>
                    <div className="text-muted">Comienza a registrar tus juegos y experiencias</div>
                  </div>
                </div>
                <hr />
                <div className="d-grid gap-2">
                  <a href="/reseñas" className="btn btn-primary">Explorar reseñas</a>
                  <a href="/estadisticas" className="btn btn-outline-primary">Ver estadísticas</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold">Qué puedes hacer</h2>
            <p className="text-muted">Funciones pensadas para mejorar tu experiencia</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="mb-2 fw-semibold">Biblioteca de juegos</div>
                  <div className="text-muted">Agrega, edita y organiza tus juegos por plataforma, género y progreso.</div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="mb-2 fw-semibold">Reseñas y calificaciones</div>
                  <div className="text-muted">Comparte tu opinión y puntuación con aspectos positivos y negativos.</div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="mb-2 fw-semibold">Estadísticas visuales</div>
                  <div className="text-muted">Descubre hábitos de juego por plataforma, género y tasa de completitud.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="p-4 rounded-3 shadow-sm bg-white">
                <div className="fw-semibold mb-2">Cómo empezar</div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Agrega tu primer juego</li>
                  <li className="list-group-item">Escribe una reseña</li>
                  <li className="list-group-item">Consulta estadísticas</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6 mt-4 mt-md-0">
              <div className="rounded-3 p-4 text-white" style={{ backgroundImage: 'linear-gradient(90deg, #0ea5e9 0%, #6366f1 100%)' }}>
                <div className="fw-bold">Consejo</div>
                <div className="mt-2">Usa las reseñas para recordar detalles clave y decidir tus próximos juegos.</div>
                <div className="mt-3 d-flex gap-2">
                  <a href="/agregar" className="btn btn-light">Agregar juego</a>
                  <a href="/reseñas" className="btn btn-outline-light">Crear reseña</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;