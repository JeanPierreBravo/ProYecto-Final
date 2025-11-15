import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Componentes
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas
import BibliotecaJuegos from './pages/BibliotecaJuegos';
import DetalleJuego from './pages/DetalleJuego';
import FormularioJuego from './pages/FormularioJuego';
import ListaReseñas from './pages/ListaReseñas';
import FormularioReseña from './pages/FormularioReseña';
import EstadisticasPersonales from './pages/EstadisticasPersonales';
import CargarEjemplos from './pages/CargarEjemplos';

function App() {
  // Simulamos un ID de usuario (en una aplicación real usarías autenticación)
  const userId = "user123";

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<BibliotecaJuegos userId={userId} />} />
            <Route path="/juegos" element={<BibliotecaJuegos userId={userId} />} />
            <Route path="/juegos/:id" element={<DetalleJuego userId={userId} />} />
            <Route path="/agregar-juego" element={<FormularioJuego userId={userId} />} />
            <Route path="/editar-juego/:id" element={<FormularioJuego userId={userId} />} />
            <Route path="/reseñas" element={<ListaReseñas userId={userId} />} />
            <Route path="/agregar-reseña/:gameId" element={<FormularioReseña userId={userId} />} />
            <Route path="/editar-reseña/:id" element={<FormularioReseña userId={userId} />} />
            <Route path="/estadisticas" element={<EstadisticasPersonales userId={userId} />} />
            <Route path="/cargar-ejemplos" element={<CargarEjemplos userId={userId} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;