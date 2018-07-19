/** Mock the 'doClose' invokable */
function doClose() {
  console.log('[@mamba/native/app] App closed');
}

function getAppKey() {
  return '123456';
}

function isRunningOnDevice() {
  return false;
}

function listApps() {
  return [
    {
      id: 1,
      name: 'app1',
      icon: '',
    },
    {
      id: 2,
      name: 'app2',
      icon: '',
    },
  ];
}

function downloadAndSave(tar, destination) {
  console.log(`downloading tar: ${tar}`);
  console.log(`saving in: ${destination}`);
}

function installApp(tarPath, destination) {
  console.log(`tarPath: ${tarPath}`);
  console.log(`destination: ${destination}`);
}

function deleteApp(appId) {
  console.log(`appId: ${appId}`);
}

export default function (App) {
  Object.assign(App, {
    doClose,
    getAppKey,
    isRunningOnDevice,
    // TODO: Refactor exclusive 'develop' app methods
    listApps,
    downloadAndSave,
    installApp,
    deleteApp,
  });
}
