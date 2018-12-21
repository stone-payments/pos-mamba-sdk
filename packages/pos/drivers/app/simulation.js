import { AppManager } from '../../simulator/index.js';

export const NAMESPACE = '$App';

export const SIGNALS = ['opened', 'closed'];

export function setup(App) {
  App.doClose = __TEST__ ? () => App.fire('closed') : () => AppManager.close();

  App.getAppKey = () => '123456';

  App.isRunningOnDevice = () => false;
}
