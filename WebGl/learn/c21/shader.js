
const vt_shader = `#version 300 es

in vec4 a_position;
in vec3 a_normal;

uniform vec3 u_lightPosition;
uniform vec3 u_cameraPosition;
uniform mat4 u_lightMatrix;
uniform mat4 u_normalMatrix;
uniform mat4 u_moveMatrix;

out vec3 v_normal;
out vec3 v_surfaceToLight;
out vec3 v_surfaceToCamera;

void main () {
  gl_Position = u_moveMatrix * a_position;

  vec3 changedNormal = mat3(u_normalMatrix) * a_normal;
  vec3 surfaceWorldPosition = (u_lightMatrix * a_position).xyz;

  v_normal = changedNormal;
  v_surfaceToLight = u_lightPosition - surfaceWorldPosition;
  v_surfaceToCamera = u_cameraPosition - surfaceWorldPosition;
  // v_centerOfLightAndCamera = normalize(surfaceToLight) + normalize(surfaceToCamera);
}
`

const fm_shader = `#version 300 es
precision mediump float;

in vec3 v_normal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToCamera;
out vec4 outColor;

uniform float u_shiness;
uniform vec3 u_surfaceColor;
uniform vec3 u_lightDirection;
// uniform float u_limit;
uniform float u_innerLimit;
uniform float u_outerLimit;

void main () {
  vec3 normalizedStoL = normalize(v_surfaceToLight);
  vec3 normalizedStoC = normalize(v_surfaceToCamera);
  vec3 centerOfLightAndCamera = normalizedStoL + normalizedStoC;

  float light = 0.0;
  float specular = 0.0;
  float factor = 1.0;

  float dotFromDirection = dot(normalizedStoL, -normalize(u_lightDirection));

  if (dotFromDirection >= u_outerLimit) {
    factor = smoothstep(u_outerLimit, u_innerLimit, dotFromDirection);

    light = factor * dot(normalize(v_normal), normalizedStoL);

    if (light > 0.0) {
      specular = factor * pow(dot(normalize(v_normal), normalize(centerOfLightAndCamera)), u_shiness);
    }
  }

  outColor = vec4(u_surfaceColor, 1.0);
  outColor.rgb *= light;
  outColor.rgb += specular;
}
`