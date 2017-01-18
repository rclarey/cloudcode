// src/routes/pages.js

const middleware = require('../middleware.js');
const isLoggedIn = middleware.isLoggedIn;
const isReactRoute = middleware.isReactRoute;

module.exports = function route(app, passport) {

  // Home page
  app.get('/', (request, response) => {
    response.render('index');
  });

  // Sign in
  app.get('/signin', (request, response) => {
    response.render('signin', { message: request.flash('signinMessage') });
  });

  app.post('/signin', passport.authenticate('signin', {
    successRedirect: '/app',
    failureRedirect: '/signin',
    failureFlash: true,
  }));

  // Sign up
  app.get('/signup', (request, response) => {
    response.render('signup', { message: request.flash('signupMessage') });
  });

  app.post('/signup', passport.authenticate('signup', {
    successRedirect: '/app',
    failureRedirect: '/signup',
    failureFlash: true,
  }));

  // Sign out
  app.get('/signout', (request, response) => {
    request.logout();
    response.redirect('/');
  });

  // Editor app
  app.get('*', isReactRoute, isLoggedIn, (request, response) => {
    response.render('app', { user: request.user.auth.username });
  });

};
