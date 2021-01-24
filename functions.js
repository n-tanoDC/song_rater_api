const fs = require('fs');

const Review = require('./models/Review');
const User = require('./models/User');
const Media = require('./models/Media');


const fieldValidator = (value, type) => {
  const patterns = {
    // regular email pattern, ex : address@mail.com.
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    // At least one number, one uppercase alphabetical, one lowercase and 8 characters min.
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
    // 3 to 20 characters, no . or _ at the beginning or end.
    username: /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
  }
  // return true of false if the value passed the test of the associated pattern
  return (patterns[type]).test(value);
}


exports.deleteAvatar = user => {
  const path = './uploads/' + user.avatar;
  return fs.unlink(path, error => {
    console.log(error);
  })
}


exports.bodyValidator =  async body => {
  const { username, email } = body;
  
  const keys = {
    username: 'Nom d\'utilisateur',
    email: 'Email',
    password: 'Mot de passe'
  };

  for (const [key, value] of Object.entries(body)) {
    if (key in body && !fieldValidator(value, key)) {
      return { error: keys[key] + ' invalide.' };
    }
  }

  if (await User.exists({ username })) {
    return { error: 'Le nom d\'utilisateur est déjà utilisé.' };
  }

  if (await User.exists({ email })) {
    
    return { error: 'L\'adresse email est déjà utilisée.' };
  }

  return { error: null };
}

exports.findWithPagination = async (Model, query, page, limit, sortValue = 'created_at') => {
  let sortQuery; 
  
  switch (sortValue) {
    case 'upvotes':
      sortQuery = { averageVote: -1 };
      break;
    case 'downvotes':
      sortQuery = { averageVote: 1 };
      break;
    default:
      sortQuery= { created_at: -1 }
  }

  const results = await Model.find(query)
    .populate({ 
      path: 'author', 
      select: '-password -email -created_at -isAdmin -__v',
      populate: { path: 'favorites', model: 'Media' }
    })
    .populate('media')
    .sort(sortQuery)
    .limit(limit)
    .skip((page - 1) * limit)
    .exec();

    const count = await Model.countDocuments(query)

    // get total amount of pages possible with the limit defined in the request
    const totalPages = Math.ceil(count / limit)

    // generate next page number if there's one
    const next = page < totalPages ? (parseInt(page) + 1) : null
    
    return { reviews: results, next };
}

exports.reviewValidator = async (body, user) => {
  const { title, content, rating } = body;
  const media = await Media.findOne({ id: body.media.id });
  
  if (media) {
    const oldReview = await Review.findOne({ author: user._id, media: media._id })
    
    if (oldReview) {
      return { error: 'Vous avez déjà publié une critique sur ce contenu.' };
    }
  }
  
  if (rating > 10 || rating < 1) {
    return { error: 'La note doit être comprise entre 1 et 10 inclus.' };
  }

  if (title && (title.length > 100 || title.length < 5)) {
    return { error: 'Le titre doit faire entre 5 et 100 caractères.' };
  }

  if (content && (content.length > 5000 || content.length < 10)) {
    return { error: 'La critique doit faire entre 10 et 5000 caractères.' }
  }

  return { error: null };
}

exports.getMedia = async (media) => {
  let existingMedia = await Media.findOne({ id: media.id });

  if (existingMedia) {
    return existingMedia;
  };

  const newMedia = await Media.create(media)

  return newMedia
} 

exports.removeItem = (array, item) => {
  const index = array.indexOf(item)
  if (index !== -1) {
    array.splice(index, 1)
  }
  return array
}