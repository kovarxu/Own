// 1. minimist, 整合命令行参数

var argv = require('minimist')(process.argv.slice(2));

/*
$ node example/parse.js -x 3 -y 4 -n5 -abc --beep=boop foo bar baz
{ _: [ 'foo', 'bar', 'baz' ],
  x: 3,
  y: 4,
  n: 5,
  a: true,
  b: true,
  c: true,
  beep: 'boop' }
*/

// 2. 哈希校验和工具，对于相同字面量的对象生成相同的哈希值

var hashSum = require('hash-sum')

var a = {b: 1}

var b = {b: 1}

console.log(hashSum(a))
console.log(hashSum(b))

// 3. statuses

var status = require('statuses')

status(403) // => 'Forbidden'
status('forbidden') // => 403
status.empty[200] // false
// status.message[200] // 'OK'
status.redirect[200] // undefined
status.retry[200] // undefined

// 4. debug

var debug = require('debug')('http')
var http = require('http')

var name = 'My App';

debug('booting %o', name)

// 5. accepts

// 处理资源协商

// var accepts = require('accepts')

// var accept = accepts(someRequest)

// accept.type(['json', 'html']) // 返回true/false

// accept.types() // 返回请求可接受的mime类型 

// 还有针对language, charset, encoding的内容协商，用法相同

// 6. cookies

// 一个操作cookie的库，内部包含一个Keygrip的哈希生成套件

// keygrip通过给定的keys、算法名称和返回类型（默认base64格式）对给定的数据生成一个哈希值

```js
keylist = ['Secret_key', 'S_K']
keys = new Keygrip(keylist, 'sha384', 'base64')
hash = keys.sign('abcdefghijklmn')
keys.index('abcdefghijklmn', hash) // 验证是第几个index，如果大于0则需要重新签名
keylist.unshift('Secret_key_personal') // 新key放到数组开头的位置
hash = keys.sign('abcdefghijklmn') // 重新签名
```

// koa2 源码简单地使用了

```
context.cookies = new Cookies(req, res, {
  keys: this.keys,
  secure: request.secure
});

// cookies.get, cookies.set
```

// 7. readable-stream
// 这个库消除了nodejs版本stream模块的差异
// 如果使用，则建议始终使用它而不是原生的stream模块

// 8. through2
// 本质是一个转化流的函数形式 through2(_transform, _flush)

// 9. split2
// 将文本按照\r?\n分成多行，可以提供一个mapper处理函数，处理各个行，本质是一个transform流

// 10. duplexer2
// duplexer2(writable, readable) 提供一个可写和一个可读流，构成一个双工流

// 11. concat-stream

// 用于把不连续的流内容变为连续的内容
