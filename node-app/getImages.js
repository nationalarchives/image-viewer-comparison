const axios = require('axios');

axios
    .get(`http://127.0.0.1:3000/manifest.json`)
    .then(response => {
        console.log(response.data.sequences[0]);
    })
    .catch((error) => {
        console.log(error);
    });