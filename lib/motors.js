const maxVector = 4093;
const motor1 = [0,1];
const motor2 = [2,3];
const motor3 = [4,5];
const motor4 = [6,7];
const motor5 = [8,9];
const motor6 = [10,11];

const leftMotors = motor1.concat(motor3,motor5);
const rightMotors = motor2.concat(motor4,motor6);
const allMotors = motor1.concat(motor2,motor3,motor4,motor5,motor6);

module.exports.setGroupSpeed = async function setGroupSpeed(x,y)
{
    var vectorLength = Math.sqrt((x*x)+(y*y));

    if(vectorLength>maxVector)
    {
        throw new Error("The vector defined by [X,Y] be larger than " + maxVector);
    }

    return "OK";
};