
class PLoaderPlugin {
  apply (compiler) {
    if (compiler.hooks) {
      compiler.hooks.compilation.tap('playground-plugin', compilation => {
        compilation.hooks.normalModuleLoader('playground-loader', loaderContext => {
          loaderContext['_play'] = true
        })
      })
    }
  }
}
