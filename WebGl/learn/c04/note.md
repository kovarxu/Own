### winding F

this example is based on c03

* be coutious that multiply(a * b) means matrix(b) mul matrix(a), not a * b

* the util function m3mul(a, b) means b * a

* our rotation is clockwise, which defalut to be anti-clockwise

### turn coordinate conversion to matrix calculation

we can conclude coordination change to matrix,

1. vec2 relpos = (u_matcontrol * vec3(a_position, 1.0)).xy;
2. vec2 ratio = relpos / u_resolution; // [1/w, 0, 0, 0, 1/h, 0, 0, 0, 1]
3. vec2 clipSpace = ratio * 2.0 - 1.0; // [2/w, 0, 0, 0, 2/h, 0, -1, -1, 1]
4. gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1); // [2/w, 0, 0, 0, -2/h, 0, -1, 1, 1]
