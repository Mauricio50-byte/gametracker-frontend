import React from 'react';
import EstadisticasPersonales from '../components/stats/EstadisticasPersonales';
import ResumenGeneral from '../components/stats/ResumenGeneral';
import GraficoPlataformas from '../components/stats/GraficoPlataformas';
import GraficoGeneros from '../components/stats/GraficoGeneros';

const Estadisticas = () => {
  return (
    <div>
      <section className="py-4 text-white" style={{ backgroundImage: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)' }}>
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 fw-bold m-0">Estadísticas</h1>
            <div className="mt-2">Resumen general, métricas personales y gráficos</div>
          </div>
          <a href="/biblioteca" className="btn btn-light">Volver a la biblioteca</a>
        </div>
      </section>

      <section className="py-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card mb-3">
                <div className="card-header">Resumen general</div>
                <div className="card-body">
                  <ResumenGeneral />
                </div>
              </div>
              <div className="row g-4">
                <div className="col-md-6">
                  <GraficoPlataformas />
                </div>
                <div className="col-md-6">
                  <GraficoGeneros />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card h-100">
                <div className="card-header">Estadísticas personales</div>
                <div className="card-body">
                  <EstadisticasPersonales />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Estadisticas;