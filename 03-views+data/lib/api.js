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

    next();
};


exports.register.attributes = {
    name: 'api-routes',
    version: '1.0.0'
};
