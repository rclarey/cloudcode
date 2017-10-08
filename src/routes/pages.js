// src/routes/pages.js

const middleware = require('../middleware.js');

const isLoggedIn = middleware.isLoggedIn;
const isReactRoute = middleware.isReactRoute;
const isPublicFile = middleware.isPublicFile;

module.exports = function route(app) {
  // Home page
  app.get('/', (request, response) => {
    response.render('index');
  });

  // Sign in
  app.get('/signin', (request, response) => {
    const path = request.query.r || '/editor';
    response.render('signin', { redirect: path, message: request.flash('signinMessage') });
  });

  // Sign up
  app.get('/signup', (request, response) => {
    response.render('signup', { message: request.flash('signupMessage') });
  });

  // Sign out
  app.get('/signout', (request, response) => {
    request.logout();
    response.redirect('/');
  });

  // Anon app
  app.get('/a/:id', isPublicFile, (request, response) => {
    response.render('anon');
  });

  // Editor app
  app.get('*', isReactRoute, isLoggedIn, (request, response) => {
    response.render('app', { user: request.user.auth.username });
  });
};
