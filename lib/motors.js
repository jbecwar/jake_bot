const pwm = require("./pca9685.js");

const maxVector = 4093;
const motor1 = [0,1];
const motor2 = [2,3];
const motor3 = [4,5];
const motor4 = [6,7];
const motor5 = [8,9];
const motor6 = [10,11];

const leftMotors = [motor1,motor3,motor5];
const rightMotors = [motor2,motor4,motor6];
const allMotors = [motor1,motor2,motor3,motor4,motor5,motor6];

var set_pwm = function(pin,on_count)
{
    pwm.set_pwm(pin,0,on_count);
}

module.exports.setGroupSpeed = async function setGroupSpeed(x,y)
{
    var vectorLength = Math.sqrt((x*x)+(y*y));

    if(vectorLength>maxVector)
    {
        throw new Error("The vector defined by [X,Y] be larger than " + maxVector);
    }

    var leftSpeed = x;
    var rightSpeed =x;

    if(y>=0)
    {
        leftSpeed += y;
        rightSpeed -= y;
    }
    else
    {
        leftSpeed -= y;
        rightSpeed += y;
    }

    module.exports.setMotorsSpeed(leftMotors,leftSpeed);
    module.exports.setMotorsSpeed(rightMotors,rightSpeed);
   
};

module.exports.setMotorsSpeed = async function setMotorsSpeed(motors,speed)
{
    motors.forEach((motor)=>{
        module.exports.setMotorSpeed(motor,speed);
    })
}

module.exports.setMotorSpeed = async function setMotorSpeed(motor,speed)
{
    var absSpeed = Math.abs(speed);
    if(absSpeed>maxVector)
    {
        absSpeed = maxVector;
    }

    if(speed>=0)
    {
        
        set_pwm(motor[0],absSpeed);
        set_pwm(motor[1],0);
    }
    else
    {
        set_pwm(motor[0],0);
        set_pwm(motor[1],absSpeed);        
    }

}
