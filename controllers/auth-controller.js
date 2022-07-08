const mongodb = require('../models/connect');
const bcrypt = require('bcryptjs');

//connects to the utilities folder
const utils = require('../auth/utils');

//connect to the models to get users
const User = require('../models/user');

//console.log(utils.request_get_auth_code_url);

//render a signup form
const getSignup = (req, res) => {
  res.render('sign-up');
};

//create new user
const register = async (req, res) => {
  const User = {
    username: req.body.username,
    password: req.body.password
  }
  try{
    const newUser = await mongodb.getDb().db('recipeBook').collection('users').insertOne(User);
  if (newUser.acknowledged) {
    res.status(201).json({message: "registered succussfully"});
    console.log(req.body);
  }
}catch(err){
  res.status(422).send(err.message);
  return res.render('sign-up');
}
};




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
    register
};