const pwm = require("./pca9685.js");

module.exports.setServo = async function setServo(index,pulseLength)
{
    if(pulseLength < 150 || pulseLength > 600)
    {
        throw new Error("Pulse Length must be between 150 and 600");
    }

    if(index <1 || index >4 )
    {
        throw new Error("Servo index must be between 1 and 4")
    }

    pwm.set_pwm(11+index,0,pulseLength); 

}