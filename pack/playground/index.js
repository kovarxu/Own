const path = require('path')
const qs = require('querystring')
const plugin = require('./plugin')
const loaderUtils = require('loader-utils')
const pitcher = require('./pitcher')

module.exports = function (source) {
  const loaderContext = this
  const stringifyReq = (req) => loaderUtils.stringifyRequest(loaderUtils, req)
  const {
    target,
    request,
    minimize,
    sourceMap,
    rootContext,
    resourcePath,
    resourceQuery
  } = loaderContext

  const rawQuery = resourceQuery.slice(1)
  const objQuery = qs.parse(rawQuery)
  const lkQuery = '&' + rawQuery
  const options = loaderUtils.getOptions(loaderContext) || {}

  const filename = path.basename(resourcePath)
  const context = rootContext || process.cwd()
  const sourceRoot = path.dirname(path.relative(context, resourcePath))

  const isServer = target === 'node'
  const isProduction = minimize || process.env.NODE_ENV === 'production'
}

module.exports.PLoaderPlugin = plugin
