const routeSigninSuccess = require('../middleware').routeSigninSuccess;
const TreeNode = require('../models/treeNode');

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
  app.get('/new', (request, response) => {
    const doc = new TreeNode({
      contents: [{ text: '' }],
      isFile: true,
    });
    doc.setShared(true)
      .then(savedDoc => response.redirect(`/a/${savedDoc.shareId}`))
      .catch(error => response.json({ error }));
  });
};
