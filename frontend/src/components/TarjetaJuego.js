import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const TarjetaJuego = ({ game, onDelete }) => {
  // Renderiza estrellas según la puntuación
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? 
          <FaStar key={i} className="star-rating" /> : 
          <FaRegStar key={i} className="star-rating" />
      );
    }
    return stars;
  };

  return (
    <Card className="game-card">
      {game.completed && (
        <Badge bg="success" className="completed-badge">Completado</Badge>
      )}
      <div className="position-relative overflow-hidden">
        <Card.Img 
          variant="top" 
          src={game.coverImage || 'https://via.placeholder.com/300x200?text=Sin+Imagen'} 
          className="game-cover" 
          alt={game.title} 
        />
        <div className="position-absolute bottom-0 start-0 w-100 p-2" 
             style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-white">{game.releaseYear}</small>
            <small className="text-white">{game.hoursPlayed} hrs</small>
          </div>
        </div>
      </div>
      <Card.Body>
        <Card.Title>{game.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{game.platform}</Card.Subtitle>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <small className="badge bg-secondary">{game.genre}</small>
          <small>{game.developer}</small>
        </div>
        <div className="mb-3">
          {renderStars(game.rating)}
        </div>
        <div className="d-flex justify-content-between">
          <Link to={`/juegos/${game._id}`} className="btn btn-primary btn-sm">
            <FaEye className="me-1" /> Ver
          </Link>
          <Link to={`/editar-juego/${game._id}`} className="btn btn-warning btn-sm">
            <FaEdit className="me-1" /> Editar
          </Link>
          <Button variant="danger" size="sm" onClick={() => onDelete(game._id)}>
            <FaTrash className="me-1" /> Eliminar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TarjetaJuego;

