// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (vec2 st, vec2 dotv, float factor) {
    return fract(sin(dot(st, dotv)) * factor);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 docv = vec2(9.0 + fract(u_time / 5.217), 225.1297);
    float factor = 10000.0 + u_time;
    float rd = random(st, docv, factor);

    vec3 color = vec3(rd, rd, rd);

    gl_FragColor = vec4(color,1.0);
}