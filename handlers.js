var motors = require("./lib/motors.js");

exports.setSpeed = async function setSpeed(request, h) {
    var x = request.params.x;
    var y = request.params.y;

    await motors.setGroupSpeed(x, y);
    return "OK"
};

exports.stop = async function stop(request, h) {
    await motors.setGroupSpeed(0, 0);
    return "OK"
};

exports.setSpeedMotor = async function setSpeedMotor(request, h) {
    var speed = request.params.speed;
    var motor = request.params.motor;

    var motorArray;

    switch (motor) {
        case 1:
            motorArray = motors.config.motor1;
            break;
        case 2:
            motorArray = motors.config.motor2;
            break;
        case 3:
            motorArray = motors.config.motor3;
            break;
        case 4:
            motorArray = motors.config.motor4;
            break;
        case 5:
            motorArray = motors.config.motor5;
            break;
        case 6:
            motorArray = motors.config.motor6;
            break;
        default:
            throw new Error("Unsupported Motor Number");
    }

    await motors.setMotorSpeed(motorArray, speed);
    return "OK";
}

