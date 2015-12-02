var Path = require('path');
var Moment = require('moment');

exports.register = function (server, options, next) {

    server.subscription('/chatroom-subscription');

    server.route({
        method: 'POST',
        path: '/chat',
        config: {
            // https://github.com/hapijs/nes/blob/master/PROTOCOL.md
            // id: 'chat',
            handler: function (request, reply) {

                var payload = request.payload;

                server.log('new message in: /chat', { message: request.payload.message });

                server.publish('/chatroom-subscription', {
                    message: payload.message,
                    timestamp: Moment().utc(),
                    username: payload.username
                });

                return reply('your chat message was processed');
            },
            description: 'Chat message handler'
        }
    });


    server.route({
        method: 'GET',
        path: '/assets/websocket-client.js',
        config: {
            handler: {
                // only Chrome can read the ES6 version; but the ES5 version errors in EVERY browser
                file: Path.join(__dirname, '..', 'node_modules/nes/lib/client.js')
            },
            description: 'websocket client library'
        }
    });


    server.route({
        method: 'GET',
        path: '/views/chatapp',
        config: {
            handler: {
                file: Path.join(__dirname, '..', 'public/chatapp.html')
            },
            description: 'websocket html static file'
        }
    });

    next();
};


exports.register.attributes = {
    name: 'websockets',
    version: '1.1.0',
    dependencies: 'nes'
};
