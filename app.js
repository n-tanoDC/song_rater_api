const express = require('express');
const mongoose = require('mongoose');
const AdminBro = require ('./.adminbro/admin');
const routes = require('./routes');

const app = express();
const port = 8000;

app.use(AdminBro.admin.options.rootPath, AdminBro.router)
app.use('/', routes);

mongoose.connect('mongodb://localhost:27017/song_rater', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.once('open', () => app.listen(port, () => console.log('Server started on port ' + port)));