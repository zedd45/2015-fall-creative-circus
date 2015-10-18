var Boom = require('boom');
var Fs = require('fs');
var Hoek = require('hoek');
var Url = require('url');
var Wreck = require('wreck');

const TRULIA_HOST = "http://api.trulia.com";
const TRULIA_PATH = "webservices.php";
const TRULIA_API_KEY = process.env.TRULIA_API_KEY;


exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/local/{jsonFile*}',
        handler: function (request, reply) {

            var filePath = [__dirname, 'fixtures', '..', encodeURIComponent(request.params.jsonFile)].join('/');
            reply.file(filePath);
        }
    });

    server.route({
        method: 'GET',
        path: '/local/fb',
        handler: function (request, reply) {

            var rawFile = Fs.readFileSync(__dirname + '/../fixtures/facebook.json', 'utf-8');
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


    server.route({
        method: 'GET',
        path: '/trulia/cities',
        handler: function (request, reply) {

            var uri = Url.format({
                hostname: TRULIA_HOST,
                pathname: TRULIA_PATH,
                query:{
                    "library": "LocationInfo",
                    "function": "getCitiesInState",
                    "state": "GA",
                    "apikey": TRULIA_API_KEY,
                }
            });

            var wreckOptions = {
                 timeout: 1500,
                 json: true,
            };

            require('purdy')(wreckOptions);

            Wreck.get(uri, wreckOptions, function (err, payload) {

                if (err) {
                    var msg = 'problem reading from Trulia:';
                    var badGateway = Boom.badGateway(msg, {err: err});
                    console.error(msg, err);
                    return reply(badGateway);
                }

                return reply(payload);
            });
        }
    });

    next();
};


exports.register.attributes = {
    name: 'api-routes',
    version: '1.0.0'
};
