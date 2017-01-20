// server.js
const express = require('express');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const morgan = require('morgan');
const serveStatic = require('serve-static');
const session = require('express-session');

const mongoose = require('mongoose');
const passport = require('passport');

const dbConfig = require('./config/db.js');
const passportConfig = require('./config/passport.js');
const sessionConfig = require('./config/session.js');

const app = express();
const port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000;

mongoose.connect(dbConfig.url); // connect to the db

// setup express
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies
app.use(bodyParser()); // get information from html forms

app.set('views', './views');
app.set('view engine', 'pug');

// for passport
app.use(session(sessionConfig(app)));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
passportConfig(passport); // pass passport for configuration
app.use(flash()); // use connect-flash for flash messages stored in session

// routing
app.use(serveStatic('./'));
require('./routes/api.js')(app, passport);
require('./routes/pages.js')(app, passport);

app.listen(port);
console.log(app.get('env'));
console.log('✔ Express server listening on port', port);
