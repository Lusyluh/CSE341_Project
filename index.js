const express = require('express');
const bodyParser = require('body-parser');
//connect to the database
const mongodb = require('./models/connect');

const app = express();
const port = process.env.PORT || 8080

// Configuring body parser middleware
//app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })

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