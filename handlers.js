var motors = require("./lib/motors.js");

exports.setSpeed = async function setSpeed(request, h)
{
    var x = request.params.x;
    var y = request.params.y;

    await motors.setGroupSpeed(x,y);
    return "OK"
};

exports.stop = async function stop(request,h)
{
    await motors.setGroupSpeed(0,0);
    return "OK"
};

exports.setSpeedMotor = async function setSpeedMotor(request,h)
{
    var speed = request.params.speed;    
    var motor = request.params.motor;

    await motors.setMotorSpeed(motor, speed);
    return "OK";
}

