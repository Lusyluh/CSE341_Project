const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongodb = require('./models/connect');
const cookieSession = require('cookie-session');
//const session = require('express-session');
const passport = require("passport");

const port = process.env.PORT || 8080

const passportSetup = require('./auth/passport-setup');

// Configuring body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
//serve all files inside the views directory
app.use(express.static(__dirname + "/views"));
app.set("view engine", "ejs");


//use the cookie session
app.use(cookieSession({
  maxAge: 24*60*60*1000,
  keys: [process.env.COOKIE_KEY]
}));
app.set('trust proxy', 1)
// app.use(session({
//   secret: process.env.COOKIE_KEY,
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connects to the endpoints under routes folder
app.use('/', require('./routes'));

//database connection initialized
mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port);
        console.log(`Connected to DB and listening on ${port}`);
    }
})