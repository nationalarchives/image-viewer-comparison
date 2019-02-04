const axios = require('axios');

axios
    .get(`http://127.0.0.1:3000/manifest.json`)
    .then(response => {
        const canvases = response.data.sequences[0].canvases;
        console.log(canvases);
        // canvases.forEach(canvase => {
        //     console.log(canvase.images[0].resource["@id"]); 
        // });
    })
    .catch(error => {
        console.log(error);
    });