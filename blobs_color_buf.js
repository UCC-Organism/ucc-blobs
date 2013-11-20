var pex = pex || require('../build/pex');

Vec3 = pex.geom.Vec3;
Time = pex.utils.Time;
Platform = pex.sys.Platform;
MathUtils = pex.utils.MathUtils;
Geometry = pex.geom.Geometry;
Face3 = pex.geom.Face3;
Mesh = pex.gl.Mesh;
Color = pex.color.Color;
Texture2D = pex.gl.Texture2D;
sin = Math.sin;
cos = Math.cos;
random = Math.random;
RenderTarget = pex.gl.RenderTarget;
ScreenImage = pex.gl.ScreenImage;

pex.sys.Window.create({
  settings: {
    width: 1920,
    height: 1080,
    type: '3d',
    vsync: false,
    multisample: true,
    fullscreen: false,
    center: true
  },
  spreadRadius: 1.2,
  numBlobs: 300,
  numPointsPerBlob: 7,
  blobSize: 0.2,
  wobbleSize: 0.002,
  init: function() {
    this.camera = new pex.scene.PerspectiveCamera(60, this.width/this.height);
    this.arcball = new pex.scene.Arcball(this, this.camera, 3);
    this.framerate(30);

    this.rt = new RenderTarget(1280, 720, {depth:true});
    this.rtImage = new ScreenImage(this.rt.getColorAttachement(0), 0, 0, this.width, this.height, this.width, this.height);

    Time.verbose = true;

    var geom = new Geometry({vertices:true, faces:true, colors:true});
    var points = geom.vertices;
    var colors = geom.colors;
    var faces = geom.faces;
    var n = this.numPointsPerBlob;
    for(var i=0; i<this.numBlobs; i++) {
      var center = MathUtils.randomVec3(this.spreadRadius + Math.random());
      var pointOffset = points.length;
      points.push(center);
      var c = new Color(0.75+0.25*random(), 0.25+0.75*random(), 0.25+0.75*random(), 1.0);
      colors.push(c);
      for(var j=0; j<this.numPointsPerBlob; j++) {
        if (j < this.numPointsPerBlob) {
          var p = center.clone();
          p.x += this.blobSize * cos(j/(this.numPointsPerBlob-1) * 2 * Math.PI);
          p.y += this.blobSize * sin(j/(this.numPointsPerBlob-1) * 2 * Math.PI);
          p.z += 0;//this.blobSize * (random() - 0.5);
          points.push(p);
          var c = new Color(0.75+0.25*random(), 0.25+0.75*random(), 0.25+0.75*random(), 1.0);
          colors.push(c);
        }
        if (j < this.numPointsPerBlob - 2)
          faces.push(new Face3(i*(n+1), i*(n+1)+j+1, i*(n+1)+j+2));
        else if (j < this.numPointsPerBlob - 1)
          faces.push(new Face3(i*(n+1), i*(n+1)+j+1, i*(n+1)+1));
        //faces.push(new Face3(pointOffset, pointOffset + j, pointOffset + (j + 1) % (this.numPointsPerBlob + 1)));
      }
    }
    console.log(points.length, faces.length, this.numBlobs * (n+1))

    material = new pex.materials.ShowColors();

    //this.mesh = new Mesh(geom, material, { useEdges: true, primitiveType : this.gl.LINES })
    this.mesh = new Mesh(geom, material)
  },
  update: function() {
    var vertices = this.mesh.geometry.vertices;
    var t = Time.seconds
    for(var i=0; i<vertices.length; i++) {
      vertices[i].x += this.wobbleSize * sin(t * 5 + i/2);
      vertices[i].y += this.wobbleSize * cos(t * 5);
      vertices[i].z += this.wobbleSize * sin(t * 5);
    //  if ((i % this.numPointsPerBlob) == this.numPointsPerBlob - 1) {
    //    vertices[i].copy(vertices[i - this.numPointsPerBlob + 1]);
    //  }
    }
    vertices.dirty = true;
  },
  draw: function() {
    this.update();

    var gl = pex.gl.Context.currentContext.gl;
    gl.clearColor(1, 1, 1, 1);
    gl.lineWidth(2.0);
    //gl.clear(gl.COLOR_BUFFER_BIT);
    //gl.enable(gl.BLEND);
    //gl.blendFunc(gl.SRC_COLOR, gl.ONE);

    this.camera.setPosition(new Vec3(3 * cos(Time.seconds / 5), 1, 3 * sin(Time.seconds / 5)));

    this.rt.bind();
    gl.viewport(0, 0, this.rt.width, this.rt.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    this.mesh.draw(this.camera);
    this.rt.unbind();
    this.gl.viewport(0, 0, this.width, this.height);
    gl.disable(gl.DEPTH_TEST);
    this.rtImage.draw();
  }
});

