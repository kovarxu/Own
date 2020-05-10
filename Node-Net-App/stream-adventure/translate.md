## 前言

原文地址：[by: Liz Parody in Node.js, 2019.11.23](https://nodesource.com/blog/understanding-streams-in-nodejs/)

Node.js中的流是众所周知的难理解，而且更加难用。按照Dominic Tarr的说法，流是Node.js中最会被误解的一点。即使是Dan Abramov（redux的作者）和React.js的核心团队都对它望而生畏。

本文将帮你理解流以及学会如何使用它，不要害怕，我们会解决掉这些问题。

### 流是什么？

流作为基本模块之一为Node.js应用赋能，它作为数据处理的方法，将数据从输入端顺序地写到输出端。它是处理文件I/O，网络连接，以及任何端到端信息交互的一种高效途径。不同于传统的将程序一次性读入内存的做法，流一块块地读取数据，在处理数据过程中没有把它全部放到内存里，这使得它在处理海量数据时变得非常强力。比如说一个文件的尺寸比内存还要大，那就不可能将它全部读入再加以处理，这时就是流大显身手的时候了！使用流来（逐次）处理较小的数据块，使得读取较大的文件成为可能。
为了理解“流式”服务，我们以Youtube和Netflix作为例子，这些网站不需要你一次性地下载完整个视频或音频；相反，浏览器以一种连续的数据块流的方式接收数据，这允许访问者可以即时地观看和收听。
然而，流不仅仅是在处理大量数据和多媒体资源时有用，它更为我们的代码提供了“组合型”。xxx

### 为何使用流？

相比于其他数据操作方式，流有两大优点：

1. 空间效率：不需要在处理之前导入大量数据到内存
2. 时间效率：一旦有了数据就立即开始处理，所需的（等待）时间要少得多，不必等到传输完毕才开始处理

### Node.js中的四种流

1. Writable(可写流)：可以写入数据，比如fs.createWriteStream()可以通过流写入数据到文件
2. Readable(可读流)：可以从中读取数据，比如fs.createReadStream()可以读取文件内容
3. Duplex(双工流)：既可读又可写的流，如net.Socket
4. Transform(转换流)：可以在数据写入和读取时修改或转换数据的流，如文件压缩的场景，可以在文件中写入压缩数据，也可以从压缩文件中读取解压缩数据

如果你已经使用过Node.js，那么可能已经遇到过流了。比如在基于Node.js的http服务器中，request是可读流，response是可写流。你可能用过fs模块，它允许您同时处理可读和可写的文件流。当使用Express时你都是在使用流与客户端进行交互；同时，流也被用于你可以使用的每个数据库连接驱动程序中，因为TCP套接字、TLS堆栈和其他连接都是基于流的。

## 实际的例子

### 创建可读流

首先require可读流，然后初始化

```js
const Stream = require('stream')
const readableStream = new Stream.Readable()
```

既然流已经初始化，下面我们给它发送数据：

```js
readableStream.push('ping!')
readableStream.push('pong!')
```

### 使用迭代器

强烈建议在处理流时使用异步迭代器。根据Dr. Axel Rauschmayer的观点，异步迭代是一种用于异步检索数据容器内容的协议（意味着当前任务在检索项之前可能会暂停）。另外值得一提的是，流的异步迭代器实现使用了它的readable事件。

当从可读流读取数据时可以使用异步迭代器：

```js
import * as fs from 'fs';

async function logChunks(readable) {
  for await (const chunk of readable) {
    console.log(chunk);
  }
}

const readable = fs.createReadStream(
  'tmp/test.txt', {encoding: 'utf8'});
logChunks(readable);

// Output:
// 'This is a test!\n'
```

在字符串中收集可读流的内容，也是可行的：

```js
import {Readable} from 'stream';

async function readableToString2(readable) {
  let result = '';
  for await (const chunk of readable) {
    result += chunk;
  }
  return result;
}

const readable = Readable.from('Good morning!', {encoding: 'utf8'});
assert.equal(await readableToString2(readable), 'Good morning!');
```

注意，在本例中，我们必须使用异步函数，因为我们希望返回一个Promise。

一定要记住，不要将异步函数与EventEmitter混合使用。因为目前无法处理从事件处理程序中引发的rejection，导致难以追踪错误和内存泄漏。目前的最佳实践是始终把async函数包裹在 try/catch 中以处理错误，但这很容易出错。[这个pull请求](https://github.com/Node.js/node/pull/27867)旨在解决这个问题。

要学习更多使用异步迭代器处理流的例子，可以看[这篇好文章](https://2ality.com/2019/11/Node.js-streams-async-iteration.html)

### Readable.from(): 从可枚举的值中创建可读流

stream.Readable.from(iterable, [options])是一个通过迭代器创建可读流实用的方法，它将迭代器中的数据包含在流中，迭代器可以是同步的或异步的。options参数是可选的，可以用于指定文本编码。

```js
const { Readable } = require('stream');

async function * generate() {
  yield 'hello';
  yield 'streams';
}

const readable = Readable.from(generate());

readable.on('data', (chunk) => {
  console.log(chunk);
});
```

### 两种可读流模式

根据Streams API，可读流可以有效地在两种模式之一中运行：流动模式和暂停模式。两种模式中流均可以处于对象运行状态（译者注：Node.js的流通常运作在字符串或者Buffer上，但也可以使用其他类型的Javascript值，这些流以“对象模式”进行操作）

* 在流动模式，数据从底层系统自动读取，并通过EventEmitter接口使用事件以尽可能快的速度提供给应用程序。
* 在暂停模式，stream.read()方法必须被显式调用以从流中读取数据块

在流动模式中，要从流中读取数据，可以侦听data事件并附加回调。当数据块可用时，可读流发出data事件并执行回调，比如下面的代码片段：

```js
var fs = require("fs");
var data = '';

var readerStream = fs.createReadStream('file.txt'); //Create a readable stream

readerStream.setEncoding('UTF8'); // Set the encoding to be utf8. 

// Handle stream events --> data, end, and error
readerStream.on('data', function(chunk) {
   data += chunk;
});

readerStream.on('end',function() {
   console.log(data);
});

readerStream.on('error', function(err) {
   console.log(err.stack);
});

console.log("Program Ended");
```

fs.createReadStream()创建了一个初始静止状态的可读流，当我们给它附加data事件时它开始流动，数据块被读取并传递给定义的回调函数。流的实现者决定了data事件触发的频率，例如，HTTP请求可以在每读取几kb数据时触发data事件；当从文件中读取数据时，你可以决定在读取每一行时触发data事件。
当没有更多数据可读取时，流会触发end事件，在上面的例子中我们监听这个事件，以便在结束时得到通知。出错的情况亦然，流也会进行相应的事件触发和通知。

在暂停模式下，你只需反复调用流实例上的read()，直到读取了所有数据块，例如：

```js
var fs = require('fs');
var readableStream = fs.createReadStream('file.txt');
var data = '';
var chunk;

readableStream.on('readable', function() {
    while ((chunk=readableStream.read()) != null) {
        data += chunk;
    }
});

readableStream.on('end', function() {
    console.log(data)
});
```

read()函数从内部缓冲区读取一些数据并返回，如果没有可以读取的数据，它返回null。所以在while循环中，我们检测如果read返回null则终止循环，注意readable事件是流中有一些数据块可读取时触发的。

所有的可读流开始时都处于暂停状态，但可以由下列方法切换到流动状态：

* 添加一个data事件句柄
* 执行Stream.resume()方法
* 执行Stream.pipe()发送数据到可读流

可读流也可以用下列方法之一切换回暂停状态：

* 如果没有管道目标，执行Stream.pause()
* 如果有管道目标，则移除它们。多个管道目标可以用Stream.unpipe()方法移除

需要特别记住的一点是，可读流在提供消费或忽略数据的机制之前是不流动的。如果这个消费机制被移除或者禁用，那么可读流会尝试停止生成数据。添加readable事件句柄自动让流停止流动，数据通过readable.read()进行消费。如果这个事件句柄被移除且流上有data事件句柄，则它会重新开始流动。

### 创建可写流

向流中写入数据需要调用write方法，比如：

```js
var fs = require('fs');
var readableStream = fs.createReadStream('file1.txt');
var writableStream = fs.createWriteStream('file2.txt');

readableStream.setEncoding('utf8');

readableStream.on('data', function(chunk) {
    writableStream.write(chunk);
});
```

上面的代码简单明了，它从输入流读取数据，然后简单地使用write()将它写到输出流。write方法返回一个布尔值表示写入是否成功，如果是true，则你可以写入更多数据；如果是false，则表明出了一些问题，当前你无法写入数据，可读流会通过触发drain事件告诉你又可以写入数据了。

调用writable.end()表明不会有更多数据写入到可写流，可选的回调函数被附加为finish事件的监听器。

```js
// Write 'hello, ' and then end with 'world!'.
const fs = require('fs');
const file = fs.createWriteStream('example.txt');
file.write('hello, ');
file.end('world!');
// Writing more now is not allowed!
```

使用可写流可以从可读流获取数据

```js
const Stream = require('stream')

const readableStream = new Stream.Readable()
const writableStream = new Stream.Writable()

writableStream._write = (chunk, encoding, next) => {
    console.log(chunk.toString())
    next()
}

readableStream.pipe(writableStream)

readableStream.push('ping!')
readableStream.push('pong!')

writableStream.end()
```

推荐使用异步迭代器去实现一个可写流

```js
import * as util from 'util';
import * as stream from 'stream';
import * as fs from 'fs';
import {once} from 'events';

const finished = util.promisify(stream.finished); // (A)

async function writeIterableToFile(iterable, filePath) {
  const writable = fs.createWriteStream(filePath, {encoding: 'utf8'});
  for await (const chunk of iterable) {
    if (!writable.write(chunk)) { // (B)
      // Handle backpressure
      await once(writable, 'drain');
    }
  }
  writable.end(); // (C)
  // Wait until done. Throws if there are errors.
  await finished(writable);
}

await writeIterableToFile(
  ['One', ' line of text.\n'], 'tmp/log.txt');
assert.equal(
  fs.readFileSync('tmp/log.txt', {encoding: 'utf8'}),
  'One line of text.\n');
```

stream.finished()默认是一个回调风格的方法，它可以使用util.promisify()转化成Promise风格的方法（A行）

这个例子使用了上面介绍了两种操作方法，write（B行）和finish（C行）

### pipeline()

管道我们将一个流的输出作为另一个流的输入的机制，通常用于从一个流获取数据，并将该流的输出传递到另一个流，管道操作没有限制。换句话说，管道用于在多个步骤中处理流数据。
在Node 10.x版本引入了模块方法Stream.pipeline()，使用它可以在流之间进行数据传输、错误转发或进行清理，此外可以提供一个处理结束时的回调。

下面是使用pipeline的例子：

```js
const { pipeline } = require('stream');
const fs = require('fs');
const zlib = require('zlib');

// Use the pipeline API to easily pipe a series of streams
// together and get notified when the pipeline is fully done.
// A pipeline to gzip a potentially huge video file efficiently:

pipeline(
  fs.createReadStream('The.Matrix.1080p.mkv'),
  zlib.createGzip(),
  fs.createWriteStream('The.Matrix.1080p.mkv.gz'),
  (err) => {
    if (err) {
      console.error('Pipeline failed', err);
    } else {
      console.log('Pipeline succeeded');
    }
  }
);
```

应当使用pipeline代替pipe，因为后者是不安全的

### 结论

这就是所有关于流的基础知识。流，管道连接是Node.js的核心和最强大的功能。流确实可以帮助您编写简洁而高效的代码来执行I/O。此外，还有一个值得关注的Node.js战略计划，叫做BOB，旨在改进Node.js的流数据接口，在Node.js核心内部，也希望作为未来的公共api。
