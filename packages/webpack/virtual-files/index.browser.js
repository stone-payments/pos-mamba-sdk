import { AppManager } from '@mamba/pos/simulator/index.js';
import icon from '__APP_ICON__'; // eslint-disable-line
import App from './index.html';

/** __APP_MANIFEST__ is replaced with the current app's manifest */
const manifest = {
  ...__APP_MANIFEST__,
  icon,
};

AppManager.installApp(App, manifest);
AppManager.open(manifest.slug);
