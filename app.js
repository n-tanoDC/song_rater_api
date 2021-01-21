require('dotenv').config({ path: './.env.local'});

const express = require('express');
const helmet = require('helmet');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const AdminBro = require ('./.adminbro/admin');
const routes = require('./routes');

const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SongRater API",
      version: "0.0.1",
      description: 'Backend for SongRater app',
      contact: {
        name: 'NicolasT',
      },
    },
    servers: [
      {
        url: "http://localhost:8000/",
      },
    ],
  },
  apis: ['./routes/index.js', './routes/reviews.js', './routes/auth.js'],
};

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));
app.use(AdminBro.admin.options.rootPath, AdminBro.router);
app.use(helmet());
app.use('/', routes);

module.exports = app;