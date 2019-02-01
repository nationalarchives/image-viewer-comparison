const express = require('express');
const path = require('path');

const router = express.Router();

// route to our app
router.get('/', (req, res) => {
    //res.send('Using express and nodemon');
    res.sendFile(path.join(__dirname, './index.html'));
});

router.get('/image', (req, res) => {
    res.send('image page');
});

module.exports = router;

//