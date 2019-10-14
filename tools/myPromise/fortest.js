var Pro = require('./etest')

var p2 = new Pro((res, rej) => {
    var oldRes = res
    res = function(...arg) {console.log('x'); oldRes.apply(null, arg)}
    
    res('0')
    console.log('1')
}).then((data) => {
    console.log('2')
})  
console.log('3')
var s = setTimeout(() => console.log('4'))
