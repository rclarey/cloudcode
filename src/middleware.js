// src/middleware.js

const TreeNode = require('./models/treeNode.js');

module.exports = {

  isLoggedIn(request, response, next) {
    if (request.isAuthenticated()) {
      next();
    } else {
      const path = `/signin?r=${request.path}`;
      response.redirect(path);
    }
  },

  isReactRoute(request, response, next) {
    const settings = '(?:settings(?:/(?:account|editor)?)?)';
    const workspace = '(?:editor)';
    const regexp = new RegExp(`/(?:${workspace}|${settings})(?:/)?`);
    const parse = request.path.match(regexp);   // parse the path to check if its a valid path
    if (!!parse && parse[0] === request.path) {
      next();
    } else {  // if there is no match, or the match isn't the whole path
      response.status(404).render('404');
    }
  },

  isPublicFile(request, response, next) {
    TreeNode.findOne({ shareId: request.params.id }).exec()
      .catch(() => response.status(404).render('404'))
      .then((node) => {
        if (!node) {
          response.status(404).render('404');
        } else {
          next();
        }
      });
  },

  routeSigninSuccess(request, response) {
    response.redirect(request.body.redirect);
  },

};
