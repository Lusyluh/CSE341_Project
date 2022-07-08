const express = require('express');
const router = express.Router();

//connects to the auth controller
const authController = require('../controllers/auth-controller');

//router for the user to login
//router.get('/login', authController.getLogin);

//get the signup form
router.get('/register',authController.getSignup);

//router for a create account option
router.post('/register', authController.register);

//when user chooses to use google, then render authentication page
router.get('/auth',authController.getAuth);

//callback function to access authorization token
router.get (process.env.REDIRECT_URI, authController.getAccessToken);

module.exports = router;