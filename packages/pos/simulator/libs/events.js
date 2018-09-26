/**
 * This file is used to handle simulated core events
 * */
import { Core } from './boot.js';
import { log } from './utils.js';
import App from '../../api/app.js';

Core.on('openApp', app => {
  if (__DEV__) log('Opening App');
  Core.App = app;
  App.opened();
}).on('closeApp', () => {
  if (__DEV__) log('Closing App');
  Core.App = null;
  App.closed();
});
