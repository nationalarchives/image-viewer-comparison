const express = require('express');
const path = require('path');
const axios = require('axios');

const router = express.Router();


// route to our app
router.get('/', (req, res) => {
    let canvases;
    let canvasesObj = [];
    axios
    .get(`http://127.0.0.1:3000/manifest.json`)
    .then(response => {
        canvases = response.data.sequences[0].canvases;
        //console.log(typeof canvases); // this is an object
        //console.log(canvases[0].label);
        canvases.forEach(canvase => {
            canvasesObj.push(canvase);
        });

        console.log(canvasesObj);
        res.render('./index', { canvasesObj: canvasesObj });
    
    })
    .catch(error => {
        console.log(error);
    });
});

// router.get('/image', (req, res) => {
//     res.send('image page');
// });

module.exports = router;