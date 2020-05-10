const Koa = require('koa2')
const koaBody = require('koa-body');

const app = new Koa()

app.use(koaBody({
  multipart: true,
  formidable: {
    // multiples: 接受多文件上传，默认为true
    // uploadDir: os.tmpDir() 文件上传路径，默认为系统临时文件夹
    keepExtensions: true // 保留文件原本的扩展名，否则没有扩展名，默认为false
  }
}))

app.use(ctx => {
  ctx.body = `Request Body: ${JSON.stringify(ctx.request.body)}, ${JSON.stringify(ctx.request.files)}`;
})

app.listen(3003, () => console.log('server running on port 3003'))
