const express = require('express');
const router = express.Router();

//connects to the controller
const recipeController = require()

//now here are the endpoints
router.post('/', recipeController.newRecipe);

module.exports = router;