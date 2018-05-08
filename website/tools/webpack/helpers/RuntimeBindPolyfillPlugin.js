const ConcatSource = require('webpack-sources/lib/ConcatSource')
const { readFileSync } = require('fs')
const { fromModulesRoot } = require('../../utils/paths.js')

/** Get the Function.prototype.bind polyfill from 'phantomjs-function-bind-polyfill' package */
const BIND_POLYFILL_CODE = readFileSync(
  fromModulesRoot('phantomjs-function-bind-polyfill', 'index.js'),
  'utf8',
)

const PLUGIN_NAME = 'runtime-bind-polyfill-plugin'

/**
 * Custom webpack plugin to prepend the 'Function.prototype.bind' polyfill before the webpack's runtime code.
 * */
module.exports = class RuntimeBindPolyfillPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, compilation => {
      const runtimeChunkConf = compilation.options.optimization.runtimeChunk

      if (!runtimeChunkConf) {
        compilation.errors.push(
          new Error(
            `${PLUGIN_NAME}: "optimization.runtimeChunk" must be set to "single"|"multiple" or an object "{ name: '<chunk-name>' }".`,
          ),
        )
        return
      }

      compilation.hooks.optimizeChunkAssets.tap(PLUGIN_NAME, chunks => {
        /** Get runtime chunks */
        const runtimeChunks = chunks.filter(chunk => chunk.hasRuntime())

        /** Found any runtime chunks? If not, return */
        if (!runtimeChunks.length) {
          return
        }

        /** For each runtime chunk found, prepend the bind polyfill code to it */
        runtimeChunks.forEach(runtimeChunk => {
          const [runtimeFile] = runtimeChunk.files

          compilation.assets[runtimeFile] = new ConcatSource(
            BIND_POLYFILL_CODE,
            '\n',
            compilation.assets[runtimeFile],
          )
        })
      })
    })
  }
}
