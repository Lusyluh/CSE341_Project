const mongodb = require('../models/connect');
const ObjectId = require('mongodb').ObjectId;

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
    //try {
        const recipe = {
            name: req.body.name,
            category: req.body.category,
            email: req.body.email,
            ingredients: req.body.ingredients,
            prepTime: req.body.prepTime,
            cookTime: req.body.cookTime,
            servings: req.body.servings
        }
        const result = await mongodb.getDb().db('recipeBook').collection('recipes').insertOne(recipe);
        if (result.acknowledged) {
            res.status(201).json(result);
            console.log(result);
            console.log(req.body.name);
        }
    //} catch (error) {
        else {res.status(500).send({message: error.message || 'Recipe could not be created'})}
    //}

};

//delete the recipes
const deleteRecipe = async (req, res) => {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db('recipeBook').collection('recipes').deleteOne({ _id: userId }, true);
    if (result.deletedCount > 0) {
        res.status(204).send();
        console.log("Successfully deleted one document.");
      } else {
        res.status(500).json(result.error || 'No documents matched the query. Deleted 0 documents.');
      }
}
module.exports = {
    getAll, newRecipe, deleteRecipe
};