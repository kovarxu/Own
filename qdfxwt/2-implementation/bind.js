// 要点总结：
// bind返回的函数作为构造函数的时候，this应该指向instance，而非bind参数toThis
Function.prototype.bind = function(toThis, ...rest1) {
  const self = this;
  const bd = function() {};
  bd.prototype = self.prototype;
  const back = function(...rest2) {
    return self.apply(this instanceof bd ? this : toThis, rest1.concat(rest2));
  }
  back.prototype = new bd();
  return back;
}
