var Hapi = require('hapi');

const PORT = 8080;

var server = new Hapi.Server();
server.connection({ port: PORT });

server.start(function () {

    console.log('Server is now running at:', server.info.uri);
});
