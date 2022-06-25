const express = require('express');
const router = express.Router();

//connect to the recipes router
router.use('/recipes', require('./recipes'));

module.exports = router;