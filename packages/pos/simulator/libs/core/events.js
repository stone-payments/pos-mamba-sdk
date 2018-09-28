/** Core methods that interact with the POS Api */
import Core from './main.js';
import { log } from '../utils.js';
import App from '../../../api/app.js';

Core.on('openApp', (AppConstructor, target) => {
  if (__DEV__) log('Opening App');

  Core.App = {
    target,
    constructor: AppConstructor,
    instance: new AppConstructor({ target }),
  };

  App.opened();
});

Core.on('closeApp', () => {
  if (__DEV__) log('Closing App');

  App.once('closed', () => {
    Core.App.instance.destroy();
    Core.App.instance = null;
  });

  App.closed();
});
