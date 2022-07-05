const mongodb = require('../models/connect');

//connects to the utilities folder
const utils = require('../auth/utils');

console.log(utils.request_get_auth_code_url);
console.log('get in here');
const getAuth = async (req, res) => {
    try {
        res.redirect(utils.request_get_auth_code_url);
    } catch (error) {
        res.sendStatus(500);
        console.log('Error: ' + error.message);
    }
}

module.exports = {
    getAuth
};