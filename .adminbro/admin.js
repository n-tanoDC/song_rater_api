const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');

const Review = require('../models/Review')
const User = require('../models/User')

AdminBro.registerAdapter(AdminBroMongoose)

const admin = new AdminBro({
  resources: [Review, User],
  rootPath: '/admin',
})

const router = AdminBroExpress.buildAuthenticatedRouter(admin, {
  authenticate: async (username, password) => {
    const user = await User.findOne({ username })
    if (user) {
      const validate = await user.isValidPassword(password)
      console.log(validate)
      if (validate && user.isAdmin) {
        return user
      }
    }
    return false
  },
  cookiePassword: 'secret_password'
});

module.exports = { admin: admin, router: router }
