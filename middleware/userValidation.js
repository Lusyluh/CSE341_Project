const Joi = require('joi');

//creating a schema of what needs to be validated
const authSchema = Joi.object({
    name: Joi.string().min(3).required(),
    category: Joi.string().required(),
    email: Joi.string().email().required(),
    ingredients:Joi.array().items(Joi.string(), Joi.number()).required(), // array may contain strings and numbers,
    prepTime: Joi.string().required(),
    cookTime: Joi.string().required(),
    servings: Joi.string().required()

});

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).alphanum().required()
})

//validate user
const userValidation = async (req, res, next) => {
	const user = {
		email: req.body.email,
		password: req.body.password
	};

	const { error } = userSchema.validateAsync(user);
	if (error) {
		res.status(406);
		return res.json({message: 'Error in user data'});
	} else {
		next();
	}
};
 
module.exports = {userValidation, authSchema };