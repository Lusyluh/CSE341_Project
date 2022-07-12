const express = require('express');
const router = express.Router();

//connects to the auth controller
const authController = require('../controllers/auth-controller');

//connects to the user validator middleware
//const userValidation = require('../middleware/userValidation');

// Showing home page
router.get('/', function (req, res) {
    res.render('home');
});

//get the signup form
router.get('/register', authController.getSignup);

//router for a create account option
router.post('/register', authController.register);


//router to get the login form
router.get('/login', authController.getLogin);

//post login 
router.post('/login', authController.userLogin);

//user logs out 
router.get('/logout', authController.signout);

//when user chooses to use google, then render authentication page
router.get('/auth/google', 
passport.authenticate('google', { scope : ['profile', 'email'] }));

//callback function to access authorization token
router.get(process.env.REDIRECT_URI,passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect success.
  res.redirect('/success');
});

module.exports = router;