
exports.register = function (server, options, next) {

    server.subscription('/chatroom');

    server.route({
        method: 'POST',
        path: '/chatroom',
        config: {
            id: 'chatroom',
            handler: (request, reply) => {

                server.log('new message in: /chatroom');

                server.publish('/chatroom', { message: request.payload.message });
                return reply('message recieved');
            },
            description: 'Chat message handler'
        }
    });

    next();
};


exports.register.attributes = {
    name: 'websockets',
    version: '1.0.0',
    dependencies: 'nes'
};
