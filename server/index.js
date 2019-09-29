const Hapi = require('@hapi/hapi');
const Inert = require("@hapi/inert");
const HapiReactViews = require('hapi-react-views');
const Vision = require('@hapi/vision');

const Path = require('path');

const Moment = require('moment');
const Bcrypt = require('bcrypt');



require('@babel/register')({
    presets: ['@babel/preset-react', '@babel/preset-env']
});

const main = async () => {

    const server = Hapi.server({ 
        port: 4000 , 
        host : "localhost",
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    });

    await server.register([Inert,Vision]);

    //静态文件处理
    server.route({
        method: 'GET',
        path: '/public/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true
                // listing: true
            }
        }
    });

    //view处理
    server.views({
        engines: {
            jsx: HapiReactViews
        },
        compileOptions: {}, // optional
        relativeTo: __dirname,
        path: 'views',
        compileOptions: {
            layoutPath: Path.join(__dirname, 'views'),
            layout: 'layout'
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, h) {
            return h.view("home")
        }
    });

    server.route({
        method: 'GET',
        path: "/about",
        handler: function (request, h) {
            return h.view("about")
        }
    })

    //logger
    server.events.on('response', function (request) {
        // you can use request.log or server.log it's depends
        console.log(Moment().format("YYYY-MM-DD HH:mm:ss") + " " + request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.path + ' --> ' + request.response.statusCode);
    });

    await server.start();

    return server;
};

main()
.then((server) => console.log(`Server listening on ${server.info.uri}`))
.catch((err) => {
    console.error(err);
    process.exit(1);
});
