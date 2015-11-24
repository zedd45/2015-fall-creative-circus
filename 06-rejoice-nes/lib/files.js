var Inert = require('inert');


exports.register = function (server, options, next) {

    server.register(Inert, function (err) {

        if (err) {
            throw err;
        }
    });

    server.route({
        method: 'GET',
        path: '/favicon.ico',
        handler: {
            file: [__dirname, '..', 'public/favicon.ico'].join('/')
        }
    });

    server.route({
        method: 'GET',
        path: '/assets/{filePath*}',
        handler: {
            directory: {
                path: [__dirname, '..', 'public'].join('/'),
                listing: true
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/assets/websocket-client.js',
        config: {
            handler: {
                file: __dirname + '/node_modules/nes/lib/client.js'
            },
            description: 'websocket client library'
        }
    });

    next();
};

exports.register.attributes = {
    name: 'static-files',
    version: '1.1.0'
};
