const Hapi = require('@hapi/hapi');
const Inert = require("@hapi/inert");
const Vision = require('@hapi/vision');
const HapiSessionAuth = require('@hapi/cookie');
const HapiRbac = require('hapi-rbac');

const Path = require('path');
const Moment = require('moment');

const mongoose = require("mongoose");

const config = require("../config");
const routes = require("./routes");

function connect() {
  mongoose.connection
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', ()=>{console.log("db connected successfully!")});
  return mongoose.connect(config.mongo, { keepAlive: 1, useNewUrlParser: true });
}

require('@babel/register')({
    presets: ['@babel/preset-react', '@babel/preset-env']
});

const main = async () => {
    connect();

    const server = Hapi.server({ 
        port: 4000 , 
        host : "0.0.0.0",
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        },
        cache : [{
            name: 'sessionCache',
            provider: {
              constructor: require('catbox-mongodb'),
              options: {
                uri       : 'mongodb://149.28.149.49:27017', // Defaults to 'mongodb://127.0.0.1:27017/?maxPoolSize=5'
                partition : 'session-cache'
              }
            }
        }]
    });

    await server.register([
        Inert,
        Vision,
        HapiSessionAuth,
        {
            plugin: HapiRbac,
            options: {
                policy: {
                    // target: { 'credentials:group': 'readers' },
                    apply: 'deny-overrides', // Combinatory algorithm
                    rules: [
                        {
                          target: { 'credentials:email': 'gong.wenlan@163.com' },
                          effect: 'deny'
                        },
                        {
                          effect: 'permit'
                        }
                    ]
                }
            } 
        }
    ]);

    const cache = server.cache({ segment: 'sessions', expiresIn: 24 * 60 * 1000 * 60, cache: "sessionCache"});
    server.app.cache = cache;

    server.auth.strategy('session', 'cookie', {
        cookie: {
            name: 'sid-test-devin-gong',
            password: '12345678901234567890123456789012345678901234567890123456789',
            isSecure: false,
            isHttpOnly: true, 
            ttl: 3*1000*60*60*24
        },
        redirectTo: '/login',
        validateFunc: async (request, session) => {
            let account = await cache.get(session.id);
            if(account){
                return {
                    valid: true,
                    credentials: account
                }
            }else{
                return {
                    valid: false
                }
            }
        }
    });

    server.auth.default('session');

    //view处理
    server.views({
        engines: {
                html: require('handlebars')
            },
            relativeTo: __dirname,
            path: './views',
            layoutPath: './views/layouts',
            layout: 'layout',
            helpersPath: './views/helpers',
            partialsPath: './views/partials'
    });

    //路由
    await server.route(routes);

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
