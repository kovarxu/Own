function add(a: number, b: number) {
  return a + b;
}
function subtract(a: number, b: number) {
  return a - b;
}

const numUtil = function() {
  console.log('numUtil');
}

numUtil.add = add;
numUtil.subtract = subtract;

module.exports = numUtil;
