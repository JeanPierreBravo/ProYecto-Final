import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaGamepad, FaClock, FaStar, FaTrophy } from 'react-icons/fa';
import { getGames } from '../services/gameService';
import { getReviews } from '../services/reviewService';

const EstadisticasPersonales = ({ userId }) => {
  const [stats, setStats] = useState({
    totalGames: 0,
    completedGames: 0,
    totalHours: 0,
    averageRating: 0,
    favoriteGenre: '',
    favoritePlatform: '',
    totalReviews: 0
  });

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    try {
      // Cargar juegos
      const gamesResponse = await getGames(userId);
      const games = gamesResponse.data;
      
      // Cargar reseñas
      const reviewsResponse = await getReviews({ userId });
      const reviews = reviewsResponse.data;
      
      // Calcular estadísticas
      const totalGames = games.length;
      const completedGames = games.filter(game => game.completed).length;
      const totalHours = games.reduce((sum, game) => sum + game.hoursPlayed, 0);
      
      // Calcular puntuación media
      const totalRating = games.reduce((sum, game) => sum + game.rating, 0);
      const averageRating = totalGames > 0 ? (totalRating / totalGames).toFixed(1) : 0;
      
      // Encontrar género favorito
      const genreCounts = {};
      games.forEach(game => {
        genreCounts[game.genre] = (genreCounts[game.genre] || 0) + 1;
      });
      
      // Encontrar plataforma favorita
      const platformCounts = {};
      games.forEach(game => {
        platformCounts[game.platform] = (platformCounts[game.platform] || 0) + 1;
      });
      
      // Obtener el género y plataforma más frecuentes
      const favoriteGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
      const favoritePlatform = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
      
      setStats({
        totalGames,
        completedGames,
        totalHours,
        averageRating,
        favoriteGenre,
        favoritePlatform,
        totalReviews: reviews.length
      });
      
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  return (
    <div>
      <h1 className="mb-4">Mis Estadísticas</h1>
      
      <Row>
        <Col md={3} sm={6} className="mb-4">
          <Card className="stats-card h-100">
            <Card.Body className="d-flex align-items-center">
              <FaGamepad className="me-3" size={30} color="#007bff" />
              <div>
                <h3 className="mb-0">{stats.totalGames}</h3>
                <p className="text-muted mb-0">Juegos en biblioteca</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-4">
          <Card className="stats-card h-100">
            <Card.Body className="d-flex align-items-center">
              <FaTrophy className="me-3" size={30} color="#28a745" />
              <div>
                <h3 className="mb-0">{stats.completedGames}</h3>
                <p className="text-muted mb-0">Juegos completados</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-4">
          <Card className="stats-card h-100">
            <Card.Body className="d-flex align-items-center">
              <FaClock className="me-3" size={30} color="#dc3545" />
              <div>
                <h3 className="mb-0">{stats.totalHours}</h3>
                <p className="text-muted mb-0">Horas jugadas</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-4">
          <Card className="stats-card h-100">
            <Card.Body className="d-flex align-items-center">
              <FaStar className="me-3" size={30} color="#ffc107" />
              <div>
                <h3 className="mb-0">{stats.averageRating}</h3>
                <p className="text-muted mb-0">Puntuación media</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-4">
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Header>Género favorito</Card.Header>
            <Card.Body>
              <h4>{stats.favoriteGenre}</h4>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Header>Plataforma favorita</Card.Header>
            <Card.Body>
              <h4>{stats.favoritePlatform}</h4>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Header>Reseñas escritas</Card.Header>
            <Card.Body>
              <h4>{stats.totalReviews}</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <div className="text-center mt-4">
        <p className="text-muted">
          Estas estadísticas se basan en los datos de tu biblioteca personal.
          Agrega más juegos y reseñas para obtener estadísticas más precisas.
        </p>
      </div>
    </div>
  );
};

export default EstadisticasPersonales;