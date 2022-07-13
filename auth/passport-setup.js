const mongodb = require('../models/connect');
const passport = require('passport');
const googleStrategy = require("passport-google-oauth20");
const dotenv = require("dotenv");
dotenv.config();


passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await mongodb.getDb()
        .db('recipeBook')
        .collection('users')
        .find(id)
    done(null, user);
});

passport.use(new googleStrategy({
        clientID: process.env.CLIENT_APP_ID,
        clientSecret: process.env.CLIENT_APP_SECRET,
        callbackURL: process.env.REDIRECT_URI
    },
    async (accessToken, refreshToken, profile, done) => {
        //console.log(profile);
        try {
            const user = await mongodb.getDb()
                .db('recipeBook').collection('users').findOne({
                    gid: profile.id
                });
            if (user) {
                done(null, user);
            } else {
                const doc = {
                    firstname: profile.name.givenName,
                    gid: profile.id,
                };
                const saveUser = await mongodb.getDb()
                    .db('recipeBook')
                    .collection('users')
                    .insertOne(doc);
                done(null, saveUser);
            }
        } catch (error) {
            if (error.name == "ValidationError") {
                done(createError.UnprocessableEntity(error.message));
                return;
            }
            done(error);
        }
    }
));

module.exports = {};