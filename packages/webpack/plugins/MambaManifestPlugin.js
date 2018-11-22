const { getPkg } = require('quickenv');
const xmlBuilder = require('xmlbuilder');

const PKG = getPkg();

const ALIASED_FIELDS = [
  'appName',
  'appDescription',
  'appVersion',
  'runOnUserSelection',
  'appLastModificationDate',
];

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
  const formattedDate = isoDate.slice(0, isoDate.length - 5);

  const aliasedFields = [
    { '@Name': 'appName', '#text': PKG.name },
    { '@Name': 'defaultName', '#text': PKG.name },
    { '@Name': 'displayedName', '#text': PKG.mamba.appName }, // Deprecated
    { '@Name': 'appVersion', '#text': PKG.version },
    { '@Name': 'appDescription', '#text': PKG.description },
    {
      '@Name': 'runOnUserSelection',
      '#text': 'index.html',
    },
    { '@Name': 'appLastModificationDate', '#text': formattedDate },
  ];

  const nonAliasedFields = Object.keys(PKG.mamba).reduce((acc, key) => {
    if (!ALIASED_FIELDS.includes(key)) {
      acc.push({ '@Name': key, '#text': PKG.mamba[key] });
    }
    return acc;
  }, []);

  return xmlBuilder
    .create(
      {
        MambaClass: {
          '@Type': 'Manifest',
          '@Version': '1.0',
          Member: [...aliasedFields, ...nonAliasedFields],
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
