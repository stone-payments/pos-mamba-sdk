const { readFileSync } = require('fs')
const { xml2js } = require('xml-js')
const { fromCwd } = require('quickenv')

module.exports = () => {
  try {
    const manifestContent = readFileSync(fromCwd('manifest.xml')).toString()
    return xml2js(manifestContent, {
      compact: true,
    }).MambaClass.Member.reduce((manifest, { _attributes, _text }) => {
      manifest[_attributes.Name] = _text
      return manifest
    }, {})
  } catch (e) {
    throw new Error('[@mamba/cli] Couldn\'t load the "manifest.xml')
  }
}
