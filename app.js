const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('spike-js-standards')
const pageId = require('spike-page-id')
const sugarml = require('sugarml')
const sugarss = require('sugarss')

const postcssMixins = require('postcss-mixins')
const postcssColorFunc = require('postcss-color-mod-function')
const markdownItAttrs = require('markdown-it-attrs')

const locals = { dato: require('./data.json') }

module.exports = {
  devtool: 'source-map',
  matchers: { html: '*(**/)*.sgr', css: '*(**/)*.css' },
  vendor: 'assets/js/vendor/**',
  ignore: ['**/layout.sgr', '**/_*', '**/.*', 'readme.md', 'yarn.lock', 'package-lock.json'],
  reshape: htmlStandards({
    parser: sugarml,
    locals: (ctx) => { return Object.assign(locals)},
    markdownPlugins: [ markdownItAttrs]
  }),
  postcss: cssStandards({
    appendPlugins: [postcssMixins(), postcssColorFunc()]
  }),
  babel: jsStandards()
}
