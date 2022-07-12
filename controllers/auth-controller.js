const mongodb = require('../models/connect');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const {userValidation} = require('../middleware/userValidation');

//connects to the utilities folder
const utils = require('../auth/utils');
const securePassword = require('../auth/securePassword');

//render a signup form
const getSignup = (req, res) => {
  res.render('sign-up');
};

//create new user
const register = async (req, res, next) => {

  try {
    const value = await userValidation.validateAsync(req.body);

    const existingUser = await mongodb.getDb()
      .db('recipeBook').collection('users')
      .findOne({
        email: value.email
      });
    if (existingUser) {
      res.status(403).json({
        message: "User already exists"
      });
    } else {
      //secure the password
      const hashedPassword = await securePassword(req.body.password);
      const newUser = await mongodb.getDb()
        .db('recipeBook')
        .collection('users')
        .insertOne({
          email: req.body.email,
          password: hashedPassword,
        });

      if (newUser) {
        res.status(201);
        return res.json({
          message: "User created successfully!"
        });
      } else {
        res.status(403).json({
          error: "Error Creating User"
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      error: 'User not added, please try again'
    });
  }
};

//render login form
const getLogin = async (req, res) => {
  res.render('login');
};

//handle the login - let the user login using email and password
const userLogin = async (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string(),
  });

  try {
    //validation
    const value = await schema.validateAsync(req.body);

    const user = await mongodb.getDb()
      .db('recipeBook')
      .collection('users')
      .findOne({
        email: value.email
      });
    if (user) {
      // check user password with hashed password stored in the database
      const validPassword = await bcrypt.compare(value.password, user.password);
      if (validPassword) {
        res.status(200).json({
          message: "Valid password"
        });
      } else {
        res.status(400).json({
          error: "Invalid Password"
        });
      }
    } else {
      res.status(401).json({
        error: "User does not exist"
      });
    }

  } catch (err) {
    next(err);
  }
};


//user logs out
const signout = async (req, res) => {
  req.logout();
  //res.clearCookie('nToken');
  return res.redirect('/');
};

//authentication


module.exports = {
  getSignup,
  register,
  getLogin,
  userLogin,
  signout
};