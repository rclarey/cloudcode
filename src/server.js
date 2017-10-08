// server.js
const express = require('express');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const morgan = require('morgan');
const serveStatic = require('serve-static');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const mongoose = require('mongoose');
const passport = require('passport');

const dbConfig = require('./config/db.js');
const passportConfig = require('./config/passport.js');
const sessionConfig = require('./config/session.js');

const app = express();
const port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000;

mongoose.connect(dbConfig.url); // connect to the db

// setup express
app.use(morgan(':date[clf] :method :url :status :response-time ms - :res[content-length]')); // log every request to the console
app.use(cookieParser()); // read cookies
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'pug');
app.set('views', './views');

// for passport
const store = new MongoStore({ mongooseConnection: mongoose.connection });
app.use(session(sessionConfig(app, store)));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
passportConfig(passport); // pass passport for configuration
app.use(flash()); // use connect-flash for flash messages stored in session

// routing
app.use(serveStatic('./'));
require('./routes/api.js')(app, passport);
require('./routes/pages.js')(app);

app.listen(port);
/* eslint-disable no-console */
console.log(app.get('env'));
console.log('✔ Express server listening on port', port);
