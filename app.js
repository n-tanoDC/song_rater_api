require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const AdminBro = require ('./.adminbro/admin');
const routes = require('./routes');

const app = express();

const hostname = 'localhost';
const port = 8000;
const db_host = process.env.DB_HOST;
const db_port = process.env.DB_PORT;
const db_name = process.env.DB_NAME;

app.use(AdminBro.admin.options.rootPath, AdminBro.router);
app.use(helmet());
app.use('/', routes);

mongoose.connect('mongodb://' + db_host + ':' + db_port + '/' + db_name, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const db = mongoose.connection;
db.once('open', () => app.listen(port, hostname, () => console.log('Server started at http://' + hostname + ':' + port)));