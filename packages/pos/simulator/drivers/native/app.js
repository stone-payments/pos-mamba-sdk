export const NAMESPACE = 'App';

export function setup(App) {
  App.doClose = () => {
    console.log('[@mambasdk/api/app] App closed');
  };

  App.getAppKey = () => '123456';

  App.isRunningOnDevice = () => false;

  App.listApps = () => [
    {
      id: 1,
      name: 'app1',
      defaultName: 'app1',
      icon: '',
    },
    {
      id: 2,
      name: 'app2',
      defaultName: 'app2',
      icon: '',
    },
  ];

  App.downloadAndSave = (tar, destination) => {
    console.log(`downloading tar: ${tar}`);
    console.log(`saving in: ${destination}`);
  };

  App.installApp = (tarPath, destination) => {
    console.log(`tarPath: ${tarPath}`);
    console.log(`destination: ${destination}`);
  };

  App.deleteApp = appId => {
    console.log(`appId: ${appId}`);
  };
}
