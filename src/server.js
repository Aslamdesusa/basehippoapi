//import firebase from firebase
import * as firebase from 'firebase';

// import routes from routes
import routes from './routes'

// user hapi framwork on nodejs
const Hapi = require('hapi');

// require some npm modules
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');

const url = "https://basehippo.firebaseio.com/"




// validation function
const validate = async function (user, decoded, request) {
    // checks to see if the person is valid
    if (!user['_id']) {
        return { isValid: false };
    }
    else {
        return { isValid: true };
    }
};


const init = async () => {
    //creating a server
    const server = new Hapi.Server({
        port: 8080,
        routes: { cors: true }
    });
    const swaggerOptions = {
        info: {
            title: 'BaseHippo Test API Documentation'
        },
    };

    //register hapi swagger documentation
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    // cookie
    await server.register(require('hapi-auth-cookie'));
      server.auth.strategy('restricted', 'cookie',
      {
        ttl: 24 * 60 * 60 * 1000,
        password: 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy',
        cookie: 'basehippo',
        isSecure: false,
        redirectTo: '/',
        isSameSite: 'Lax'
      });

    //register hapi-auth-jwt2 for authentication
    await server.register(require('hapi-auth-jwt2'));

    server.auth.strategy('jwt', 'jwt',
        {
            key: 'vZiIpmTzqXHp8PpYXTwqc9SRQ1UAyAfC',
            validate: validate,
            verifyOptions: { algorithms: ['HS256'] }
        });

    await firebase.initializeApp({
      serviceAccount: "../basehippo-firebase-adminsdk-c3w73-fa9d80fef4.json",
      databaseURL: url
    });

    //registering all routes
    server.route(routes);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);

    console.log(`Database connection succeeded from ${url}`)
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();