
const vt_shader = `#version 300 es

in vec2 a_position;
in vec2 a_textcoord;

uniform mat3 u_matrix;

out vec2 v_textcoord;

void main () {
  vec3 pos = u_matrix * vec3(a_position, 1);
  gl_Position = vec4(pos, 1);

  v_textcoord = a_textcoord;
}
`

const fm_shader = `#version 300 es
precision mediump float;

in vec2 v_textcoord;
out vec4 outColor;

uniform sampler2D u_texture;
uniform float u_kernel[9];
uniform float u_kernel_weight;

void main () {
  vec2 onePixel = vec2(1) / vec2(textureSize(u_texture, 0));

  vec4 colorSum = 
    texture(u_texture, v_textcoord + onePixel * vec2(-1, -1)) * u_kernel[0] + 
    texture(u_texture, v_textcoord + onePixel * vec2(0, -1)) * u_kernel[1] + 
    texture(u_texture, v_textcoord + onePixel * vec2(1, -1)) * u_kernel[2] + 
    texture(u_texture, v_textcoord + onePixel * vec2(-1, 0)) * u_kernel[3] + 
    texture(u_texture, v_textcoord + onePixel * vec2(0, 0)) * u_kernel[4] + 
    texture(u_texture, v_textcoord + onePixel * vec2(1, 0)) * u_kernel[5] + 
    texture(u_texture, v_textcoord + onePixel * vec2(-1, 1)) * u_kernel[6] + 
    texture(u_texture, v_textcoord + onePixel * vec2(0, 1)) * u_kernel[7] + 
    texture(u_texture, v_textcoord + onePixel * vec2(1, 1)) * u_kernel[8];

  outColor = vec4((colorSum / u_kernel_weight).rgb, 1);
}
`