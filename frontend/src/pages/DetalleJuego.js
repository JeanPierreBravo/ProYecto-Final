import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { FaStar, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { getGameById } from '../services/gameService';
import { getReviews, deleteReview } from '../services/reviewService';

const DetalleJuego = ({ userId }) => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameAndReviews = async () => {
      try {
        const gameResponse = await getGameById(id);
        setGame(gameResponse.data);
        
        const reviewsResponse = await getReviews({ gameId: id });
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameAndReviews();
  }, [id]);

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
      try {
        await deleteReview(reviewId, userId);
        setReviews(reviews.filter(review => review._id !== reviewId));
      } catch (error) {
        console.error('Error al eliminar la reseña:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  if (!game) {
    return <div className="text-center mt-5">Juego no encontrado</div>;
  }

  return (
    <div className="game-detail">
      <Row>
        <Col md={4}>
          <Card className="game-card mb-4">
            <Card.Img variant="top" src={game.coverImage || 'https://via.placeholder.com/300x450'} className="game-cover" />
            {game.completed && (
              <div className="completed-badge">
                <Badge bg="success">Completado</Badge>
              </div>
            )}
          </Card>
          <div className="d-grid gap-2">
            <Link to={`/editar-juego/${game._id}`} className="btn btn-primary">
              <FaEdit /> Editar Juego
            </Link>
            <Link to={`/agregar-reseña/${game._id}`} className="btn btn-success">
              <FaPlus /> Añadir Reseña
            </Link>
          </div>
        </Col>
        <Col md={8}>
          <h2>{game.title}</h2>
          <p className="text-muted">{game.platform} | {game.genre} | {game.releaseYear}</p>
          
          <div className="mb-3">
            <strong>Calificación:</strong> 
            <div className="star-rating">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} color={i < game.rating ? "#ffc107" : "#e4e5e9"} />
              ))}
              <span className="ms-2">{game.rating}/5</span>
            </div>
          </div>
          
          <div className="mb-3">
            <strong>Estado:</strong> {game.completed ? 'Completado' : 'Pendiente'}
          </div>
          
          <div className="mb-4">
            <strong>Descripción:</strong>
            <p>{game.description}</p>
          </div>
          
          <h3 className="mt-4">Reseñas</h3>
          {reviews.length === 0 ? (
            <p>No hay reseñas para este juego.</p>
          ) : (
            reviews.map(review => (
              <Card key={review._id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="star-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} color={i < review.rating ? "#ffc107" : "#e4e5e9"} />
                      ))}
                      <span className="ms-2">{review.rating}/5</span>
                    </div>
                    <div>
                      <Link to={`/editar-reseña/${review._id}`} className="btn btn-sm btn-outline-primary me-2">
                        <FaEdit />
                      </Link>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteReview(review._id)}>
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                  <Card.Title>{review.title}</Card.Title>
                  <Card.Text>{review.content}</Card.Text>
                  <Card.Text className="text-muted small">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </div>
  );
};

export default DetalleJuego;