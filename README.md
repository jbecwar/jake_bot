# Jake Bot
[[https://github.com/jbecwar/jake_bot/blob/master/images/front_small.png|alt=octocat]]
Jake Bot is a small 6 wheeled robot. On board is a raspberry Pi that can independtly control each wheel motor independently.  A raspberry pi camera is mounted on server to allow the camera to pan.  Support is enabled for 3 more servos.

A REST api is enable.  A single page application is also served from the raspberry pi that allows you to drive Jake Bot from a web browser.

The LTC3780 will convert anything from 5V to 30V to the 5V that the raspberry pi and the wheels require.  It has enought on board filtering where I haven't had any problems with noise from the motors or the motor controllers.  The LTC3780, also supports shutting down when a low input voltage is detected.  You can use this feature to prevent over discharging your battery.  

Currently I'm using an RC style lithum battery, a 4S 6000 mAh.  This is over kill it makes up about 50% of the weight of the bot and the estimated run time is about 12 hours at full throttle.



# Parts
* Frame is a bogie rocker from: https://www.servocity.com/bogie
* Raspberry Pi 3
* 16 x 12 bit pwm controller https://www.adafruit.com/product/815
* Three DVR8833 DC/Servo contollers https://www.adafruit.com/product/3297
* LTC3780 DC 5V-32V To 1V-30V Automatic Step Up Down Regulator (ebay)


wsserver.js and static/http-live-player.js is based on the awesome work of [https://github.com/131/h264-live-player]