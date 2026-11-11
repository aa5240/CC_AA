precision mediump float;

varying vec2 vTexCoord;
varying float vDisplacement;

uniform float u_time;
uniform float u_bass;
uniform float u_treble;

void main() {
  // Color channel shifts driven by audio frequency bands
  float r = sin(u_time * 2.0 + vTexCoord.x * 6.28 + u_bass * 4.0) * 0.5 + 0.5;
  float g = cos(u_time * 2.5 + vTexCoord.y * 6.28 + u_treble * 4.0) * 0.5 + 0.5;
  float b = clamp(u_bass * 1.8 + vDisplacement * 0.5, 0.2, 1.0);

  gl_FragColor = vec4(r, g, b, 1.0);
}