const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('spike-js-standards')
const pageId = require('spike-page-id')
const sugarml = require('sugarml')
const sugarss = require('sugarss')
const env = require('dotenv').config()

const SpikeDatoCMS = require('spike-datocms')
const postcssMixins = require('postcss-mixins')
const locals = {}

const Dato = new SpikeDatoCMS({
  addDataTo: locals,
  token: process.env.dato_api_key,
  models: [{
    name: 'project'
  }],
  json: 'data.json'
})

module.exports = {
  devtool: 'source-map',
  matchers: { html: '*(**/)*.sgr', css: '*(**/)*.css' },
  ignore: ['**/layout.sgr', '**/_*', '**/.*', 'readme.md', 'yarn.lock', 'package-lock.json'],
  reshape: htmlStandards({
    parser: sugarml,
    locals: (ctx) => { return Object.assign(locals)},
  }),
  postcss: cssStandards({
    appendPlugins: postcssMixins()
  }),
  babel: jsStandards(),
  plugins: [ Dato ]

}
