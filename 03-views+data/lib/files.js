

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/favicon.ico',
        handler: {
            file: [__dirname, '..', '/public/favicon.ico'].join('/')
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
    version: '1.0.0'
};
