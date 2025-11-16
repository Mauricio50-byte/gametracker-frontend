import React from 'react';
import FormularioJuego from '../components/games/FormularioJuego';

const AgregarJuego = () => {
  return (
    <div>
      <section className="py-4 text-white" style={{ backgroundImage: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 fw-bold m-0">Agregar Juego</h1>
              <div className="mt-2">Completa los campos, sube la portada y guarda tu juego en la biblioteca.</div>
            </div>
            <a href="/biblioteca" className="btn btn-light">Volver a la biblioteca</a>
          </div>
        </div>
      </section>
      <section className="py-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-body">
                  <FormularioJuego />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="fw-semibold mb-2">Recomendaciones</div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">Usa títulos claros y sin abreviaciones innecesarias</li>
                    <li className="list-group-item">Selecciona la plataforma y género correctos</li>
                    <li className="list-group-item">La portada se comprime en base64 automáticamente</li>
                    <li className="list-group-item">Puedes actualizar los datos más tarde desde la biblioteca</li>
                  </ul>
                  <div className="mt-3">
                    <div className="fw-semibold mb-1">Formato de portada</div>
                    <div className="text-muted">PNG o JPG recomendados. Tamaño sugerido: hasta 600px.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AgregarJuego;