precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

uniform float u_time;
uniform float u_bass;

varying vec2 vTexCoord;
varying float vDisplacement; // 1. Bridge variable declared here

void main() {
  vTexCoord = aTexCoord;

  float wave = sin(aPosition.x * 0.05 + u_time * 5.0);
  float totalDisplacement = wave * u_bass * 40.0;
  
  // 2. Assign value to pass to fragment shader
  vDisplacement = totalDisplacement;

  vec3 displacedPosition = aPosition + aNormal * totalDisplacement;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(displacedPosition, 1.0);
}