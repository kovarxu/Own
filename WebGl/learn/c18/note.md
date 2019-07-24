## lighting, directional lighting

directional light is simple

follow the following steps:

1. get the normal direction of all surfaces (put them on vertices)

2. choose a light direction

3. in vertex shader -->> pass v_normal direction to framgent shader

   in fragment shader -->> get u_reverseLightDirection and v_normal
                           calc dot(light * normal)
                           use (u_color.rgb *= dot_result) as the final color

**Attention: we should always use normalized vector in lighting.**
