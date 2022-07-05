const express = require('express');
const router = express.Router();

//connects to the auth controller
const authController = require('../controllers/auth-controller');

//show the login page with an option to use google
router.get('/login', (req, res) => {
  res.render('login');
});

//when user chooses to use google, then render authentication page
router.get('/auth',authController.getAuth);

//callback function to access authorization token
router.get (process.env.REDIRECT_URI, authController.getAccessToken);

module.exports = router;