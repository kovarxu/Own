Function.prototype.apply = function(toThis, rest = []) {
  const context = toThis || globalThis;
  context._fn = this;
  let result;
  if (rest.length) {
    result = context._fn(...rest);
  } else {
    result = context._fn();
  }
  delete context._fn;
  return result;
}

Function.prototype.call = function(toThis, ...rest) {
  const context = toThis || globalThis;
  context._fn = this;
  let result;
  if (rest.length) {
    result = context._fn(...rest);
  } else {
    result = context._fn();
  }
  delete context._fn;
  return result;
}
