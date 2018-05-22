const { readFileSync, existsSync } = require('fs')
const { xml2js } = require('xml-js')
const { fromCwd } = require('quickenv')

const manifestPath = fromCwd('manifest.xml')

exports.hasManifest = existsSync(manifestPath)

exports.getManifest = () => {
  try {
    const manifestContent = readFileSync(manifestPath).toString()
    return xml2js(manifestContent, {
      compact: true,
    }).MambaClass.Member.reduce((manifest, { _attributes, _text }) => {
      manifest[_attributes.Name] = _text
      return manifest
    }, {})
  } catch (e) {
    return false
  }
}
