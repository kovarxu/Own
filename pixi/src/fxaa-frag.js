export default `precision highp float;
attribute vec2 TexCoord; // Texture coordinates
uniform sampler2D Tex1; // FBO texture
uniform float ScreenCoordX; // X Screen Coordinate
uniform vec2 FBS; // Frame Buffer Size

// Calculates the luminosity of a sample.
float FxaaLuma(vec3 rgb) {
    const vec3 lumafactor = vec3(0.299, 0.587, 0.114);
    return dot(rgb, lumafactor);
}
void main() {
    float FXAA_SPAN_MAX = 8.0;
    float FXAA_REDUCE_MUL = 1.0/8.0;
    float FXAA_REDUCE_MIN = 1.0/128.0;

    // Sample 4 texels including the middle one.
    // Since the texture is in UV coordinate system, the Y is
    // therefore, North direction is –ve and south is +ve.
    vec3 rgbNW = texture2D(Tex1, TexCoord+(vec2(-1.,-1.)/FBS)).xyz;
    vec3 rgbNE = texture2D(Tex1, TexCoord+(vec2(1.,-1.)/FBS)).xyz;
    vec3 rgbSW = texture2D(Tex1, TexCoord+(vec2(-1.,1.)/FBS)).xyz;
    vec3 rgbSE = texture2D(Tex1, TexCoord+(vec2(1.,1.)/FBS)).xyz;
    vec3 rgbM = texture2D(Tex1, TexCoord).xyz;

    float lumaNW = FxaaLuma(rgbNW); // Top-Left
    float lumaNE = FxaaLuma(rgbNE); // Top-Right
    float lumaSW = FxaaLuma(rgbSW); // Bottom-Left
    float lumaSE = FxaaLuma(rgbSE); // Bottom-Right
    float lumaM = FxaaLuma(rgbM); // Middle

    // Get the edge direction, since the y components are inverted
    // be careful to invert the resultant x
    vec2 dir;
    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
    dir.y = ((lumaNW + lumaSW) - (lumaNE + lumaSE));

    // Now, we know which direction to blur,
    // But far we need to blur in the direction?
    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *
        (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);
    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);

    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX), max(vec2(-
        FXAA_SPAN_MAX,-FXAA_SPAN_MAX), dir*rcpDirMin))/FBS;

    vec3 rgbA = (1.0/2.0)*(texture(Tex1, TexCoord.xy + dir *
        (1.0/3.0 - 0.5)).xyz + texture(Tex1, TexCoord.xy
        + dir * (2.0/3.0 - 0.5)).xyz);
    vec3 rgbB = rgbA * (1.0/2.0) + (1.0/4.0) * (texture(Tex1,
        TexCoord.xy + dir * (0.0/3.0 - 0.5)).xyz + texture
        (Tex1, TexCoord.xy + dir * (3.0/3.0 - 0.5)).xyz);

    float lumaB = FxaaLuma(rgbB);
    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE),
        min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE),
        max(lumaSW, lumaSE)));
    if((lumaB < lumaMin) || (lumaB > lumaMax)){
        gl_FragColor = vec4(rgbA, 1.0);
    }else{
        gl_FragColor = vec4(rgbB, 1.0);
    }
}`
