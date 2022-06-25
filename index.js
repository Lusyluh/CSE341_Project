const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8080

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

app.get('/', (req, res) => {
    res.send("We are getting stared")
});

app.listen(port);
console.log(`Recipe Book API listening on port ${port}`);