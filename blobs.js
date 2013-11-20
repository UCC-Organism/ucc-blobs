var pex = pex || require('./lib/pex');

Vec3 = pex.geom.Vec3;
Time = pex.utils.Time;
Platform = pex.sys.Platform;
MathUtils = pex.utils.MathUtils;
Geometry = pex.geom.Geometry;
Edge = pex.geom.Edge;
Mesh = pex.gl.Mesh;
Texture2D = pex.gl.Texture2D;
sin = Math.sin
cos = Math.cos

pex.sys.Window.create({
  settings: {
    width: 1280,
    height: 720,
    type: '3d',
    vsync: true,
    multisample: true,
    fullscreen: Platform.isBrowser ? true : false,
    center: true
  },
  spreadRadius: 1.2,
  numBlobs: 100,
  numPointsPerBlob: 7,
  blobSize: 0.1,
  wobbleSize: 0.002,
  init: function() {
    this.camera = new pex.scene.PerspectiveCamera(60, this.width/this.height);
    this.arcball = new pex.scene.Arcball(this, this.camera, 3);
    this.framerate(60);

    Time.verbose = true;

    var geom = new Geometry({vertices:true, faces:false, edges:true});
    var points = geom.vertices;
    var edges = geom.edges;
    for(var i=0; i<this.numBlobs; i++) {
      var center = MathUtils.randomVec3(this.spreadRadius);
      var pointOffset = points.length;
      for(var j=0; j<this.numPointsPerBlob; j++) {
        var p = center.clone();
        p.x += this.blobSize * cos(j/(this.numPointsPerBlob-1) * 2 * Math.PI);
        p.y += this.blobSize * sin(j/(this.numPointsPerBlob-1) * 2 * Math.PI);
        p.z += this.blobSize * (Math.random() - 0.5);
        points.push(p);
        if (j < this.numPointsPerBlob)
          edges.push(new Edge(pointOffset + j, pointOffset + (j + 1) % this.numPointsPerBlob));
      }
    }

    material = new pex.materials.SolidColor();

    this.mesh = new Mesh(geom, material, { useEdges: true, primitiveType : this.gl.LINES })
  },
  update: function() {
    var vertices = this.mesh.geometry.vertices;
    var t = Time.seconds
    for(var i=0; i<vertices.length; i++) {
      vertices[i].x += this.wobbleSize * sin(t * 5 + i/2);
      vertices[i].y += this.wobbleSize * cos(t * 5);
      vertices[i].z += this.wobbleSize * sin(t * 5);
      if ((i % this.numPointsPerBlob) == this.numPointsPerBlob - 1) {
        vertices[i].copy(vertices[i - this.numPointsPerBlob + 1]);
      }
    }
    vertices.dirty = true;
  },
  draw: function() {
    this.update();

    var gl = pex.gl.Context.currentContext.gl;
    gl.clearColor(0.8, 0.8, 0, 1);
    gl.lineWidth(2.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_COLOR, gl.ONE);

    this.mesh.draw(this.camera);
  }
});

