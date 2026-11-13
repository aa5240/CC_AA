precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

// Uniform variables received from p5.js
uniform float u_time;
uniform float u_bass;

varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;

  // Wave calculation combining spatial position, time, and bass amplitude
  float wave = sin(aPosition.x * 0.05 + u_time * 5.0);
  
  // Push vertices outward along normal vectors proportional to bass energy
  vec3 displacedPosition = aPosition + aNormal * (wave * u_bass * 45.0);

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(displacedPosition, 1.0);
}