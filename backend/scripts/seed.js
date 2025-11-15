const mongoose = require('mongoose');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Game = require('../models/game.model');
const Review = require('../models/review.model');

async function connect() {
  const atlasUri = process.env.ATLAS_URI;
  const localUri = 'mongodb://127.0.0.1:27017/gametracker';
  if (atlasUri) {
    try {
      await mongoose.connect(atlasUri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Seed: connected to Atlas');
      return null;
    } catch (e) { console.log('Seed: Atlas failed, trying local:', e.message); }
  }
  try {
    await mongoose.connect(localUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Seed: connected to local MongoDB');
    return null;
  } catch (e) { console.log('Seed: local failed, starting memory:', e.message); }

  const mongod = await MongoMemoryServer.create({
    instance: { dbPath: path.join(__dirname, '..', '.data', 'mongo'), storageEngine: 'wiredTiger' }
  });
  const memUri = mongod.getUri();
  await mongoose.connect(memUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Seed: connected to in-memory persistent MongoDB');
  return mongod;
}

async function run() {
  const mongod = await connect();
  const userId = 'user123';

  const games = [
    { title:"Baldur's Gate 3", platform:"PC", genre:"RPG", releaseYear:2023, developer:"Larian Studios", publisher:"Larian Studios", coverImage:"https://m.media-amazon.com/images/I/71hamNT8AHL._AC_SL1024_.jpg", completed:false, hoursPlayed:20, rating:5, userId },
    { title:"Elden Ring", platform:"PC", genre:"RPG", releaseYear:2022, developer:"FromSoftware", publisher:"Bandai Namco", coverImage:"https://m.media-amazon.com/images/I/81F50NvHqLL._AC_SL1500_.jpg", completed:false, hoursPlayed:25, rating:5, userId },
    { title:"Helldivers 2", platform:"PC", genre:"Shooter", releaseYear:2024, developer:"Arrowhead Game Studios", publisher:"PlayStation", coverImage:"https://m.media-amazon.com/images/I/81iT0ewqf3L._AC_SL1500_.jpg", completed:false, hoursPlayed:15, rating:4, userId },
    { title:"Fortnite", platform:"PC", genre:"Battle Royale", releaseYear:2017, developer:"Epic Games", publisher:"Epic Games", coverImage:"https://m.media-amazon.com/images/I/81wVgAqOclL._AC_SL1500_.jpg", completed:false, hoursPlayed:10, rating:4, userId },
    { title:"Minecraft", platform:"PC", genre:"Sandbox", releaseYear:2011, developer:"Mojang Studios", publisher:"Mojang Studios", coverImage:"https://m.media-amazon.com/images/I/81AKnF9JeSL._AC_SL1500_.jpg", completed:false, hoursPlayed:50, rating:5, userId },
    { title:"Cyberpunk 2077: Phantom Liberty", platform:"PC", genre:"RPG", releaseYear:2023, developer:"CD Projekt Red", publisher:"CD Projekt", coverImage:"https://m.media-amazon.com/images/I/81GvxO+2qPL._AC_SL1500_.jpg", completed:false, hoursPlayed:15, rating:4, userId },
    { title:"Call of Duty: Warzone", platform:"PC", genre:"Battle Royale", releaseYear:2020, developer:"Infinity Ward", publisher:"Activision", coverImage:"https://m.media-amazon.com/images/I/81o1K0QH8AL._AC_SL1500_.jpg", completed:false, hoursPlayed:25, rating:4, userId },
    { title:"Apex Legends", platform:"PC", genre:"Battle Royale", releaseYear:2019, developer:"Respawn Entertainment", publisher:"Electronic Arts", coverImage:"https://m.media-amazon.com/images/I/81KMHq2LbYL._AC_SL1500_.jpg", completed:false, hoursPlayed:30, rating:4, userId },
    { title:"Grand Theft Auto V", platform:"PC", genre:"Action", releaseYear:2013, developer:"Rockstar North", publisher:"Rockstar Games", coverImage:"https://m.media-amazon.com/images/I/81QpvwYfwdL._AC_SL1500_.jpg", completed:false, hoursPlayed:40, rating:5, userId },
    { title:"Starfield", platform:"PC", genre:"RPG", releaseYear:2023, developer:"Bethesda Game Studios", publisher:"Bethesda Softworks", coverImage:"https://m.media-amazon.com/images/I/71yP9tj2QCL._AC_SL1024_.jpg", completed:false, hoursPlayed:12, rating:3, userId },
    { title:"Red Dead Redemption 2", platform:"PC", genre:"Action", releaseYear:2018, developer:"Rockstar Games", publisher:"Rockstar Games", coverImage:"https://m.media-amazon.com/images/I/81c1b3eM8hL._AC_SL1500_.jpg", completed:false, hoursPlayed:0, rating:5, userId },
    { title:"The Witcher 3: Wild Hunt", platform:"PC", genre:"RPG", releaseYear:2015, developer:"CD Projekt Red", publisher:"CD Projekt", coverImage:"https://m.media-amazon.com/images/I/81kPNQn2JtL._AC_SL1500_.jpg", completed:false, hoursPlayed:0, rating:5, userId },
    { title:"God of War", platform:"PC", genre:"Action", releaseYear:2018, developer:"Santa Monica Studio", publisher:"PlayStation", coverImage:"https://m.media-amazon.com/images/I/81b3xM8w2wL._AC_SL1500_.jpg", completed:false, hoursPlayed:0, rating:5, userId },
    { title:"Horizon Zero Dawn", platform:"PC", genre:"Action", releaseYear:2017, developer:"Guerrilla Games", publisher:"PlayStation", coverImage:"https://m.media-amazon.com/images/I/81QGQkCwYQL._AC_SL1500_.jpg", completed:false, hoursPlayed:0, rating:4, userId },
    { title:"The Legend of Zelda: Breath of the Wild", platform:"Switch", genre:"Adventure", releaseYear:2017, developer:"Nintendo", publisher:"Nintendo", coverImage:"https://m.media-amazon.com/images/I/81HG4wQkYCL._AC_SL1500_.jpg", completed:false, hoursPlayed:0, rating:5, userId }
  ];

  const createdGames = await Game.insertMany(games);
  const reviewPairs = [
    { title:'Excelente', content:'Gran experiencia, muy recomendado.', rating:5 },
    { title:'Bueno', content:'Divertido, con algunos detalles a mejorar.', rating:4 }
  ];

  const reviews = [];
  for (const g of createdGames) {
    for (const rp of reviewPairs) {
      reviews.push({ gameId: g._id, userId, title: rp.title, content: rp.content, rating: rp.rating });
    }
  }
  await Review.insertMany(reviews);
  console.log(`Seed complete: games=${createdGames.length}, reviews=${reviews.length}`);

  if (mongod) {
    await mongoose.connection.close();
    await mongod.stop();
  } else {
    await mongoose.connection.close();
  }
}

run().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});