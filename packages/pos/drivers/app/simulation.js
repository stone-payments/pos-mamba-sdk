import { log } from '../../simulator/libs/utils.js';

export const NAMESPACE = 'App';

export function setup(App) {
  App.doClose = () => {
    if (__DEV__) log('App closed');
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
    if (__DEBUG__) {
      log(`downloading tar: ${tar}`);
      log(`saving in: ${destination}`);
    }
  };

  App.installApp = (tarPath, destination) => {
    if (__DEBUG__) {
      log(`tarPath: ${tarPath}`);
      log(`destination: ${destination}`);
    }
  };

  App.deleteApp = appId => {
    if (__DEBUG__) log(`appId: ${appId}`);
  };
}
