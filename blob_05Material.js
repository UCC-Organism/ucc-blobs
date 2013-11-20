define([
  'pex/materials/Material',
  'pex/gl/Context',
  'pex/gl/Program',
  'pex/geom/Vec4',
  'pex/utils/ObjectUtils',
  'lib/text!Blob_05Material.glsl'
  ], function(Material, Context, Program, Vec4, ObjectUtils, Blob_05MaterialGLSL) {

  function Blob_05Material(uniforms) {
    this.gl = Context.currentContext.gl;
    var program = new Program(Blob_05MaterialGLSL);

    var defaults = {
    };

    var uniforms = ObjectUtils.mergeObjects(defaults, uniforms);

    Material.call(this, program, uniforms);
  }

  Blob_05Material.prototype = Object.create(Material.prototype);

  return Blob_05Material;
});