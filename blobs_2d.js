var plask = require('plask');

sin = Math.sin
cos = Math.cos

plask.simpleWindow({
  settings: {
    width: 1280,
    height: 720
  },
  prevFrametime: 0,
  fpsTime: 0,
  fpsFrames: 0,
  spreadRadius: 1.2,
  numBlobs: 100,
  numPointsPerBlob: 7,
  blobSize: 20,
  wobbleSize: 1,
  init: function() {
    this.framerate(60);

    this.time = 0;

    var points = this.points = [];
    for(var i=0; i<this.numBlobs; i++) {
      var center = { x:(Math.random()-0.5) * this.width + this.width/2, y:(Math.random()-0.5) * this.height + this.height/2, z:0}
      for(var j=0; j<this.numPointsPerBlob; j++) {
        var p = { x:center.x, y:center.y, z:center.z };
        p.x += this.blobSize * cos(j/(this.numPointsPerBlob-1) * 2 * Math.PI);
        p.y += this.blobSize * sin(j/(this.numPointsPerBlob-1) * 2 * Math.PI);
        p.z += this.blobSize * (Math.random() - 0.5);
        points.push(p);
      }
    }
  },
  update: function() {
    var vertices = this.points;
    var t = this.frametime;
    for(var i=0; i<vertices.length; i++) {
      vertices[i].x += this.wobbleSize * sin(t * 5 + i/2);
      vertices[i].y += this.wobbleSize * cos(t * 5);
      vertices[i].z += this.wobbleSize * sin(t * 5);
      if ((i % this.numPointsPerBlob) == this.numPointsPerBlob - 1) {
        var pp = vertices[i - this.numPointsPerBlob + 1];
        vertices[i].x = pp.x;
        vertices[i].y = pp.y;
        vertices[i].z = pp.z;
      }
    }
  },
  draw: function() {
    this.update();

    this.fpsTime += (this.frametime - this.prevFrametime);
    this.fpsFrames++;
    if (this.fpsTime > 2) {
      this.fps = this.fpsFrames / this.fpsTime;
      console.log("FPS: " + this.fps);
      this.fpsTime = 0;
      this.fpsFrames = 0;
    }
    this.prevFrametime = this.frametime;

    var canvas = this.canvas;
    canvas.drawColor(200, 200, 0, 255);

    var paint = this.paint;
    paint.setColor(255, 255, 255, 255);
    paint.setStroke();

    var points = this.points;

    for(var i=0; i<points.length-1; i++) {
      if ((i % this.numPointsPerBlob) < this.numPointsPerBlob - 1) {
        canvas.drawLine(paint, points[i].x, points[i].y, points[i+1].x, points[i+1].y);
      }
    }
  }
});

