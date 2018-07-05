/** Mock the 'doClose' invokable */
function doClose() {
  console.log('[@mamba/native/app] App closed')
}

function getAppKey() {
  return '123456'
}

function isRunningOnDevice() {
  return false
}

function listApps(appPath) {
  return [{ name: 'app1', icon: '' }, { name: 'app2', icon: '' }]
}

function installApp(tarPath, destination) {
  console.log(`tarPath: ${tarPath}`)
  console.log(`destination: ${destination}`)
}

export default function(App) {
  Object.assign(App, {
    doClose,
    getAppKey,
    isRunningOnDevice,
    listApps,
    installApp,
  })
}
