const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const uri = process.env.ATLAS_URI || 'mongodb://localhost:27017/gametracker';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connection established successfully'))
.catch(err => console.log('Error connecting to MongoDB: ' + err));

// Rutas
const gamesRouter = require('./routes/games');
const reviewsRouter = require('./routes/reviews');

app.use('/api/games', gamesRouter);
app.use('/api/reviews', reviewsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});