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

    next();
};

exports.register.attributes = {
    name: 'static-files',
    version: '1.1.0'
};
