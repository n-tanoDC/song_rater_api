const passport = require("passport");

const validateData = (value, type) => {
  const patterns = {
    // regular email pattern, ex : address@mail.com.
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    // At least one number, one uppercase alphabetical, one lowercase and 8 characters min.
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
    // 3 to 20 characters, no . or _ at the beginning or end.
    username: /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
  }
  return (patterns[type]).test(value);
}

const authenticate = passport.authenticate('jwt', { session: false })

exports.validator = validateData;
exports.authenticate = authenticate;