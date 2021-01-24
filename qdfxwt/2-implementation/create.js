function create(obj) {
  if (typeof obj !== 'object') {
    return new TypeError();
  }
  function F() {}
  F.prototype = obj;
  return new F();
}
