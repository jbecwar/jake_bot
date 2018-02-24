'use strict';

const Hapi = require('hapi');
const handlers = require('./handlers');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');
const Joi = require('joi');

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
    path: '/stop',
    handler: handlers.stop,
    config: { tags: ['api'] }
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

await server.start();
console.log(`Server running at: ${server.info.uri}`);

}) ();

