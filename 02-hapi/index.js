var Hapi = require('hapi');
var Inert = require('inert');

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

        var response = encodeURIComponent(request.params.uriSegment || request.path);
        reply('you visited: ' + response);
    }
});


server.register(Inert, function (err) {

   if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/favicon.ico',
        handler: {
            file: __dirname + '/public/favicon.ico'
        }
    });

    server.route({
        method: 'GET',
        path: '/assets/{filePath*}',
        handler: {
            directory: {
                path: __dirname + '/public',
                listing: true
            }
        }
    });

});


server.route({
    method: 'GET',
    path: '/api/local/{jsonFile*}',
    handler: function (request, reply) {

        var filePath = [__dirname, 'fixtures', encodeURIComponent(request.params.jsonFile)].join("/");
        reply.file(filePath);
    }
});
