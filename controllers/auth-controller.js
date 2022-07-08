const mongodb = require('../models/connect');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync("B4c0/\/", salt);
const {authSchema, userSchema} = require('../helpers/validation_schema');

//connects to the utilities folder
const utils = require('../auth/utils');

//connect to the models to get users
const User = require('../models/user');



//render a signup form
const getSignup = (req, res) => {
  res.render('sign-up');
};

//create new user
const register = async (req, res) => {
  const User = await userSchema.validateAsync({
    email: req.body.email,
    password: req.body.password
  });
  try{
    const newUser = await mongodb.getDb().db('recipeBook').collection('users').insertOne(User);
  if (newUser.acknowledged) {
    res.status(201).json({message: "User registered successfully"});
    console.log(req.body);
  }
}catch(err){
  res.status(422).send(err.message);
  return res.render('sign-up');
}
};

//render login form
const getLogin = async (req, res) => {
  res.render('login');
};

//handle the login - let the user login using email and password
const userLogin = async (req, res) => {
  const User = {
    email: req.body.email,
    password: req.body.password
  }
  const response = await mongodb.getDb().db('recipeBook').collection('users').find(User);
  //if user already exist
  if(!response){
    //user not found
    return res.status(401).send({ message: 'Wrong Username or Password' });
  }
  
}



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
    console.log ({auth_server_response: authorization_token});
    try {
      // ! get access token using authorization token
      console.log('get in here');
      const response = await utils.get_access_token (authorization_token);
      console.log ({data: response.data});
  
      // get access token from payload to obtain the resource
      const {access_token} = response.data;
      console.log ({data: response.data});

      
      //get user profile data
      const user = await utils.get_profile_data (access_token);
      const user_data = user.data;
      res.send (`
        <h1> welcome ${user_data.name}</h1>
        <img src="${user_data.picture}" alt="user_image" />
      `);
      console.log (user_data);
    } catch (error) {
      console.log (error.message || 'Something wrong happened, try again!');
      res.sendStatus (500);
    }
  };

module.exports = {
    getAuth,
    getAccessToken,
    getSignup,
    register,
    getLogin
};