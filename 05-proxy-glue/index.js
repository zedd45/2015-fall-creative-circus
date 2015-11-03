var Blipp = require('blipp');
var Hapi = require('hapi');

var API = require('./lib/api');
var Files = require('./lib/files');
var Misc = require('./lib/misc');
var Views = require('./lib/views');


const PORT = 8080;

var server = new Hapi.Server();
server.connection({ port: PORT });


server.register([{
    register: API,
    options: {},
    routes: {
        prefix: "/api"
    }
}, {
    register: Blipp,
    options: {}
}, {
    register: Misc,
    options: {}
}, {
    register: Files,
    options: {}
}, {
    register: Views,
    options: {},
    routes: {
        prefix: "/views"
    }
}], function (err) {

    if (err) {
        throw err;
    }

    server.start(function () {

        // server must have a callback
    });
});

