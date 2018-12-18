import Core from '../../simulator/core.js';

export const NAMESPACE = '$App';

export const SIGNALS = ['opened', 'closed'];

export function setup(App) {
  App.doClose = __TEST__
    ? () => App.fire('closed')
    : () => Core.AppManager.close();

  App.getAppKey = () => '123456';

  App.isRunningOnDevice = () => false;
}
