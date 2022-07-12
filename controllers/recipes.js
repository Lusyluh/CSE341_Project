const mongodb = require('../models/connect');
const ObjectId = require('mongodb').ObjectId;

//connects to the validation schema
const {authSchema} = require('../middleware/userValidation');

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
    const recipe = {
        name: req.body.name,
        category: req.body.category,
        email: req.body.email,
        ingredients: req.body.ingredients,
        prepTime: req.body.prepTime,
        cookTime: req.body.cookTime,
        servings: req.body.servings
    }

    try {
        const validate = await authSchema.validateAsync(req.body);

        const result = await mongodb.getDb().db('recipeBook').collection('recipes').insertOne(recipe);
        //if everything has been inserted correctly, return results
        if (result.acknowledged) {
            res.status(201).json(result);
        }
    } catch (error) {
        //but if the input does not match the schema, then do this
        res.status(422).send(error.details[0].message);
    }
};

//delete the recipes
const deleteRecipe = async (req, res) => {
    const userId = new ObjectId(req.params.id);
    //the userId validation
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Invalid Object Id.');
    }
    const result = await mongodb.getDb().db('recipeBook').collection('recipes').deleteOne({
        _id: userId
    }, true);
    if (result.deletedCount > 0) {
        res.status(204).send();
        console.log("Successfully deleted one document.");
    } else {
        res.status(500).json(result.error || 'No documents matched the query. Deleted 0 documents.');
    }
};

//update recipe, edit or replace
const updateRecipe = async (req, res) => {
    const userId = new ObjectId(req.params.id);
    //the userId validation
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Invalid Object Id.');
    }
    const recipe = {
        name: req.body.name,
        category: req.body.category,
        email: req.body.email,
        ingredients: req.body.ingredients,
        prepTime: req.body.prepTime,
        cookTime: req.body.cookTime,
        servings: req.body.servings
    }
    const result = await mongodb.getDb().db('recipeBook').collection('recipes').replaceOne({
        _id: userId
    }, recipe);
    if (result.modifiedCount > 0) {
        res.status(204).send();
        console.log('Update successful!');
    } else {
        res.status(500).json(result.error || 'Error occured while updating');
    }
}






module.exports = {
    getAll,
    newRecipe,
    deleteRecipe,
    updateRecipe
};