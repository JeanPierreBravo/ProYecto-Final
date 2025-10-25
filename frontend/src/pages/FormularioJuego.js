import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameById, createGame, updateGame } from '../services/gameService';

const FormularioJuego = ({ userId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [validated, setValidated] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    platform: '',
    genre: '',
    releaseYear: new Date().getFullYear(),
    developer: '',
    publisher: '',
    coverImage: '',
    completed: false,
    hoursPlayed: 0,
    rating: 0,
    userId: userId
  });

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadGame();
    }
  }, [id]);

  const loadGame = async () => {
    try {
      const response = await getGameById(id);
      setFormData(response.data);
    } catch (error) {
      console.error('Error al cargar el juego:', error);
      navigate('/juegos');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      if (isEditing) {
        await updateGame(id, formData);
      } else {
        await createGame(formData);
      }
      navigate('/juegos');
    } catch (error) {
      console.error('Error al guardar el juego:', error);
    }
  };

  return (
    <div>
      <h1>{isEditing ? 'Editar Juego' : 'Agregar Nuevo Juego'}</h1>
      <Card className="mt-3">
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa el título del juego.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Plataforma</Form.Label>
              <Form.Control
                type="text"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa la plataforma.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Género</Form.Label>
              <Form.Control
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa el género.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Año de lanzamiento</Form.Label>
              <Form.Control
                type="number"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleChange}
                required
                min="1970"
                max={new Date().getFullYear() + 5}
              />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa un año válido.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Desarrollador</Form.Label>
              <Form.Control
                type="text"
                name="developer"
                value={formData.developer}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa el desarrollador.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Distribuidor</Form.Label>
              <Form.Control
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa el distribuidor.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL de la imagen de portada</Form.Label>
              <Form.Control
                type="text"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              <Form.Text className="text-muted">
                Opcional: URL de la imagen de portada del juego.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Horas jugadas</Form.Label>
              <Form.Control
                type="number"
                name="hoursPlayed"
                value={formData.hoursPlayed}
                onChange={handleChange}
                min="0"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Puntuación (0-5)</Form.Label>
              <Form.Control
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.5"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Juego completado"
                name="completed"
                checked={formData.completed}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate('/juegos')}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {isEditing ? 'Actualizar Juego' : 'Agregar Juego'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FormularioJuego;