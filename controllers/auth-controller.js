const mongodb = require('../models/connect');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const {userValidation} = require('../middleware/userValidation');

//connects to the utilities folder
const utils = require('../auth/utils');
const securePassword = require('../auth/securePassword');

//connect to the models to get users
const User = require('../models/user');

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

//get all the registered users
const getUsers = async (req, res, next) => {
	try {
		const allUsers = await mongodb.getDb()
    .db('recipeBook')
    .collection('users').find();
		if (allUsers) {
      allUsers.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);});
			
		} else {
			res.status(403);
			return res.json({message: "Error getting Users"});
		}
	} catch (error) {
		res.status(400);
		return res.json({error: "Error getting user"});
	}
};

//user logs out
const signout = async (req, res) => {
  req.logout();
  //res.clearCookie('nToken');
  return res.redirect('/');
};

//authentication
const getAuth = async (req, res) => {
  try {
    res.redirect(utils.request_get_auth_code_url);

  } catch (error) {
    res.sendStatus(500);
    console.log('Error: ' + error.message);
  }
}
//retrieve access token
const getAccessToken = async (req, res) => {
  // ! get authorization token from request parameter
  const authorization_token = req.query.code;
  console.log({
    auth_server_response: authorization_token
  });
  try {
    // ! get access token using authorization token
    console.log('get in here');
    const response = await utils.get_access_token(authorization_token);
    console.log({
      data: response.data
    });

    // get access token from payload to obtain the resource
    const {
      access_token
    } = response.data;
    console.log({
      data: response.data
    });


    //get user profile data
    const user = await utils.get_profile_data(access_token);
    const user_data = user.data;
    res.send(`
        <h1> welcome ${user_data.name}</h1>
        <img src="${user_data.picture}" alt="user_image" />
      `);
    console.log(user_data);
  } catch (error) {
    console.log(error.message || 'Something wrong happened, try again!');
    res.sendStatus(500);
  }
};

module.exports = {
  getAuth,
  getAccessToken,
  getSignup,
  register,
  getLogin,
  userLogin,
  getUsers,
  signout
};