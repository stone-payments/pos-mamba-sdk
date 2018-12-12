const { getPkg } = require('quickenv');
const xmlBuilder = require('xmlbuilder');

const PKG = getPkg();

/** Common used mamba manifest parameters */
const DEFAULT_FIELDS = {
  listInMainMenu: true,
  appTechnology: '1',
  appType: '0',
  appPasswordProtectionLevel: '0',
  runOnUserSelection: 'index.html',
};

const createXmlManifest = () => {
  const date = new Date();

  /** Align the date with POS timezone */
  date.setHours(
    date.getHours() - date.getTimezoneOffset() / 60,
    date.getMinutes(),
    date.getSeconds(),
    0,
  );

  const isoDate = date.toISOString();
  const modificationDate = isoDate.slice(0, isoDate.length - 5);

  const manifestEntries = Object.entries({
    appName: PKG.name,
    defaultName: PKG.name,
    displayedName: PKG.mamba.appName, // Deprecated
    appVersion: PKG.version,
    appDescription: PKG.description,
    appLastModificationDate: modificationDate,
    ...DEFAULT_FIELDS,
    ...PKG.mamba,
  }).map(([name, text]) => ({
    '@Name': name,
    '#text': text,
  }));

  return xmlBuilder
    .create(
      {
        MambaClass: {
          '@Type': 'Manifest',
          '@Version': '1.0',
          Member: manifestEntries,
        },
      },
      { headless: true },
    )
    .end({ pretty: true });
};

module.exports = class GenerateMambaManifestPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('MambaManifestPlugin', compilation => {
      const xmlManifest = createXmlManifest();
      compilation.assets['manifest.xml'] = {
        source: () => xmlManifest,
        size: () => xmlManifest.length,
      };
    });
  }
};
