// middleware.js
const { Transform, Stream } = require('stream')
const fs = require('fs')
const path = require('path')

const dir = path.dirname(process.argv[1])
const LF = 10 // '\n'
const CR = 13 // '\r'
const HYPHEN = 45 // '-'

module.exports = async function middleWare(ctx, next) {
  return new Promise((resolve, reject) => {
    let part
    let File, filepath
    
    // 1. 从Content-Type拿到boundary
    const contentType = ctx.headers['content-type']
    const boundaryReg = contentType.match(/boundary=(.*)/)
    const boundary = Buffer.from('--' + boundaryReg[1])

    // 用来收集普通的表单元素
    let fields = {}
    // 是否碰到文件的标记
    let fileFlag = false

    // 2. 创建转换流
    const transformer = new Transform({
      // 运行在对象模式
      objectMode: true,
      transform(buffer, encoding, callback) {
        let prevIndex = 0
        let fieldBegin = 0
        let fieldEnd = 0

        // 3. 获取文件信息
        for (let i = 0, l = buffer.length; i < l; i++) {
          const c = buffer[i]
          // 检测到空行
          if (!fieldBegin && c === LF && buffer[i-1] == CR && buffer[i-2] === c) {
            // 第一部分头信息，可以使用utf8编码提取文件信息
            let fileInfoBuffer = buffer.slice(prevIndex, i+1)
            let fileInfoString = fileInfoBuffer.toString('utf8')
            
            // 这里只简单地用正则去匹配了文件名
            const filenameReg = /name="([^"]+)"(; filename="([^"]+)")?/

            if (fileInfoString.match(filenameReg)) {
              let name = RegExp.$1
              let filename = RegExp.$3
              // 获取文件名
              if (filename) {
                this.push({ name: 'filename', buffer: Buffer.from(filename) })
                fieldBegin = i + 1
                fileFlag = true
              }
              // 获取表单name属性
              else if (name) {
                fieldBegin = i + 1
                this.push({ name: 'fieldname', buffer: Buffer.from(name) })
              }
            }
          }
          // 简单地用这种方式判断表单值或文件结尾
          else if (fieldBegin && c === LF && buffer[i+1] === HYPHEN && buffer[i+2] === HYPHEN) {
            let j = i + boundary.length
            if (buffer[j] === boundary[boundary.length - 1]) {
              fieldEnd = i - 1
              let fileBuffer = buffer.slice(fieldBegin, fieldEnd)
              this.push({ name: 'fielddata', buffer: fileBuffer })
              fieldBegin = fieldEnd = 0
              prevIndex = i + 1
            }
          }
        }
  
        callback()
      }
    })
  
    // 让转换流开始流动
    let currentFieldName = ''
    transformer.on('data', ({ name, buffer }) => {
      if (name === 'fieldname') {
        currentFieldName = buffer.toString()
      }
      else if (name === 'filename') {
        // 这是个无关紧要的工具流
        part = new Stream()
        part.readable = true
        // 4. 创建待写入的文件流
        filepath = path.resolve(dir, buffer.toString())
        File = fs.createWriteStream(filepath)
  
        // 这里只简单使用了工具流的EventEmitter特征
        part.on('data', (chunk) => {
          ctx.req.pause()
          File.write(chunk, () => {
            ctx.req.resume()
          })
        })
  
        // 写入后再执行后续操作
        part.on('end', () => {
          File.end('', async () => {
            ctx.fields = fields
            ctx.file = filepath
            console.log(filepath)

            fileFlag = false
            resolve()
          })
        })
      }
      else if (name === 'fielddata') {
        if (fileFlag) {
          // 如果是文件，向工具流发送数据
          part.emit('data', buffer)
        } 
        // 否则是普通的表单值
        else if (currentFieldName) {
          let field = fields[currentFieldName]
          if (typeof field === 'string') {
            fields[currentFieldName] = [field, buffer.toString()]
          } else if (Array.isArray(field)) {
            field.push(buffer.toString())
          } else {
            fields[currentFieldName] = buffer.toString()
          }
          currentFieldName = ''
        }
      }
    })
  
    transformer.on('end', () => {
      if (part instanceof Stream) {
        part.emit('end')
      }
    })
  
    ctx.req.on('end', () => {
      transformer.end()
    })

    ctx.req.pipe(transformer)
  }).then(next)
}
