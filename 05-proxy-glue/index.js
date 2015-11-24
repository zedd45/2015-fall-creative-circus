var Glue = require('glue');

var glueOptions = { relativeTo: __dirname + '/lib' };
var manifest = {
    server: {},
    connections: [{
        port: 8080,
        labels: ["server"],
        router: { stripTrailingSlash: true }
    }],
    // https://github.com/hapijs/glue#notes
    plugins: [{
        "blipp": {}
    }, {
        "inert": {}
    }, {
        "vision": {}
    }, {
        "h2o2": {}
    }, {
        "./files": {}
    }, {
        "./misc": {}
    }, {
        "./views": [{
            routes: {
                prefix: "/views"
            }
        }]
    }, {
        "./api": [{
            routes: {
                prefix: "/api"
            }
        }]
    }, {
        "good": {
            opsInterval: 1000,
            reporters: [{
                reporter: require('good-console'),
                events: { log: '*', request: '*', response: '*', error: '*',  }
            }]
        }
    }]
};

Glue.compose(manifest, glueOptions, function (err, server) {

    if (err) {
        server.log('error', {msg: err });
        throw err;
    }

    server.start(function () {

        server.log('info', 'Hapi Hapi Joi Joi!');
    });
});
