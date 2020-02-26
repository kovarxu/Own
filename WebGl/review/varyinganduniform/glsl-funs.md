## GLSL内建函数

### 角度与三角函数

1. radians(degrees)
2. degrees(radians)
3. sin, cos, tan, asin, acos, atan

### 指数函数

1. pow(x, i), exp, log, exp2, log2, sqrt, inversesqrt

### 常用函数

1. abs, sign, floor, ceil, mod, min(x,y), max(x,y), fract
2. clamp(x, min, max) 返回 min(max(x, min), max)
3. mix(x, y, a) 返回x和y的线性混合，即 x(1-a) + ya
4. step(edge, x) 如果x < edge返回0, 否则返回1
5. smoothstep(edge0, edge1, x) 如果x < edge0返回0.0，如果x > edge1 返回1.0，否则在此范围内使用Hermit插值（t\*t\*(3-2t)）

### 几何函数

1. length(vec) 返回矢量的模
2. distance(vec1, vec2) 返回length(vec2 - vec1)
3. vec3 cross(vec3 x, vec3 y)
4. normalize(vec) 归一化矢量
5. faceforward(N, I, ref) 朝向，用于计算一个矢量是否朝向一个面，如果dot(ref, I) < 0 返回N 否则返回-N
6. reflect(I, N) 折射，返回 I-2\*dot(N,I)\*N, N需要事先被归一化