'use strict';

const Hapi = require('hapi');
const handlers = require('./handlers');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');
const Joi = require('joi');
const pwm = require("./lib/pca9685.js");

const server = new Hapi.Server({ port: 3000, host: 'localhost' });

const swaggerOptions = {
    info: {
        title: 'Test API Documentation',
        version: Pack.version,
    },
};


server.route({
    method: 'PUT',
    path: '/setSpeed/{x}/{y}',
    handler: handlers.setSpeed,
    config: {
        tags: ['api'],
        validate: {
            params: {
                x: Joi.number().required(),
                y: Joi.number().required()
            },
        }
    }
});

server.route({
    method: 'PUT',
    path: '/setMotor/{motor}/{speed}',
    handler: handlers.setSpeedMotor,
    config: {
        tags: ['api'],
        validate: {
            params: {
                motor: Joi.number().required(),
                speed: Joi.number().required()                
            },
        }
    }
});

server.route({
    method: 'PUT',
    path: '/stop',
    handler: handlers.stop,
    config: { tags: ['api'] }
});

server.route({
    method: 'GET',
    path: '/',
    handler: async (request,h) =>{ return h.file("./app.html")},
    config: { tags: ['app'] }
});

(async () => {
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    await server.register({
        plugin: require('good'),
        options: {
            ops:false,
            // ops: {
            //     interval: 10000
            // },
            reporters: {
                myConsoleReporter: [ {
                    module: 'good-console'
                }, 'stdout']
            }
        }
    });

await pwm.init();
await server.start();
console.log(`Server running at: ${server.info.uri}`);

}) ();

