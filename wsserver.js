"use strict";
//This code is based on upon h264-live-player

const WebSocketServer = require('ws').Server;
const Splitter = require('stream-split');
const merge = require('mout/object/merge');
const util = require('util');
const spawn     = require('child_process').spawn;

const NALseparator = new Buffer([0, 0, 0, 1]);//NAL break


class _Server {

  constructor(serverconfig, options) {


    this.options = {
      width: 960,
      height: 540,
      rotate: 270
      fps: 30,
    }

    this.wss = new WebSocketServer(serverconfig);

    this.new_client = this.new_client.bind(this);
    this.start_feed = this.start_feed.bind(this);
    this.broadcast = this.broadcast.bind(this);

    this.wss.on('connection', this.new_client);
    console.log("Websocket server running with config: ");
    console.log(serverconfig);
  }


  start_feed() {
    var readStream = this.get_feed();
    this.readStream = readStream;

    readStream = readStream.pipe(new Splitter(NALseparator));
    readStream.on("data", this.broadcast);
  }

  get_feed() {
    var msk = "raspivid -t 0 -o - -w %d -h %d -fps %d";
    var cmd = util.format(msk, this.options.width, this.options.height, this.options.fps);
    console.log(cmd);
    var streamer = spawn('raspivid', ['-t', '0', '-o', '-', '-w', this.options.width, '-h', this.options.height, '-fps', this.options.fps, '--rotation', this.options.rotate, '-pf', 'baseline']);
    streamer.on("exit", function (code) {
      console.log("Failure", code);
    });

    return streamer.stdout;
  }

  broadcast(data) {
    this.wss.clients.forEach(function (socket) {

      if (socket.buzy)
        return;

      socket.buzy = true;
      socket.buzy = false;

      socket.send(Buffer.concat([NALseparator, data]), { binary: true }, function ack(error) {
        socket.buzy = false;
      });
    });
  }

  new_client(socket) {

    var self = this;
    console.log('New guy');

    socket.send(JSON.stringify({
      action: "init",
      width: this.options.width,
      height: this.options.height,
    }));

    socket.on("message", function (data) {
      var cmd = "" + data, action = data.split(' ')[0];
      console.log("Incomming action '%s'", action);

      if (action == "REQUESTSTREAM")
        self.start_feed();
      if (action == "STOPSTREAM")
        self.readStream.pause();
    });

    socket.on('close', function () {
      self.readStream.end();
      console.log('stopping client interval');
    });
  }


};


module.exports = _Server;
