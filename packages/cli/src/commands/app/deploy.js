const shell = require('shelljs')
const getManifest = require('../../helpers/getManifest')
const { slugify } = require('../../helpers/utils')
const { DIST_PATH, REMOTE_APPS_DIR } = require('../../consts')

module.exports = {
  command: 'deploy',
  desc: 'deploy the current app',
  handler(argv) {
    console.log('DEPLOY')
    const { displayedName: appName, id: appID } = getManifest()
    const appSlug = `${appID}-${slugify(appName)}`
    shell.exec(
      `rsync -zzaP --delete ${DIST_PATH}/ ${REMOTE_APPS_DIR}/${appSlug}.stone`,
      {
        silent: true,
      },
    )
    console.log('App deployed')
  },
}
