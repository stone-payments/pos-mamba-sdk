export default function(App) {
  // import MbDialog from '../components/mb-dialog/mb-dialog'
  // import Mamba from '../api/mamba'

  let dialog = { mount() {}, open() {}, close() {} } // Mock element for now

  window.addEventListener('load', function() {
    dialog.mount(document.body)
  })

  /**
   * Closes the application
   * @memberOf App
   * @param {boolean} showConfirmationDialog True to show a confirmation dialog asking the user if the app should close
   */
  function close(showConfirmationDialog = false) {
    if (showConfirmationDialog) {
      dialog.open(action => {
        if (action === dialog.positiveAction) {
          console.log('Application is closed. User was prompted')
        }
      })
    } else {
      console.log('Application is closed. User was not prompted')
    }
  }

  function getAppKey() {
    return '123456'
  }

  function getProxyURL(url) {
    return url
  }

  function isRunningOnDevice() {
    return false
  }

  function isProxyEnabled() {
    return false
  }

  function listApps(appPath) {
    return [{ name: 'app1', icon: '' }, { name: 'app2', icon: '' }]
  }

  function installApp(tarPath, destination) {
    console.log(`tarPath: ${tarPath}`)
    console.log(`destination: ${destination}`)
  }

  Object.assign(App, {
    close,
    getAppKey,
    getProxyURL,
    isRunningOnDevice,
    isProxyEnabled,
    listApps,
    installApp,
  })
}
