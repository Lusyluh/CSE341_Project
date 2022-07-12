const express = require('express');
const router = express.Router();

//connects to the swagger router
router.use('/api-docs', require('./swagger'));

//authentication
router.use('/auth', require('./auth-routes'));

//connect to the recipes router
router.use('/recipes', require('./recipes'));

//connect to the users route
router.use('/users', require('./user'));

module.exports = router;