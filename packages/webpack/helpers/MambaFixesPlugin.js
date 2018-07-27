const ConcatSource = require('webpack-sources/lib/ConcatSource');

/** Fix <link> onload not being fired */
const LINK_ONLOAD_FIX = 'var createLink=function(e){var n=document.createElement("link"),t=document.createElement("IMG");return t.onerror=function(){n.onload()},setTimeout(function(){t.src=n.href}),n};';

/** Polyfill the Function.prototype.bind */
const FN_BIND_FIX = 'Function.prototype.bind||(Function.prototype.bind=function(t){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var o=Array.prototype.slice.call(arguments,1),n=this,i=function(){},r=function(){return n.apply(this instanceof i&&t?this:t,o.concat(Array.prototype.slice.call(arguments)))};return this.prototype&&(i.prototype=this.prototype),r.prototype=new i,r});';

const PLUGIN_NAME = 'mamba-fixes-plugin';

/**
 * Custom webpack plugin to prepend the 'Function.prototype.bind' polyfill
 * before the webpack's runtime code.
 * */

module.exports = class MambaFixesPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      const runtimeChunkConf = compilation.options.optimization.runtimeChunk;

      if (!runtimeChunkConf) {
        compilation.errors.push(
          new Error(
            `${PLUGIN_NAME}: "optimization.runtimeChunk" must be set to "single"|"multiple" or an object "{ name: '<chunk-name>' }".`,
          ),
        );
        return;
      }

      compilation.hooks.optimizeChunkAssets.tap(PLUGIN_NAME, (chunks) => {
        /** Get runtime chunks */
        const runtimeChunks = chunks.filter(chunk => chunk.hasRuntime());

        /** Found any runtime chunks? If not, return */
        if (!runtimeChunks.length) {
          return;
        }

        /** For each runtime chunk found, prepend the bind polyfill code to it */
        runtimeChunks.forEach((runtimeChunk) => {
          const [runtimeFile] = runtimeChunk.files;

          /** Replaces the document.createELement('link') with the fix function */
          const runtimeCode = compilation.assets[runtimeFile]
            .source()
            .replace(
              /document\.createElement\(('|")link('|")\)/,
              'createLink()',
            );

          compilation.assets[runtimeFile] = new ConcatSource(
            ';(function(){\n',
            LINK_ONLOAD_FIX,
            FN_BIND_FIX,
            '\n',
            runtimeCode,
            '\n})();',
          );
        });
      });
    });
  }
};
