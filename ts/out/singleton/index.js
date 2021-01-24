"use strict";
function add(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
const numUtil = function () {
    console.log('numUtil');
};
numUtil.add = add;
numUtil.subtract = subtract;
module.exports = numUtil;
