var H2o2 = require('h2o2');
var Hoek = require('hoek');
var Vision = require('vision');


exports.register = function (server, options, next) {

    server.register([Vision, H2o2], function (err) {

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


    server.route({
        method: 'GET',
        path: '/github/repos',
        handler: function (request, reply) {

            var q = encodeURIComponent(request.query.q);

            server.inject('/api/github/repos/?q=' + q, function (res) {

                reply.view('github-repos', Hoek.merge(res.result, {
                    title: 'Github Repos for query: ' + q,
                    query: q
                }));
            });
        }
    });


    server.route({
        method: 'GET',
        path: '/google/translate/labnol',
        handler: {
            proxy: {
                uri: "http://translate.google.com/translate?sl=ja&tl=en&u=http://www.labnol.org/"
            }
        }
    });


    next();
};


exports.register.attributes = {
    name: 'server-views',
    version: '2.0.0'
};
