import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import BibliotecaJuegos from './pages/BibliotecaJuegos';
import DetalleJuego from './pages/DetalleJuego';
import AgregarJuego from './pages/AgregarJuego';
import EditarJuego from './pages/EditarJuego';
import Reseñas from './pages/Reseñas';
import Estadisticas from './pages/Estadisticas';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL || '/'}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/biblioteca" element={<BibliotecaJuegos />} />
        <Route path="/juego/:id" element={<DetalleJuego />} />
        <Route path="/agregar" element={<AgregarJuego />} />
        <Route path="/editar/:id" element={<EditarJuego />} />
        <Route path="/reseñas" element={<Reseñas />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
