"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/promise"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));

require("regenerator-runtime/runtime");

require("core-js/modules/es6.string.includes");

var _set = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/set"));

require("core-js/modules/es7.array.includes");

var g = [1, 2, 3, 'a'];
var i = g.includes(1);
var go = new _set.default();
var res = '2323'.includes(2);
go.add('888');
console.log(go.has('000'));
g.filter(function (item) {
  return typeof item !== 'number';
});

function foo() {
  return _regenerator.default.async(function foo$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _regenerator.default.awrap(bar());

        case 2:
          console.log('good');

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
}

function bar() {
  return _promise.default.resolve(222);
}

var Pointer =
/*#__PURE__*/
function () {
  function Pointer(x, y) {
    (0, _classCallCheck2.default)(this, Pointer);
    this.x = x;
    this.y = y;
  }

  (0, _createClass2.default)(Pointer, [{
    key: "dist",
    value: function dist(nP) {
      return 0;
    }
  }]);
  return Pointer;
}();