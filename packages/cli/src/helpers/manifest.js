const { readFileSync, existsSync } = require('fs');
const { xml2js } = require('xml-js');
const { fromCwd } = require('quickenv');

const hasMambaDir = existsSync(fromCwd('.mamba'));

exports.manifestPath = hasMambaDir ? fromCwd('.mamba', 'manifest.xml') : fromCwd('manifest.xml');

exports.hasManifest = existsSync(exports.manifestPath);

exports.getManifest = () => {
  try {
    const manifestContent = readFileSync(exports.manifestPath).toString();
    return xml2js(manifestContent, {
      compact: true,
    }).MambaClass.Member.reduce((manifest, { _attributes, _text }) => {
      manifest[_attributes.Name] = _text;
      return manifest;
    }, {});
  } catch (e) {
    return false;
  }
};
