var Path = require('path');

exports.register = function (server, options, next) {

    server.subscription('/chatroom-subscription');

    server.route({
        method: 'POST',
        path: '/chat',
        config: {
            // https://github.com/hapijs/nes/blob/master/PROTOCOL.md
            id: 'chat',
            handler: function (request, reply) {

                server.log('new message in: /chat', { message: request.payload.message });

                server.publish('/chatroom-subscription', { message: request.payload.message });
                return reply('message recieved');
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

    console.log(__dirname + '/public/chatapp.html')

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
    version: '1.0.0',
    dependencies: 'nes'
};
