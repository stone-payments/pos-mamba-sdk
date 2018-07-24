const { getManifest } = require('../../helpers/manifest');
const { slugify } = require('../../helpers/utils');

module.exports = {
  command: 'info',
  desc: 'Current app info',
  handler() {
    const manifest = getManifest();
    const { displayedName: appName, id: appID } = manifest;
    const appSlug = `${appID}-${slugify(appName)}`;

    console.log({
      slug: appSlug,
      ...manifest,
    });
  },
};
