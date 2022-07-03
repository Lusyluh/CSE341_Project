const express = require('express');
const router = express.Router();

//connects to the controller
const recipeController = require('../controllers/recipes');
const utils = require ('../auth/utils');

//now here are the endpoints
router.get('/', recipeController.getAll);
router.post('/',recipeController.newRecipe);
router.delete('/:id', recipeController.deleteRecipe);
router.put('/:id', recipeController.updateRecipe)
//authentication
router.get ('/auth', async (req, res) => {
    try {
      res.redirect (utils.request_get_auth_code_url);
    } catch (error) {
      res.sendStatus (500);
      console.log (error.message);
    }
  });

module.exports = router;