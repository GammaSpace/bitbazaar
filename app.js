require('dotenv').config()

const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('spike-js-standards')
const pageId = require('spike-page-id')

const SpikeDatoCMS = require('spike-datocms')
const postcssMixins = require('postcss-mixins')
const postcssColorFunc = require('postcss-color-mod-function')
const markdownItAttrs = require('markdown-it-attrs')

const env = process.env.SPIKE_ENV
const Records = require('spike-records')
const locals = {}


module.exports = {
  devtool: 'source-map',
  matchers: { html: '*(**/)*.html', css: '*(**/)*.css', js: '*(**/)*.js' },
  vendor: 'assets/js/vendor/**',
  ignore: ['_*.html', '**/layout.html','**/*.sgr','**/.*', '_cache/**', 'readme.md'],
  reshape: htmlStandards({
    locals: (ctx) => { return Object.assign(locals)},
    markdownPlugins: [ markdownItAttrs]
  }),
  postcss: cssStandards({
    appendPlugins: [postcssMixins(), postcssColorFunc()],

  }),
  babel: jsStandards(),
  plugins: [
    new Records({
      addDataTo: locals,
      projects: {
        graphql: {
          url: 'https://graphql.datocms.com/',
          query: ` {
            allProjects(filter: {editions: {eq: "950754"}}, orderBy: [name_ASC], first: 100) {
              name
              category
              link
              slug
              creator { name }
              image { url }
            }
          }`,
          variables: {
            startDate: new Date()
          },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: 'Bearer c7beb611e7b4ed9a3c3015e12875a0'
          }
        },
        transform: (res) => res.data.allProjects
      }
    })
  ]
}
