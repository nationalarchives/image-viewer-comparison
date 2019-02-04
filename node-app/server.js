////////////// Express //////////////

const express           = require('express');
const expressLayouts    = require('express-ejs-layouts');
const bodyParser        = require('body-parser');
const app               = express();
const port              = 5000;

// Set the templating engine
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Use body parser
app.use(bodyParser.urlencoded({ 
    extended: true 
}));


// Route our app
const router = require('./routes');
app.use('/', router);

// Set static files ( css & images etc )
app.use(express.static(__dirname + '/public'))

// Start the server
app.listen(port, () => {
    console.log('Have no fear EXPRESS is here.');
});