// src/middleware.js

module.exports = {

  isLoggedIn(request, response, next) {
    if (request.isAuthenticated()) { return next(); }
    return response.redirect('/signin');
  },

  isReactRoute(request, response, next) {
    const parse = request.path.match(/\/app(\/(asdf(\/)?)?)?/); // parse the path to check if its a valid path
    if(!!parse && parse[0] === request.path) { // if there is no match, or the match isn't the whole path
      next();
    } else {
      response.status(404).render('404');
    }
  },

}
