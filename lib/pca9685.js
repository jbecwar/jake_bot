var rpio = require("rpio");

// Registers/etc:
const PCA9685_ADDRESS = 0x40;
const MODE1 = 0x00;
const MODE2 = 0x01;
const SUBADR1 = 0x02;
const SUBADR2 = 0x03;
const SUBADR3 = 0x04;
const PRESCALE = 0xFE;
const LED0_ON_L = 0x06;
const LED0_ON_H = 0x07;
const LED0_OFF_L = 0x08;
const LED0_OFF_H = 0x09;
const ALL_LED_ON_L = 0xFA;
const ALL_LED_ON_H = 0xFB;
const ALL_LED_OFF_L = 0xFC;
const ALL_LED_OFF_H = 0xFD;

//Bits:
const RESTART = 0x80;
const SLEEP = 0x10;
const ALLCALL = 0x01;
const INVRT = 0x10;
const OUTDRV = 0x04;

var write8 = function write8(register, data) {
    rpio.i2cWrite(new Buffer([register, data]));
}


var init = function init() {
 rpio.i2cBegin();
 rpio.i2cSetSlaveAddress(PCA9685_ADDRESS);
 rpio.i2cSetBaudRate(100000);

    //TODO: this isn't quite right.  It effecitivly crashes the PCA9685 until the pi/board is rebooted.  If you run the adafruit example first, it works fine.  Need to figure out what is sent over the i2c bus to do init.

    //Initialize the PCA9685.
    //Setup I2C interface for the device.
    set_all_pwm(0, 0);
    //rpio.i2cWrite(new Buffer([MODE2, OUTDRV]));
    //rpio.i2cWrite(new Buffer([MODE1, ALLCALL]));
    //rpio.msleep(5); //wait or oscillator
    //rpio.i2cRead()
    //mode1 = self._device.readU8(MODE1)
    //mode1 = mode1 & ~SLEEP //wake up (reset sleep)
    //self._device.write8(MODE1, mode1)
    rpio.msleep(5)  //wait for oscillator


};

var set_all_pwm = function set_all_pwm(on, off) {
    //Sets all PWM channels.
    write8(ALL_LED_ON_L, on & 0xFF)
    write8(ALL_LED_ON_H, on >> 8)
    write8(ALL_LED_OFF_L, off & 0xFF)
    write8(ALL_LED_OFF_H, off >> 8)
};

var set_pwm = function set_pwm(channel, on, off) {
    //Sets a single PWM channel.
    write8(LED0_ON_L + 4 * channel, on & 0xFF)
    write8(LED0_ON_H + 4 * channel, on >> 8)
    write8(LED0_OFF_L + 4 * channel, off & 0xFF)
    write8(LED0_OFF_H + 4 * channel, off >> 8)
};

var close = function close()
{
    rpio.i2cEnd();
}

module.exports = {
    init,
    set_all_pwm,
    set_pwm,
    close
}


// init();
// //for (var i = 0; i < 100; i++) {
// //    set_pwm(0, 0, 4094 - (40 * i));
// //    rpio.msleep(2000);
// //}
// rpio.msleep(2000);
// for(var i =0; i <= 12; i=i+2)
// {
// set_pwm(i,0,4093);
// //set_pwm(0,0,4093);
// set_pwm(i+1,0,0);
// rpio.msleep(2000);
// }

// 
