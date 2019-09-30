const Hapi = require('@hapi/hapi');
const Inert = require("@hapi/inert");
const HapiReactViews = require('hapi-react-views');
const Vision = require('@hapi/vision');
const HapiSessionAuth = require('@hapi/cookie');
const HapiRbac = require('hapi-rbac');

const Path = require('path');

const Moment = require('moment');
const Bcrypt = require('bcrypt');

const UserModel = require('./models/user.js');

const mongoose = require("mongoose");

const config = require("../config");

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
        host : "localhost",
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
    const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 60 * 1000, cache: "sessionCache"});
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

    server.route({
        method: 'GET',
        path: "/login",
        handler: function (request, h) {
            return h.view("login")
        },
        options: {
            auth: false,
            plugins: {
                rbac: 'none'
            }
        }
    })

    server.route({
        method: 'POST',
        path: "/login",
        handler: async function (request, h) {
            const { email, password } = request.payload;
            let message = "";
            if(!email || !password){
                message = "email or password is missing!";
                return h.view("login",{message})
            }
            const user = await UserModel.findOne({email:email}).exec();
            if(user){
                const isValid = await Bcrypt.compare(password,user.password);
                if(isValid){
                    const uuid = user._id.toString();
                    await request.server.app.cache.set(uuid,{email:email,password:""},0)
                    request.cookieAuth.set({id:uuid});
                    return h.redirect("/");
                }
                message = "password not match!"
                return h.view("login",{message})
            }
            message = "email not registered!"
            return h.view("login",{message})
            
        },
        options: {
            auth: {
                mode: "try"
            },
            plugins: {
                rbac: 'none'
            }
        }
    })

    server.route({
        method: 'GET',
        path: "/register",
        handler: function (request, h) {
            return h.view("register")
        },
        options: {
            auth: false,
            plugins: {
                rbac: 'none'
            }
        }
    })

    server.route({
        method: 'POST',
        path: "/register",
        handler: async function (request, h) {
            let { email, password } = request.payload;
            let message = "";
            if(!email || !password){
                message = "email or password is missing!";
                return h.view("register",{message})
            }
            const user = await UserModel.findOne({email:email}).exec();
            if(!user){
                const salt = Bcrypt.genSaltSync(10);
                password = await Bcrypt.hash(password,salt);
                const user = await UserModel.create({
                    email:email,
                    password:password
                });
                const uuid = user._id.toString();
                await request.server.app.cache.set(uuid,{email:email,password:""},0);
                request.cookieAuth.set({id:uuid});
                return h.redirect("/");
            }
            message = "email have been registered!"
            return h.view("register",{message});
        },
        options: {
            auth: {
                mode: "try"
            },
            plugins: {
                rbac: 'none'
            }
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
