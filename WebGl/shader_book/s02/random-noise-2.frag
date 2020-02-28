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
    vec2 st = gl_FragCoord.xy / u_resolution.xy * 10.0;
    vec2 rper = u_resolution / 10.0;
    vec2 stFloor = floor(st);
    vec2 stFract = fract(st);
    
    vec2 docv = vec2(9.0 + floor(u_mouse.x /rper.x), 22.1297 + floor(u_mouse.y / rper.y));
    float factor = 30001.19;
    float rd = random(stFloor, docv, factor);

    vec3 color = vec3(rd, rd, rd);

    gl_FragColor = vec4(color,1.0);
}