const app = require('./app');
const Mongoose = require('mongoose');

const port = 8000;

const { DB_HOST, DB_PORT, DB_NAME } = process.env;

Mongoose.connect('mongodb://' + DB_HOST + ':' + DB_PORT + '/' + DB_NAME, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

Mongoose.connection.once('open', () => app.listen(port, () => console.log('Server started at http://localhost:' + port)));