precision mediump float;

varying vec2 vTexCoord;
varying float vDisplacement; // 3. Matching bridge variable here

uniform float u_time;
uniform float u_bass;
uniform float u_treble;

void main() {
  float r = sin(u_time * 2.0 + vTexCoord.x * 6.28 + u_bass * 3.0) * 0.5 + 0.5;
  float g = cos(u_time * 2.5 + vTexCoord.y * 6.28 + u_treble * 4.0) * 0.5 + 0.5;
  float b = clamp(0.3 + vDisplacement * 0.05, 0.0, 1.0);

  gl_FragColor = vec4(r, g, b, 1.0);
}