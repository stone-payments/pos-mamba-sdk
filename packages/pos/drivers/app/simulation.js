import Core from '../../simulator/plugins/core.js';

export const NAMESPACE = '$App';

export const SIGNALS = ['opened', 'closed'];

export function setup(App) {
  App.doClose = () => Core.AppManager.close();

  App.getAppKey = () => '123456';

  App.isRunningOnDevice = () => false;
}
