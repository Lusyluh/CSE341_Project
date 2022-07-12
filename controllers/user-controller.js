const mongodb = require('../models/connect');

//get all the registered users
const getUsers = async (req, res, next) => {
	try {
		const allUsers = await mongodb.getDb()
    .db('recipeBook')
    .collection('users').find();
		if (allUsers) {
      allUsers.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);});
			
		} else {
			res.status(403);
			return res.json({message: "Error getting Users"});
		}
	} catch (error) {
		res.status(400);
		return res.json({error: "Error getting user"});
	}
};

//find user using an id
const getUserById = async (req, res, next) => {

	try {
		const user = await mongodb.getDb()
			.db('recipeBook')
			.collection('users').findById(req.params.id);

		if (!user) {
			res.status(422);
			res.json({
				error: 'user does not exist'
			});
			return;
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(422);
		res.json({
			error: 'Invalid User ID'
		});
		return;
	}
	next(error);
};

module.exports = {
	getUsers,
	getUserById
}