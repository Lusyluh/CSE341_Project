const express = require('express');
const router = express.Router();

//connects to the controller
const recipeController = require('../controllers/recipes');

//now here are the endpoints
router.get('/', recipeController.getAll);
router.post('/', recipeController.newRecipe);
router.delete('/:id', recipeController.deleteRecipe);

module.exports = router;