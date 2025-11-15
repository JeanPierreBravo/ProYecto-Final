const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB con fallback en memoria
async function connectDB() {
  const atlasUri = process.env.ATLAS_URI;
  const localUri = 'mongodb://127.0.0.1:27017/gametracker';

  if (atlasUri) {
    try {
      await mongoose.connect(atlasUri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('MongoDB Atlas connection established successfully');
      return;
    } catch (err) {
      console.log('Error connecting to MongoDB Atlas:', err.message);
    }
  }

  try {
    await mongoose.connect(localUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Local MongoDB connection established successfully');
    return;
  } catch (err) {
    console.log('Error connecting to local MongoDB:', err.message);
  }

  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create({
      instance: {
        dbPath: path.join(__dirname, '.data', 'mongo'),
        storageEngine: 'wiredTiger'
      }
    });
    const memUri = mongod.getUri();
    await mongoose.connect(memUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to in-memory MongoDB');

    const gracefulExit = async () => {
      await mongoose.connection.close();
      await mongod.stop();
      process.exit(0);
    };
    process.on('SIGINT', gracefulExit);
    process.on('SIGTERM', gracefulExit);
  } catch (memErr) {
    console.log('Failed to start in-memory MongoDB:', memErr);
    process.exit(1);
  }
}
connectDB();

// Rutas
const gamesRouter = require('./routes/games');
const reviewsRouter = require('./routes/reviews');

app.use('/api/games', gamesRouter);
app.use('/api/reviews', reviewsRouter);

app.get('/logo.png', (req, res) => {
  const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+oRrEAAAAASUVORK5CYII=';
  const buffer = Buffer.from(base64, 'base64');
  res.set('Content-Type', 'image/png');
  res.send(buffer);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


