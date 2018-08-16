const { getPkg } = require('quickenv');
const xmlBuilder = require('xmlbuilder');

const PKG = getPkg();

const createXmlManifest = () => {
  const date = new Date();

  /** Align the date with POS timezone */
  date.setHours(date.getHours() - 3, date.getMinutes(), date.getSeconds(), 0);

  const isoDate = date.toISOString();
  const formattedDate = isoDate.slice(0, isoDate.length - 5);

  return xmlBuilder
    .create(
      {
        MambaClass: {
          '@Type': 'Manifest',
          '@Version': '1.0',
          Member: [
            { '@Name': 'id', '#text': PKG.mamba.id },
            { '@Name': 'appName', '#text': PKG.mamba.appName },
            { '@Name': 'defaultName', '#text': PKG.mamba.appName }, // Deprecated
            { '@Name': 'displayedName', '#text': PKG.mamba.appName }, // Deprecated
            { '@Name': 'appVersion', '#text': PKG.version },
            { '@Name': 'appDescription', '#text': PKG.description },
            { '@Name': 'iconPath', '#text': PKG.mamba.iconPath },
            {
              '@Name': 'runOnUserSelection',
              '#text': 'index.html',
            },
            {
              '@Name': 'appCreationDate',
              '#text': PKG.mamba.appCreationDate,
            },
            { '@Name': 'appLastModificationDate', '#text': formattedDate },
            { '@Name': 'listInMainMenu', '#text': PKG.mamba.listInMainMenu },
            { '@Name': 'appType', '#text': PKG.mamba.appType },
            { '@Name': 'appTechnology', '#text': PKG.mamba.appTechnology },
            {
              '@Name': 'appPasswordProtectionLevel',
              '#text': PKG.mamba.appPasswordProtectionLevel,
            },
            { '@Name': 'appKey', '#text': PKG.mamba.appKey },
          ],
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
