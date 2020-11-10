const passport = require("passport");
const User = require("../models/User");

const authenticate = passport.authenticate('jwt', { session: false })


/* Params : 
  - type will define the pattern to be use
  - value will define the value to be tested */
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


const bodyValidator =  async body => {
  console.log('bodyValidator', body);
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

exports.bodyValidator = bodyValidator;
exports.authenticate = authenticate;