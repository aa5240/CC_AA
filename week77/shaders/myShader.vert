attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

uniform float u_time;
uniform float u_bass;

varying vec2 vTexCoord;
varying float vDisplacement;

void main() {
  vTexCoord = aTexCoord;

  // Calculate surface wave distortion based on bass energy
  float wave = sin(aPosition.x * 0.05 + u_time * 6.0) * cos(aPosition.y * 0.05 + u_time * 6.0);
  vec3 displacedPosition = aPosition + aNormal * (wave * u_bass * 40.0);

  vDisplacement = wave * u_bass;

  vec4 positionVec4 = vec4(displacedPosition, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
}