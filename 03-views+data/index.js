var Blipp = require('blipp');
var Fs = require('fs');
var Hapi = require('hapi');
var Hoek = require('hoek');
var Inert = require('inert');

var Files = require('./lib/files');


const PORT = 8080;

var server = new Hapi.Server();
server.connection({ port: PORT });


server.register([{
    register: Blipp,
    options: {}
}, {
    register: Inert,
    options: {}
}, {
    register: Files,
    options: {}
}], function (err) {

    if (err) {
        throw err;
    }

    server.start(function () {

        // server must have a callback
    });
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


server.route({
    method: 'GET',
    path: '/api/local/{jsonFile*}',
    handler: function (request, reply) {

        var filePath = [__dirname, 'fixtures', encodeURIComponent(request.params.jsonFile)].join('/');
        reply.file(filePath);
    }
});

server.route({
    method: 'GET',
    path: '/api/local/fb',
    handler: function (request, reply) {

        var rawFile = Fs.readFileSync(__dirname + '/fixtures/facebook.json', 'utf-8');
        parsedJson = JSON.parse(rawFile);

        var transformedJson = Hoek.transform(parsedJson.data, {
            'messageId': 'id',
            'message': 'message',
            'name': 'from.name',
            'userId': 'from.id',
            'createdTimestamp': 'created_time',
            // JS property order is not guaranteed; YMMV
            'comment': 'actions.0.link',
            'like': 'actions.1.link'
        });

        reply(transformedJson);
    }
});
