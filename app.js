require('dotenv').config({ path: './.env.local'});

const express = require('express');
const helmet = require('helmet');
const AdminBro = require ('./.adminbro/admin');
const routes = require('./routes');

const app = express();

app.use(AdminBro.admin.options.rootPath, AdminBro.router);
app.use(helmet());
app.use('/', routes);

module.exports = app;