var pex = pex || require('./lib/pex');

Vec3 = pex.geom.Vec3;
Time = pex.utils.Time;
Platform = pex.sys.Platform;
MathUtils = pex.utils.MathUtils;
Geometry = pex.geom.Geometry;
Mesh = pex.gl.Mesh;
Texture2D = pex.gl.Texture2D;
sin = Math.sin
cos = Math.cos

pex.sys.Window.create({
  settings: {
    width: 1920,
    height: 1080,
    type: '3d',
    vsync: true,
    multisample: true,
    fullscreen: Platform.isBrowser ? true : false,
    center: true
  },
  init: function() {
    this.camera = new pex.scene.PerspectiveCamera(60, this.width/this.height);
    this.arcball = new pex.scene.Arcball(this, this.camera, 3);
    this.framerate(60);

    Time.verbose = true;

    var geom = new Geometry({vertices:true, faces:false});
    var points = geom.vertices;
    var offset = new Vec3(0, 0, 0);
    for(var i=0; i<1000; i++) {
      points.push(MathUtils.randomVec3(0.75).add(offset));
    }

    var sprite = Texture2D.load('assets/ring.png');
    material = new pex.materials.PointSpriteTextured({texture: sprite});
    //var material = new pex.materials.Test();

    this.mesh = new Mesh(geom, material, { primitiveType : this.gl.POINTS })
    this.mesh.material.uniforms.pointSize = 30;
    this.mesh.material.uniforms.alpha = 0.95;
  },
  update: function() {
    var vertices = this.mesh.geometry.vertices;
    var t = Time.seconds
    for(var i=0; i<vertices.length; i++) {
      vertices[i].set(
        sin(t + i) + cos(t/5 + i/2),
        cos(t + i * 0.5),
        sin(t + i/2) * cos(t + i*i)
      );
    }
    vertices.dirty = true;
  },
  draw: function() {
    this.fpsTime += (this.frametime - this.prevFrametime);
    this.fpsFrames++;
    if (this.fpsTime > 2) {
      this.fps = this.fpsFrames / this.fpsTime;
      console.log("FPS: " + this.fps);
      this.fpsTime = 0;
      this.fpsFrames = 0;
    }
    this.prevFrametime = this.frametime;
    
    this.update();

    var gl = pex.gl.Context.currentContext.gl;
    gl.clearColor(1, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_COLOR, gl.ONE);

    this.camera.setPosition(new Vec3(3 * cos(Time.seconds / 5), 1, 3 * sin(Time.seconds / 5)));

    this.mesh.draw(this.camera);
  }
});

