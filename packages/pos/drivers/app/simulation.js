import { log } from '../../simulator/libs/utils.js';

export const NAMESPACE = '$App';

export const SIGNALS = ['opened', 'closed'];

export function setup(App) {
  App.doClose = () => {
    if (__DEV__) log('App closed');
    App.closed();
  };

  App.getAppKey = () => '123456';

  App.isRunningOnDevice = () => false;
}
