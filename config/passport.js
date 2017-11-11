const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = (passport) => {
  // serialize/deserialize user for session
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }, (error, user) => { done(error, user); });
  });

  // =================
  // Strategies
  // =================
  const fields = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
  };

  // Sign up
  const signUpFunction = (request, username, password, done) => {
    process.nextTick(() => { // User.findOne wont fire unless data is sent back
      User.findOne({ 'auth.username': username }).exec()
        .catch(error => done(error))
        .then((user) => {
          if (user) {
            done(null, false, request.flash('signupMessage', 'That username is already taken.'));
          } else {
            const newUser = new User({
              auth: {
                username,
                password: User.generateHash(password),
              },
            });

            newUser.save().then(() => done(null, newUser));
          }
        });
    });
  };

  passport.use('signup', new LocalStrategy(fields, signUpFunction));

  // Sign in Strategy
  const signInFunction = (request, username, password, done) => {
    User.findOne({ 'auth.username': username }).exec()
      .catch(error => done(error))
      .then((user) => {
        if (!user) {
          done(null, false, request.flash('signinMessage', 'Invalid Username or Password.'));
        } else if (!user.validPassword(password)) {
          done(null, false, request.flash('signinMessage', 'Invalid Username or Password.'));
        } else {
          done(null, user);
        }
      });
  };

  passport.use('signin', new LocalStrategy(fields, signInFunction));
};
