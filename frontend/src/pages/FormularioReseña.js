import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { createReview, getReviewById, updateReview } from '../services/reviewService';
import { getGameById } from '../services/gameService';

const FormularioReseña = ({ userId }) => {
  const { id, gameId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 0,
    gameId: '',
    userId: userId
  });

  const [errors, setErrors] = useState({});
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Si tenemos un ID de reseña, estamos editando
        if (id) {
          const reviewResponse = await getReviewById(id);
          const review = reviewResponse.data;
          
          setFormData({
            title: review.title,
            content: review.content,
            rating: review.rating,
            gameId: review.gameId,
            userId: userId
          });
          
          // Cargar información del juego
          const gameResponse = await getGameById(review.gameId);
          setGame(gameResponse.data);
        } 
        // Si tenemos un gameId, estamos creando una reseña para un juego específico
        else if (gameId) {
          setFormData(prev => ({ ...prev, gameId }));
          
          // Cargar información del juego
          const gameResponse = await getGameById(gameId);
          setGame(gameResponse.data);
        }
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, gameId, userId]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'El título es obligatorio';
    if (!formData.content.trim()) newErrors.content = 'El contenido es obligatorio';
    if (formData.rating === 0) newErrors.rating = 'Debes seleccionar una calificación';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (id) {
        await updateReview(id, formData);
      } else {
        await createReview(formData);
      }
      
      navigate('/reseñas');
    } catch (error) {
      console.error('Error al guardar la reseña:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  return (
    <div>
      <h2 className="mb-4">{id ? 'Editar Reseña' : 'Nueva Reseña'}</h2>
      
      {game && (
        <Card className="mb-4">
          <Card.Body className="d-flex">
            <img 
              src={game.imageUrl || 'https://via.placeholder.com/100x150'} 
              alt={game.title} 
              style={{ width: '100px', height: '150px', objectFit: 'cover' }}
              className="me-3"
            />
            <div>
              <h4>{game.title}</h4>
              <p className="text-muted">{game.platform} | {game.genre} | {game.releaseYear}</p>
            </div>
          </Card.Body>
        </Card>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Título</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            isInvalid={!!errors.title}
          />
          <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Calificación</Form.Label>
          <div className="star-rating mb-2">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              
              return (
                <FaStar
                  key={index}
                  size={30}
                  onClick={() => handleRatingClick(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                  color={ratingValue <= (hover || formData.rating) ? "#ffc107" : "#e4e5e9"}
                  style={{ cursor: 'pointer', marginRight: '5px' }}
                />
              );
            })}
          </div>
          {errors.rating && <div className="text-danger">{errors.rating}</div>}
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Contenido</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            name="content"
            value={formData.content}
            onChange={handleChange}
            isInvalid={!!errors.content}
          />
          <Form.Control.Feedback type="invalid">{errors.content}</Form.Control.Feedback>
        </Form.Group>
        
        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button variant="primary" type="submit">
            {id ? 'Actualizar' : 'Crear'} Reseña
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormularioReseña;

