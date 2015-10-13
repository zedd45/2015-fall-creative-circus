var Hapi = require('hapi');

const PORT = 8080;

var server = new Hapi.Server();
server.connection({ port: PORT });

server.start(function () {

    console.log('Server is now running at:', server.info.uri);
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {

        reply('hello root!');
    }
});

server.route({
    method: 'GET',
    path: '/{uriSegment}',
    handler: function (request, reply) {

        reply('you visited: ' + request.params.uriSegment || request.path);
    }
});
