// src/middleware.js

module.exports = {

  isLoggedIn(request, response, next) {
    if (request.isAuthenticated()) { return next(); }
    return response.redirect('/signin');
  },

  isReactRoute(request, response, next) {
    const settings = '(settings(\/(account|editor)?)?)';
    const workspace = '(editor)'
    const regexp = new RegExp('\/('+workspace+'|'+settings+')(\/)?');
    const parse = request.path.match(regexp);   // parse the path to check if its a valid path
    if(!!parse && parse[0] === request.path) {  // if there is no match, or the match isn't the whole path
      next();
    } else {
      response.status(404).render('404');
    }
  },

}
