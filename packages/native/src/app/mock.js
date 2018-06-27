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

export default function(App) {
  Object.assign(App, {
    doClose,
    getAppKey,
    isRunningOnDevice,
  })
}
