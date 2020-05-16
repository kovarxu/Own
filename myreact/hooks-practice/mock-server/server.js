const Koa = require('koa2');
const Router = require('koa-router');
const fs = require('fs');
const LRU = require('lru-cache');
const path = require('path');

const app = new Koa();
const router = new Router();
const options = {
  max: 500,
  length: function (n, key) {
    return n * 2 + key.length
  },
  dispose: function (key, n) {
    n.close()
  },
  maxAge: 1000 * 60 * 60
};
const cache = new LRU(options);

router
  .get('/', (ctx) => {
    ctx.body = 'welcome';
  })

const files = fs.readdirSync(path.resolve(__dirname, './sources'));
files.forEach(filepath => {
  const extname = path.extname(filepath);
  const filename = path.basename(filepath, extname);

  router.get(`/source/${filename}`, (ctx, next) => {
    let fileContent = null;
    if (fileContent = cache.get(filepath)) {
      ctx.body = fileContent;
    } else {
      fileContent = ctx.body = fs.readFileSync(path.resolve(__dirname, './sources', filepath));
      cache.set(filepath, fileContent);  
    }

    // todo
    if (extname === '.json') {
      ctx.type = 'json';
    }

    next();
  })
})

app.use(router.routes());

app.listen(5000, () => {
  console.log('server running on port 5000')
})