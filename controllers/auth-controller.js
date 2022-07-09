const mongodb = require('../models/connect');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync("B4c0/\/", salt);
const {
  authSchema,
  userSchema
} = require('../helpers/validation_schema');

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
  //   const User = await userSchema.validateAsync({
  //   email: req.body.email,
  //   password: req.body.password
  // });
  
    const existingUser = await mongodb.getDb().db('recipeBook').collection('users').findOne({email: req.body.email});
    if (existingUser) {
      res.status(403).json({
        message: "User already exists"
      });
    }else{
      //secure the password
      const hashedPassword = await securePassword(req.body.password);
      const newUser = await mongodb.getDb()
      .db('recipeBook')
      .collection('users')
      .insertOne({email: req.body.email,password:hashedPassword});
      
      if (newUser) {
        res.status(201);
				return res.json({message: "User created successfully!"});
      }else{
        res.status(403).json({error: "Error Creating User"});
      }
    }
  } catch (error) {
    res.status(400).json({error: 'User not added, please try again'});
  }
};

//render login form
const getLogin = async (req, res) => {
  res.render('login');
};

//handle the login - let the user login using email and password
const userLogin = async (req, res) => {
  try{const User = {
    email: req.body.email,
    password: req.body.password
  }

  const result = await mongodb.getDb()
    .db('recipeBook')
    .collection('users')
    .findOne({
      email: req.body.email
    })
      //user not found
      if (!result) {
        return res.status(404).send({
          message: "Wrong Username or Password"
        });
      } else {
        utils.is_logged_in = true;
      }
      //check the password
      const isPasswordValid = req.body.password === result.password

      if (!isPasswordValid) {
        res.status(403).send({
          error: 'password incorrect!'
        })
      }
  }catch(err){
    res.status(500).send({
      error: 'Error has occured while trying to login'
    })
  }
    
}

// // Check the password
// user.comparePassword(password, (err, isMatch) => {
//   if (!isMatch) {
//     // Password does not match
//     return res.status(401).send({ message: 'Wrong Username or password' });
//   }

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
  userLogin
};