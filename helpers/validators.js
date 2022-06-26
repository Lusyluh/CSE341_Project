const validator = require('validator');
const { check } = require('express-validator');

const postValidation = [
    check('name', 'Name is requied').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
]
module.exports = {postValidation}