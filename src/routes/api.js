// src/routes/api.js

const routeSigninSuccess = require('../middleware.js').routeSigninSuccess;
const TreeNode = require('../models/treeNode.js');

module.exports = function route(app, passport) {
  // Sign in
  app.post('/signin', passport.authenticate('signin', {
    failureRedirect: '/signin',
    failureFlash: true,
  }), routeSigninSuccess);

  // Sign up
  app.post('/signup', passport.authenticate('signup', {
    successRedirect: '/app',
    failureRedirect: '/signup',
    failureFlash: true,
  }));

  // Create a new anonymous document
  app.get('/create-anon', (request, response) => {
    const doc = new TreeNode({
      contents: '',
      isFile: true,
    });
    doc.setShared(true)
      .then(savedDoc => response.json({ id: savedDoc.shareId }))
      .catch(error => response.json({ error }));
  });
};
