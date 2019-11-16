class MyTestPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('MyTestPlugin', (compilation, params) => {
      debugger
      console.log('new compilation hooks was called!' + params)
    })
  }
}

module.exports = MyTestPlugin
