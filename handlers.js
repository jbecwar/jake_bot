var motors = require("./lib/motors.js");

exports.setSpeed = async function setSpeed(request, h)
{
    var x = request.params.x;
    var y = request.params.y;

    return await motors.setGroupSpeed(x,y);
};

exports.stop = async function stop(request,h)
{
    return await motors.setGroupSpeed(0,0);
};

