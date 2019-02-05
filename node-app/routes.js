const express = require('express');
const path = require('path');
const axios = require('axios');

const router = express.Router();


// route to our app
router.get('/', (req, res) => {
    axios
    .get(`http://127.0.0.1:3000/manifest.json`)
    .then(response => {
        res.render('./index', { canvases: response.data.sequences[0].canvases });
    })
    .catch(error => console.log(error));
});

module.exports = router;