const shell = require('shelljs')
const { fromCwd } = require('quickenv')
const { getManifest } = require('../../helpers/manifest')
const { slugify } = require('../../helpers/utils')
const { REMOTE_APPS_DIR } = require('../../consts')

module.exports = {
  command: 'deploy',
  desc: 'Deploy the current app',
  builder: {
    legacy: {
      default: false,
    },
  },
  handler({ legacy }) {
    const { displayedName: appName, id: appID } = getManifest()
    const appSlug = `${appID}-${slugify(appName)}`

    const REMOTE_APP_DIR = `${REMOTE_APPS_DIR}/${appSlug}.stone`
    const DIST_DIR = fromCwd(legacy ? 'ui/dist' : 'dist')

    console.log(`Deploying "${appSlug}" to "${REMOTE_APP_DIR}"`)

    shell.exec(`rsync -zzaP --delete ${DIST_DIR}/ ${REMOTE_APP_DIR}`, {
      silent: true,
    })

    if (legacy) {
      console.log(
        `Moving "manifest.xml" and "icon.bmp" to "${REMOTE_APP_DIR}/"`,
      )

      const includes = ['manifest.xml', 'icon.bmp']
        .map(path => `--include="${path}"`)
        .join(' ')

      shell.exec(
        `rsync -zzaPR --delete ${includes} --exclude '**/*' . ${REMOTE_APP_DIR}/`,
        {
          silent: true,
        },
      )
    }
    console.log('App deployed')
  },
}
