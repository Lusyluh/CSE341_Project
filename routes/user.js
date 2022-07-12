const express = require('express');
const router = express.Router();

//connects to the user controller
const userController = require('../controllers/user-controller');


//get all registered users
router.get('/getUsers', userController.getUsers);

//get a particular user by id
router.get('/:id', userController.getUserById);

module.exports = router;