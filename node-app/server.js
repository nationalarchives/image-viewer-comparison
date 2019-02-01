////////////// Express //////////////

const express = require('express');
const app = express();
const port = 5000;


// route our app
const router = require('./routes');
app.use('/', router);


// start the server
app.listen(port, () => {
    console.log('Have no fear EXPRESS is here.');
});