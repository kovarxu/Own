
function instanceOf(a, b) {
  let protoA = Object.getPrototypeOf(a);
  const typeB = b.prototype;
  while (protoA) {
    if (protoA === typeB) {
      return true;
    } else {
      protoA = Object.getPrototypeOf(protoA);
    }
  }
  return false;
}
