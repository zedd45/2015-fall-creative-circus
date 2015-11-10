var Glue = require('glue');

var glueOptions = { relativeTo: __dirname + '/lib' };
var manifest = {
    server: {},
    connections: [{
        port: 8080,
        labels: ["server"]
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
                events: { log: '*', response: '*' }
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

        console.log('Hapi Hapi Joi Joi!');
    });
});
