const mongodb = require('../models/connect');

//create a new recipe
//fields/schema: name, ingredients[], method, prep time, cook time, servings, category
//maybe an image?

const newRecipe = async(req, res) => {
    const recipe = req.body;
    try{
        const result = await mongodb.getDb().db('recipeBook').collection('recipes').insertOne(recipe);

    }catch(err){
        console.log(err.message)
    }

}
module.exports = {newRecipe};