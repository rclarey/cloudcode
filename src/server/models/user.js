// src/models/user.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const user = mongoose.Schema({
  auth: {
    username: String,
    password: String,
  },
});

// Methods
user.methods = {
  generateHash(password) { return bcrypt.hashSync(password, bcrypt.genSaltSync()); },
  validPassword(password) { return bcrypt.compareSync(password, this.auth.password); },
};

module.exports = mongoose.model('User', user);
