const express = require('express');
const router = express.Router();

//connects to the swagger router
router.use('/', require('./swagger'));

//authentication
router.use('/auth', require('./auth-routes'));

//connect to the recipes router
router.use('/recipes', require('./recipes'));

module.exports = router;