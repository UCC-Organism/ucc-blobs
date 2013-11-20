var plask = require('plask');

sin = Math.sin
cos = Math.cos

plask.simpleWindow({
  settings: {
    width: 1280,
    height: 720
  },
  init: function() {
    this.framerate(60);
    this.sprite = plask.SkCanvas.createFromImage(__dirname + '/assets/ring.png');
  },
  prevFrametime: 0,
  fpsTime: 0,
  fpsFrames: 0,
  numParticles: 1000,
  draw: function() {
    var canvas = this.canvas;
    canvas.drawColor(255, 0, 0, 255);

    var paint = this.paint;
    paint.setColor(255, 255, 255, 255);
    paint.setFill();
    paint.setXfermodeMode(paint.kPlusMode);

    this.fpsTime += (this.frametime - this.prevFrametime);
    this.fpsFrames++;
    if (this.fpsTime > 2) {
      this.fps = this.fpsFrames / this.fpsTime;
      console.log("FPS: " + this.fps);
      this.fpsTime = 0;
      this.fpsFrames = 0;
    }
    this.prevFrametime = this.frametime;

    var t = this.frametime;
    var s = 20;
    for(var i=0; i<this.numParticles; i++) {
      var x = this.width/2 + this.width/6 * (sin(t + i) + cos(t/5 + i/2));
      var y = this.height/2 + this.width/6 * (cos(t + i * 0.5));
      x += 50 * (sin(t + i/2) * cos(t + i*i));
      y += 50 * (sin(t + i/2) * cos(t + i*i));
      canvas.drawCanvas(paint, this.sprite, x, y, x + s, y + s);
    }
  }
})