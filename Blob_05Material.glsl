#ifdef VERT

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
varying vec4 vColor;

void main() {
  vec3 center = vec3(color.r*16.0-8.0, color.g*2.0-1.0, 0.0);
  vec3 offset = normal - center;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position + offset, 1.0);
  vec2 texCoord = (vec2(position - center)/0.15)*0.5 + 0.5;
  vColor = vec4(texCoord, 0.0, color.a);
}

#endif

#ifdef FRAG

//uniform sampler2D texture;
varying vec4 vColor;

void main() {
  vec2 uv = vColor.xy;
  float depth = vColor.w;
  vec3 c1 = vec3(255.0, 0.0, 50.0) / 255.0;
  vec3 c2 = vec3(251.0, 237.0, 82.0) / 255.0;
  vec3 c3 = vec3(255.0, 164.0, 122.0) / 255.0;
  vec3 c4 = vec3(88.0, 144.0, 127.0) / 255.0;
  //vec3 c = mix(vec3(0.8, 0.5, 0.2), vec3(0.9, 0.9, 0.0), vColor.r);
  vec3 c = mix(c3, c2, uv.x);
  c = mix(c, c4, depth);
  //c = c4;
  //c = mix(c, vec3(1.0), vColor.a);
  gl_FragColor = vec4(c, 0.5 + 1.0 - vColor.a);
  //gl_FragColor = vec4(c, 1.0);
  //gl_FragColor = vec4(depth, depth, depth, 1.0);
}

#endif
