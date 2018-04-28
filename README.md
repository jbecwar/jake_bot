# Jake Bot

![Jake Bot](https://raw.githubusercontent.com/jbecwar/jake_bot/master/images/front_small.png)

Jake Bot is a small 6 wheeled robot that can be driven over the internet. On board is a raspberry Pi 3 that can control each wheel motor independently.  A raspberry pi camera is mounted on a server to allow the camera to pan.  Support is enabled in hardware and API to control 3 more servos.

A REST API is enabled.  A single page application is also served from the raspberry pi that allows you to drive Jake Bot from a web browser.  Currently you need a keyboard, but I'm planning on using nipple.js to allow mouse/touch to work too.

The LTC3780 will convert anything from 5V to 30V to the 5V that the raspberry pi and the wheels require.  It has enough on-board filtering where I haven't had any problems with noise from the motors or the motor controllers.  The LTC3780, also supports shutting down when a low input voltage is detected.  You can use this feature to prevent over discharging your battery.  

Currently I'm using an old spare RC style lithium battery, a 4S 6000 mAh.  A 4s 6000 mAh battery is about as large of a battery as you should put on this robot.  It makes up about 50% of the weight of the bot.  The estimated run time is about 12 hours at full throttle.

# Goals
A few years ago, I built a long range FPV quad copter.  While it was neat my young kids couldn't really fly it or help work on it.  The large carbon fiber props could hurt a young kid.  I wanted to build another FPV style project but make it "uncrashable” so my kids could operate it.  It was also an opportunity to have them be part of a robot/electronics project from the ground up.

# Parts
* Frame is a bogie rocker from: https://www.servocity.com/bogie
* Raspberry Pi 3
* 16 x 12 bit pwm controller https://www.adafruit.com/product/815
* Three DVR8833 DC/Servo controllers https://www.adafruit.com/product/3297
* LTC3780 DC 5V-32V To 1V-30V Automatic Step Up Down Regulator (eBay)

wsserver.js and static/http-live-player.js is based on the awesome work of [https://github.com/131/h264-live-player]

The printed camera case is from: 
[https://www.thingiverse.com/thing:127001]

