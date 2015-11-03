

exports.register = function (server, options, next) {

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

    next();
};


exports.register.attributes = {
    name: 'misc-routes',
    version: '1.0.0'
};
