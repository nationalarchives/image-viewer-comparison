////////////// Express //////////////

const express = require('express');
const app = express();
const port = 5000;

// start the server
app.listen(port, () => {
    console.log('Have no fear EXPRESS is here.');
});

// route to our app
app.get('/', (req, res) => {
    res.send('Using express and nodemon');
});