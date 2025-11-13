import React from 'react';
import EstadisticasPersonales from '../components/stats/EstadisticasPersonales';
import ResumenGeneral from '../components/stats/ResumenGeneral';
import GraficoPlataformas from '../components/stats/GraficoPlataformas';

const Estadisticas = () => {
  return (
    <div className="page">
      <h1>Estadísticas</h1>
      <EstadisticasPersonales />
      <ResumenGeneral />
      <GraficoPlataformas />
    </div>
  );
};

export default Estadisticas;