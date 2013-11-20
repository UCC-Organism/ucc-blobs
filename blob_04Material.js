define([
  'pex/materials/Material',
  'pex/gl/Context',
  'pex/gl/Program',
  'pex/geom/Vec4',
  'pex/utils/ObjectUtils',
  'lib/text!Blob_04Material.glsl'
  ], function(Material, Context, Program, Vec4, ObjectUtils, Blob_04MaterialGLSL) {

  function Blob_04Material(uniforms) {
    this.gl = Context.currentContext.gl;
    var program = new Program(Blob_04MaterialGLSL);

    var defaults = {
    };

    var uniforms = ObjectUtils.mergeObjects(defaults, uniforms);

    Material.call(this, program, uniforms);
  }

  Blob_04Material.prototype = Object.create(Material.prototype);

  return Blob_04Material;
});