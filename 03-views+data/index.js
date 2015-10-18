var Blipp = require('blipp');
var Hapi = require('hapi');
var Inert = require('inert');

var API = require('./lib/api');
var Files = require('./lib/files');
var Misc = require('./lib/misc');


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
    register: Inert,
    options: {}
}, {
    register: Misc,
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

