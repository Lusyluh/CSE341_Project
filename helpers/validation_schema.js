const Joi = require('joi');

//creating a schema of what needs to be validated
const authSchema = Joi.object({
    name: Joi.string().min(3).required(),
    category: Joi.string().required(),
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: {
                allow: ['com', 'net']
            }
        }),
    ingredients:Joi.array().items(Joi.string(), Joi.number()).required(), // array may contain strings and numbers,
    prepTime: Joi.string().required(),
    cookTime: Joi.string().required(),
    servings: Joi.string().required()

});

const userSchema = Joi.object({
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: {
                allow: ['com', 'net']
            }
        }),
    password: Joi.string().min(3).alphanum().required()
})

module.exports = {
    authSchema, userSchema
};