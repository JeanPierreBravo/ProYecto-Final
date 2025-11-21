import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { getReviews, deleteReview } from '../services/reviewService';
import { getGames } from '../services/gameService';

const ListaReseñas = ({ userId }) => {
  const [reviews, setReviews] = useState([]);
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviewsResponse = await getReviews({ userId });
        const gamesResponse = await getGames(userId);
        
        setReviews(reviewsResponse.data);
        setGames(gamesResponse.data);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const filtered = reviews.filter(review => {
      const isObj = review.gameId && typeof review.gameId === 'object';
      const reviewGameId = isObj ? (review.gameId?._id || null) : review.gameId;
      const fromReviewTitle = isObj ? (review.gameId?.title || '') : '';
      const game = reviewGameId ? games.find(g => g._id === reviewGameId) : null;
      const gameTitle = ((game && game.title) || fromReviewTitle || '').toLowerCase();

      return (
        (review.title || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
        (review.content || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
        gameTitle.includes((searchTerm || '').toLowerCase())
      );
    });

    setFilteredReviews(filtered);
  }, [reviews, games, searchTerm]);

  const handleDeleteReview = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
      try {
        await deleteReview(id, userId);
        setReviews(reviews.filter(review => review._id !== id));
      } catch (error) {
        console.error('Error al eliminar la reseña:', error);
      }
    }
  };

  const getGameTitle = (review) => {
    const isObj = review.gameId && typeof review.gameId === 'object';
    if (isObj) {
      return review.gameId?.title || 'Juego eliminado';
    }
    const game = games.find(g => g._id === review.gameId);
    return game ? game.title : 'Juego eliminado';
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Mis Reseñas</h2>
      
      <InputGroup className="mb-4">
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          placeholder="Buscar reseñas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>
      
      {filteredReviews.length === 0 ? (
        <p className="text-center">No se encontraron reseñas.</p>
      ) : (
        <Row>
          {filteredReviews.map(review => (
            <Col md={6} lg={4} key={review._id} className="mb-4">
              <Card className="h-100">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    {(() => {
                      const isObj = review.gameId && typeof review.gameId === 'object';
                      const targetId = isObj ? (review.gameId?._id || null) : review.gameId;
                      const href = targetId ? `/juegos/${targetId}` : '/juegos';
                      return (
                        <Link to={href} className="text-decoration-none">
                          {getGameTitle(review)}
                        </Link>
                      );
                    })()}
                    <div className="star-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} color={i < review.rating ? "#ffc107" : "#e4e5e9"} size={14} />
                      ))}
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Card.Title>{review.title}</Card.Title>
                  <Card.Text>{review.content}</Card.Text>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </small>
                  <div>
                    <Link to={`/editar-reseña/${review._id}`} className="btn btn-sm btn-outline-primary me-2">
                      <FaEdit />
                    </Link>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteReview(review._id)}>
                      <FaTrash />
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ListaReseñas;

