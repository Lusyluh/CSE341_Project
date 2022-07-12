const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: {
    type: String,
    required: true,
    select: false
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    }
});

//hash the password using bcryptjs

module.exports = mongoose.model('User', userSchema)
