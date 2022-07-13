const express = require('express');
const router = express.Router();

//connects to the user controller
const { getUserById, getUsers } = require('../controllers/user-controller');

//authenticate
const authCheck = async (req, res, next) => {
    if (req.user) {
        next();
      } else {
        res.send('You need permission to view this page, please login');
        res.redirect('/auth/login');
      }

};

//get all registered users
router.get('/getUsers',authCheck, getUsers);

//get a particular user by id
router.get('/:id',authCheck, getUserById);

module.exports = router;