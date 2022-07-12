const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./models/connect');
const cookieSession = require('cookie-session');
const passport = require("passport");

const app = express();
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

//sessions
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET' 
  }));

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