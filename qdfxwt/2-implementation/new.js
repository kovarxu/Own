function myNew(fn, ...rest) {
  const obj = {};
  Object.setPrototypeOf(obj, fn);
  const result = fn.apply(obj, rest);
  return result instanceof Object ? result : obj;
}
