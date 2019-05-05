require('dotenv').config()
const env = process.env.SPIKE_ENV

module.exports = {
  matchers: { html: '*(**/)*.html', css: '*(**/)*.css', js: '*(**/)*.js' },
  vendor: 'bb2013_files/**'
}
