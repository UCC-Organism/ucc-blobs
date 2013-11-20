var pex = pex || require('./lib/pex');

Vec3 = pex.geom.Vec3;
Time = pex.utils.Time;
Time.fpsFrequency = 3;
GUI = pex.gui.GUI;
Platform = pex.sys.Platform;

pex.sys.Window.create({
  settings: {
    width: 1280,
    height: 720,
    type: '3d',
    vsync: true,
    multisample: true,
    fullscreen: false,
    center: true
  },
  boxes: [
    { position: new Vec3(0, 0, 0) }
  ],
  init: function() {
    this.camera = new pex.scene.PerspectiveCamera(60, this.width/this.height);
    this.arcball = new pex.scene.Arcball(this, this.camera, 2);
    this.mesh = new pex.gl.Mesh(new pex.geom.gen.Cube(), new pex.materials.Test());
    this.framerate(60);

    this.gui = new GUI(this);
    this.fpsLabel = this.gui.addLabel('Bla');

    if (Platform.isBrowser) this.text = document.getElementById('text');
  },
  dates:[],
  rotation: new Vec3(),
  draw: function() {
    var gl = pex.gl.Context.currentContext.gl;
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = 0.5;
    this.rotation.set(0.5/(Math.sqrt(0.5*0.5+0.5*0.5)), 0.5/(Math.sqrt(0.5*0.5+0.5*0.5)), 0);
    this.mesh.rotation.setAxisAngle(this.rotation, Time.seconds * 50);
    if ((Time.fps == 0 || Time.fps > 20 )) {
      this.boxes.push({
        position : new Vec3(
        -3 + 6 * Math.random(),
        -3 + 6 * Math.random(),
         0 - 3 * Math.random())
      });
    }
    else {
      //this.boxes.pop();
    }

    if (Time.frameNumber % 30 == 0) {
      var s = 'fps:' + Math.floor(Time.fps) + " " + this.boxes.length + " boxes";
      //this.fpsLabel.title = s;
      //this.fpsLabel.dirty = true;
      console.log(s);
    }

    if (this.text) this.text.innerHTML = Time.fps + "fps = " + this.boxes.length + " boxes s/" + this.stop;

    //this.boxes.forEach(function(b, i) {
    //  this.mesh.position = b.position;
    //  this.mesh.draw(this.camera);
    //}.bind(this))

    this.mesh.drawInstances(this.camera, this.boxes);

    //this.gui.draw();
  }
});

