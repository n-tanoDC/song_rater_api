const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 8000;

app.get('/', async (req, res) => {
  res.send('Hello world!');
});

mongoose.connect('mongodb://localhost:27017/song_rater', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.once('open', () => app.listen(port));