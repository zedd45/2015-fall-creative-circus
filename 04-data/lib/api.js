var Boom = require('boom');
var Fs = require('fs');
var Hoek = require('hoek');
var Joi = require('joi');
var Url = require('url');
var Wreck = require('wreck');

const GITHUB_HOST = "api.github.com";


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
        path: '/github/repos/',
        config: {
            validate: {
                query: Joi.object({
                    q: Joi.string().required().min(2).description('search keywords, as well as any qualifiers').example('https://developer.github.com/v3/search/#search-repositories'),
                    sort: Joi.string().optional().allow(['','stars', 'forks', 'updated']).default(''),
                    order: Joi.string().optional().allow(['asc', 'desc']).default('desc')
                }).with('order', 'sort')
            }
        },
        handler: function (request, reply) {

            var uri = Url.format({
                protocol: "https",
                hostname: GITHUB_HOST,
                pathname: "search/repositories",
                query:{
                    q: encodeURIComponent(request.query.q),
                    sort: encodeURIComponent(request.query.sort),
                    order: encodeURIComponent(request.query.order)
                }
            });

            var wreckOptions = {
                 timeout: 1500,
                 json: 'force',
                 headers: {
                    // required for Github; https://developer.github.com/v3/#user-agent-required
                    "User-Agent": "GITHUB_USERNAME"
                 }
            };


            console.log('uri: ', uri);

            Wreck.get(uri, wreckOptions, function (err, response, payload) {

                if (err) {
                    var msg = 'problem reading from Github:';
                    var badGateway = Boom.badGateway(msg, {err: err});
                    console.error(msg, err);
                    return reply(badGateway);
                }

                if (response.statusCode >= 400) {
                    var msg = 'Github returned an HTTP status code corresponding to an error:';
                    var httpError = Boom.create(response.statusCode, msg, {payload: payload});
                    console.error(msg);
                    return reply(httpError);
                }

                return reply(payload).code(response.statusCode);
            });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'api-routes',
    version: '1.1.0'
};
