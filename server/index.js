const Hapi = require('@hapi/hapi');
const Inert = require("@hapi/inert");
const HapiReactViews = require('hapi-react-views');
const Vision = require('@hapi/vision');
const HapiSessionAuth = require('@hapi/cookie');

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
        }
    });

    await server.register([Inert,Vision,HapiSessionAuth]);


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
            const user = await UserModel.findOne({_id:session.id}).exec();
            if(user){
                return { valid: true, credentials: user };
            }else{
                return { valid: false}
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
            auth: false
        }
    })

    server.route({
        method: 'POST',
        path: "/login",
        handler: async function (request, h) {
            const { email, password } = request.payload;
            if(!email){
                return h.view("login")
            }
            if(!password){
                return h.view("login")
            }
            const user = await UserModel.findOne({email:email,password:password}).exec();
            if(user){
                request.cookieAuth.set({id:user._id})
                return h.redirect("/")
            }else{
                return h.view("login")
            }
        },
        options: {
            auth: {
                mode: "try"
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
            auth: false
        }
    })

    server.route({
        method: 'POST',
        path: "/register",
        handler: async function (request, h) {
            const { email, password } = request.payload;
            if(!email){
                return h.view("register");
            }
            if(!password){
                return h.view("register");
            }
            const user = await UserModel.findOne({email:email}).exec();
            console.log(user);
            if(user){
                return h.view("register");
            }else{
                const user = await UserModel.create({
                    email:email,
                    password:password
                })
                request.cookieAuth.set({id:user._id})
                return h.redirect("/")
            }
        },
        options: {
            auth: {
                mode: "try"
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
