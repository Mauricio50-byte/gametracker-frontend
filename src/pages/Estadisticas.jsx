import React from 'react';
import EstadisticasPersonales from '../components/stats/EstadisticasPersonales';
import ResumenGeneral from '../components/stats/ResumenGeneral';
import GraficoPlataformas from '../components/stats/GraficoPlataformas';
import GraficoGeneros from '../components/stats/GraficoGeneros';

const Estadisticas = () => {
  return (
    <div className="page">
      <h1>Estadísticas</h1>
      <EstadisticasPersonales />
      <ResumenGeneral />
      <GraficoPlataformas />
      <GraficoGeneros />
    </div>
  );
};

export default Estadisticas;