
const vt_shader = `#version 300 es

in vec4 a_position;
in vec3 a_normal;

uniform mat4 u_worldMatrix;
uniform mat4 u_matrix;

out vec3 v_normal;

void main () {
  vec3 changedNormal = mat3(u_worldMatrix) * a_normal;
  gl_Position = u_matrix * a_position;

  v_normal = changedNormal;
}
`

const fm_shader = `#version 300 es
precision mediump float;

in vec3 v_normal;
out vec4 outColor;

uniform vec3 u_reversedLightDirection;
uniform vec3 u_surfaceColor;

void main () {
  float light = dot(normalize(v_normal), u_reversedLightDirection);
  outColor = vec4(u_surfaceColor, 1.0);
  outColor.rgb *= light;
}
`