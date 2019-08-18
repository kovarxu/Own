const canvas = document.createElement('canvas');
const sandbox = new GlslCanvas(canvas);

const string_vertex_code = `
attribute vec4 a_position;

void main() {
  gl_Position = a_position;
}
`

const string_frag_code = `
void main() {
  gl_FragColor = vec4(1.0, 0.65, 0.5, 1.0);
}
`

sandbox.load(string_frag_code);
sandbox.load(string_frag_code, string_vertex_code);

document.body.appendChild(canvas);
