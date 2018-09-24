import { Core } from '../../simulator/libs/main.js';

export const NAMESPACE = '$App';

export const SIGNALS = ['opened', 'closed'];

export function setup(App) {
  App.doClose = Core.closeApp;

  App.getAppKey = () => '123456';

  App.isRunningOnDevice = () => false;
}
