import React, { useState } from 'react';
import { Button, Card, ProgressBar, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createGame, getGames } from '../services/gameService';
import { createReview } from '../services/reviewService';

const CargarEjemplos = ({ userId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const juegos = [
    { title:"Baldur's Gate 3", platform:"PC", genre:"RPG", releaseYear:2023, developer:"Larian Studios", publisher:"Larian Studios", coverImage:"https://m.media-amazon.com/images/I/71hamNT8AHL._AC_SL1024_.jpg", completed:false, hoursPlayed:0, rating:5 },
    { title:"Elden Ring", platform:"PC", genre:"RPG", releaseYear:2022, developer:"FromSoftware", publisher:"Bandai Namco", coverImage:"https://m.media-amazon.com/images/I/81F50NvHqLL._AC_SL1500_.jpg", completed:false, hoursPlayed:0, rating:5 },
    { title:"Helldivers 2", platform:"PC", genre:"Shooter", releaseYear:2024, developer:"Arrowhead", publisher:"PlayStation", coverImage:"https://m.media-amazon.com/images/I/81iT0ewqf3L._AC_SL1500_.jpg", completed:false, hoursPlayed:0, rating:4 },
    { title:"Fortnite", platform:"PC", genre:"Battle Royale", releaseYear:2017, developer:"Epic Games", publisher:"Epic Games", coverImage:"https://m.media-amazon.com/images/I/81wVgAqOclL._AC_SL1500_.jpg", completed:false, hoursPlayed:0, rating:4 },
    { title:"Minecraft", platform:"PC", genre:"Sandbox", releaseYear:2011, developer:"Mojang Studios", publisher:"Mojang Studios", coverImage:"https://m.media-amazon.com/images/I/81AKnF9JeSL._AC_SL1500_.jpg", completed:false, hoursPlayed:0, rating:5 },
    { title:"Cyberpunk 2077: Phantom Liberty", platform:"PC", genre:"RPG", releaseYear:2023, developer:"CD Projekt Red", publisher:"CD Projekt", coverImage:"https://m.media-amazon.com/images/I/81GvxO+2qPL._AC_SL1500_.jpg", completed:false, hoursPlayed:0, rating:4 },
    { title:"Call of Duty: Warzone", platform:"PC", genre:"Battle Royale", releaseYear:2020, developer:"Infinity Ward", publisher:"Activision", coverImage:"https://m.media-amazon.com/images/I/81o1K0QH8AL._AC_SL1500_.jpg", completed:false, hoursPlayed:0, rating:4 },
    { title:"Apex Legends", platform:"PC", genre:"Battle Royale", releaseYear:2019, developer:"Respawn", publisher:"Electronic Arts", coverImage:"https://m.media-amazon.com/images/I/81KMHq2LbYL._AC_SL1500_.jpg", completed:false, hoursPlayed:0, rating:4 },
    { title:"Grand Theft Auto V", platform:"PC", genre:"Action", releaseYear:2013, developer:"Rockstar North", publisher:"Rockstar Games", coverImage:"https://m.media-amazon.com/images/I/81QpvwYfwdL._AC_SL1500_.jpg", completed:false, hoursPlayed:0, rating:5 },
    { title:"Starfield", platform:"PC", genre:"RPG", releaseYear:2023, developer:"Bethesda", publisher:"Bethesda", coverImage:"https://m.media-amazon.com/images/I/71yP9tj2QCL._AC_SL1024_.jpg", completed:false, hoursPlayed:0, rating:3 },
    { title:"Red Dead Redemption 2", platform:"PC", genre:"Action", releaseYear:2018, developer:"Rockstar Games", publisher:"Rockstar Games", coverImage:"https://m.media-amazon.com/images/I/81c1b3eM8hL._AC_SL1500_.jpg", completed:false, hoursPlayed:0, rating:5 },
    { title:"The Witcher 3: Wild Hunt", platform:"PC", genre:"RPG", releaseYear:2015, developer:"CD Projekt Red", publisher:"CD Projekt", coverImage:"https://m.media-amazon.com/images/I/81kPNQn2JtL._AC_SL1500_.jpg", completed:false, hoursPlayed:0, rating:5 },
    { title:"God of War", platform:"PC", genre:"Action", releaseYear:2018, developer:"Santa Monica Studio", publisher:"PlayStation", coverImage:"https://m.media-amazon.com/images/I/81b3xM8w2wL._AC_SL1500_.jpg", completed:false, hoursPlayed:0, rating:5 },
    { title:"Horizon Zero Dawn", platform:"PC", genre:"Action", releaseYear:2017, developer:"Guerrilla Games", publisher:"PlayStation", coverImage:"https://m.media-amazon.com/images/I/81QGQkCwYQL._AC_SL1500_.jpg", completed:false, hoursPlayed:0, rating:4 },
    { title:"The Legend of Zelda: Breath of the Wild", platform:"Switch", genre:"Adventure", releaseYear:2017, developer:"Nintendo", publisher:"Nintendo", coverImage:"https://m.media-amazon.com/images/I/81HG4wQkYCL._AC_SL1500_.jpg", completed:false, hoursPlayed:0, rating:5 }
  ];

  const reseñas = [
    { title:'Excelente', content:'Gran experiencia, muy recomendado.', rating:5 },
    { title:'Bueno', content:'Divertido, con algunos detalles a mejorar.', rating:4 }
  ];

  const cargar = async () => {
    try {
      setLoading(true);
      setMessage('');
      const existentesResp = await getGames(userId);
      const existentes = existentesResp.data.map(g => g.title.toLowerCase());
      let creados = 0;

      for (let i = 0; i < juegos.length; i++) {
        const j = juegos[i];
        if (existentes.includes(j.title.toLowerCase())) {
          setProgress(Math.round(((i + 1) / juegos.length) * 100));
          continue;
        }

        const nuevo = { ...j, userId };
        const gameResp = await createGame(nuevo);
        const game = gameResp.data;

        for (const r of reseñas) {
          await createReview({ ...r, gameId: game._id, userId });
        }

        creados++;
        setProgress(Math.round(((i + 1) / juegos.length) * 100));
      }

      setMessage(`Cargados ${creados} juegos y ${creados * reseñas.length} reseñas`);
      navigate('/juegos');
    } catch (e) {
      setMessage('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Cargar Juegos de Ejemplo</h2>
      <Card className="p-3">
        <Button onClick={cargar} disabled={loading} variant="primary">
          {loading ? 'Cargando...' : 'Cargar 15 juegos y reseñas'}
        </Button>
        <div className="mt-3">
          <ProgressBar now={progress} label={`${progress}%`} animated striped />
        </div>
        {message && <Alert className="mt-3" variant="info">{message}</Alert>}
      </Card>
    </div>
  );
};

export default CargarEjemplos;