var rpio = require("rpio");

//Based on code from Adafruit: https://github.com/adafruit/Adafruit_Python_PCA9685/blob/master/Adafruit_PCA9685/PCA9685.py

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
    rpio.i2cWrite(Buffer.from([register, data]));
}

var read8 = function read8(register)
{
    var out = new Buffer.alloc(1);
    rpio.i2cWrite(Buffer.from([register]));
    rpio.i2cRead(out,1);
    return out.readInt8(0);
}


var init = function init() {
    rpio.i2cBegin();
    rpio.i2cSetSlaveAddress(PCA9685_ADDRESS);
    rpio.i2cSetBaudRate(100000);

    write8(ALL_LED_ON_L, 0x00);
    write8(ALL_LED_ON_H, 0x00);
    write8(ALL_LED_OFF_L, 0x00);
    write8(ALL_LED_OFF_H, 0x00);
    write8(MODE2, OUTDRV);
    write8(MODE1, ALLCALL);
    rpio.msleep(5)  //wait for oscillator
    var mode1 = read8(MODE1);
    mode1 = mode1 & ~SLEEP //wake up (reset sleep)
    write8(MODE1,mode1);
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

var close = function close() {
    rpio.i2cEnd();
}

var set_pwm_freq = function set_pwm_freq(freq_hz)
{
        var prescaleval = 25000000.0;    // 25MHz
        prescaleval = prescaleval/ 4096.0;       // 12-bit
        prescaleval = prescaleval /freq_hz;
        prescaleval = prescaleval - 1.0;
        
        prescale = Math.floor(prescaleval + 0.5);
        
        oldmode = readU8(MODE1);
        newmode = (oldmode & 0x7F) | 0x10    // sleep
        write8(MODE1, newmode)  // go to sleep
        write8(PRESCALE, prescale);
        write8(MODE1, oldmode);
        rpio.msleep(5);
        write8(MODE1, oldmode | 0x80)
}
module.exports = {
    init,
    set_all_pwm,
    set_pwm,
    close
}

