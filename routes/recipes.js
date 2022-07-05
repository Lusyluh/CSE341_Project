const express = require('express');
const router = express.Router();

//connects to the controller
const recipeController = require('../controllers/recipes');

// //the user logs in
// router.get('/login', (req, res) => {
//   res.render('login');
// })

//now here are the endpoints
router.get('/', recipeController.getAll);
router.post('/',recipeController.newRecipe);
router.delete('/:id', recipeController.deleteRecipe);
router.put('/:id', recipeController.updateRecipe)


module.exports = router;