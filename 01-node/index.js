var Http = require('http');

// ES2015 supports const
const PORT=8080;


function requestListener (request, response) {

    response.end('you accessed: ' + request.url);
}


var server = Http.createServer(requestListener);


server.listen(PORT, function () {

    console.log("Server started at http://localhost:%s", PORT);
});
