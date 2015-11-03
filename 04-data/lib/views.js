var Hoek = require('hoek');
var Vision = require('vision');

exports.register = function (server, options, next) {

    server.register(Vision, function (err) {

        Hoek.assert(!err, err);
    });

    server.views({
        engines: {
            hbs: require('handlebars')
        },
        relativeTo: [__dirname, '..'].join('/'),
        path: 'templates'
    });

    server.route({
        method: 'GET',
        path: '/example',
        handler: function (request, reply) {

            reply.view('example', {
                title: 'example of handlebars with hapi',
                name: 'Pea-tear-griffon',
            })
        }
    });

    server.route({
        method: 'GET',
        path: '/fb',
        handler: function (request, reply) {

            var fbdata = {};

            // get a copy of the fb data
            server.inject('/api/local/fb', function (res) {

                fbdata.result = res.result;

                fbdata = Hoek.merge(fbdata, {
                    title: 'using fixture data with views',
                });

                reply.view('fb', fbdata);
            });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'server-views',
    version: '1.0.1'
};
