const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');

const Review = require('../models/Review')
const User = require('../models/User')
const List = require('../models/List')

AdminBro.registerAdapter(AdminBroMongoose)

const admin = new AdminBro({
  resources: [Review, User, List],
  rootPath: '/admin',
})

const router = AdminBroExpress.buildRouter(admin);

module.exports = { admin: admin, router: router }
