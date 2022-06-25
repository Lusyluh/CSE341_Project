const mongodb = require('../models/connect');

//get all recipes listed in the database
const getAll = async (req, res) => {
    const result = await mongodb.getDb().db('recipeBook').collection('recipes').find();
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  };
//create a new recipe
//fields/schema: name, ingredients[], method, prep time, cook time, servings, category
//maybe an image?

const newRecipe = async (req, res) => {
    
    try {
        const recipe = {
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            prepTime: req.body.prepTime,
            cookTime: req.body.cookTime,
            serving: req.body.serving
        }
        const result = await mongodb.getDb().db('recipeBook').collection('recipes').insertOne(recipe);
        console.log(result);
    } catch (error) {
        res.status(500).send({message: error.message || 'Recipe could not be created'})
    }

}
module.exports = {
    getAll, newRecipe
};