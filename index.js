'use strict';
const Path = require('path');
const Hapi = require('hapi');
const handlers = require('./handlers');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');
const Joi = require('joi');
const pwm = require("./lib/pca9685.js");
const ws = require("./wsserver.js");
const os = require("os");
const util = require('util')

process.on('uncaughtException', (err) => {
    console.error("Uncaugh Exception:");
    console.error(util.inspect(err, {depth:null,colors:true}));
    process.exit(-1);
});

const server = new Hapi.Server({
    port: 8000,
    host: '0.0.0.0',
    routes: {
        files: {
            relativeTo: Path.join(__dirname, "static")
        }
    }
});

const wss = new ws({ port: 8080 });

(async () => {
    const networkInterfaces = os.networkInterfaces();

    var ip = "127.0.0.1";

    Object.keys(networkInterfaces).forEach(key => {
        var a = networkInterfaces[key];
        if (Array.isArray(a)) {
            a.forEach((iface) => {
                if (iface.internal == false && iface.family == "IPv4") {
                    ip = iface.address;
                }
            })
        }
    });


    const swaggerOptions = {
        info: {
            title: 'Test API Documentation',
            version: Pack.version,
        },
        host: ip + ":8000"

    };

    await server.register(Inert);

    await server.register([
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    await server.register({
        plugin: require('good'),
        options: {
            ops: false,
            // ops: {
            //     interval: 10000
            // },
            reporters: {
                myConsoleReporter: [{
                    module: 'good-console'
                }, 'stdout']
            }
        }
    });

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
        path: '/setServo/{servoNumber}/{pulseLength}',
        handler: handlers.setServo,
        config: {
            tags: ['api'],
            validate: {
                params: {
                    servoNumber: Joi.number().required(),
                    pulseLength: Joi.number().required()
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
        handler: async (request, h) => { return h.redirect("/index.html") },
        config: { tags: ['app'] }
    });

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true,
                index: true,
            }
        }
    });

    await pwm.init();
    await pwm.set_pwm_freq(60);  //60hz is good for servos
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);

})();

