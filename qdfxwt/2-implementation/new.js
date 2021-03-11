function myNew(fn, ...rest) {
  const obj = {};
  Object.setPrototypeOf(obj, fn.prototype);
  const result = fn.apply(obj, rest);
  return result instanceof Object ? result : obj;
}
