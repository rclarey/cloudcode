const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const user = mongoose.Schema({
  auth: {
    username: String,
    password: String,
  },
});

// methods
user.methods = {
  validPassword(password) {
    return bcrypt.compareSync(password, this.auth.password);
  },
};

// statics
user.statics = {
  generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
  },
};

module.exports = mongoose.model('User', user);
