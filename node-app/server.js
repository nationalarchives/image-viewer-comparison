// import the http module
const http = require('http');

// handling the request and returning the response
const handleRequests = (req, res) => {

    // Return a string
    res.end('Hello World');
};

// create the server
const server = http.createServer(handleRequests);

//start server and listen on port x
server.listen(5000, () => {
    console.log(`It's Alive`);
});