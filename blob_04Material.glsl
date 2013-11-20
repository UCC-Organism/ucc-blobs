#ifdef VERT

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
attribute vec3 position;
attribute vec4 color;
varying vec4 vColor;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vec3 center = vec3(color.r*8.0-4.0, color.g*2.0-1.0, 0.0);
  vec2 texCoord = (vec2(position - center)/0.15)*0.5 + 0.5;
  vColor = vec4(texCoord, 0.0, color.a);
}

#endif

#ifdef FRAG

//uniform sampler2D texture;
varying vec4 vColor;

void main() {
  //gl_FragColor = texture2D(texture, vTexCoord);
  //gl_FragColor = vec4(1.0, vColor.a, vColor.a, 0.5 + vColor.r*0.5);
  //gl_FragColor = vec4(1.0, vColor.a, vColor.a, vColor.a);
  vec3 c = mix(vec3(0.2, 0.5, 0.8), vec3(0.2, 0.9, 0.5), vColor.r);
  gl_FragColor = vec4(c, vColor.a);
}

#endif
