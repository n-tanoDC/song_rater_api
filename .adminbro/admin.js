const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');

const Review = require('../models/Review')
const User = require('../models/User');
const Media = require('../models/Media');
const translations = require('./translations');

AdminBro.registerAdapter(AdminBroMongoose)

const admin = new AdminBro({
  resources: [
    {
      resource: User,
      options: {
        actions: {
          new: {
            isAccessible: false
          }
        },
        listProperties: ['username', 'email', 'created_at', 'isAdmin'],
        editProperties: ['username', 'email', 'isAdmin'],
        showProperties: ['username', 'email', 'favorites', 'followers', 'following', 'created_at'],
        properties: {
          username: {
            isTitle: true
          }
        }
      }
    },
    {
      resource: Review,
      options: {
        listProperties: ['title', 'media', 'rating', 'author', 'created_at'],
        editProperties: ['title', 'content', 'media', 'rating', 'author'],
        properties: {
          title: {
            isTitle: true
          },
          content: {
            type: 'textarea'
          }
        }
      }
    },
    {
      resource: Media,
      options: {
        actions: {
          new: {
            isAccessible: false
          },
          edit: {
            isAccessible: false
          },
          delete: {
            isAccessible: false
          }
        },
        listProperties: ['name', 'media_type', 'average_rating'],
        showProperties: ['name', 'media_type', 'link', 'image','average_rating'],
        properties: {
          name: {
            isTitle: true,
          }
        }
      }
    },
  ],
  dashboard: {
    component: 'Dashboard'
  },
  locale: {
    translations: translations.fr
  },
  branding: {
    logo: false,
    companyName: 'SongRater API',
    softwareBrothers: false,
  }
})

const router = AdminBroExpress.buildAuthenticatedRouter(admin, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email })
    if (user) {
      const validate = await user.isValidPassword(password)
      if (validate && user.isAdmin) {
        return user
      }
    }
    return false
  },
  cookiePassword: 'secret_password'
});

module.exports = { admin: admin, router: router }
