import { AppManager } from '@mamba/pos/simulator/index.js';
import icon from '__APP_ICON__'; // eslint-disable-line
import RootComponent from './index.html';

/** __APP_MANIFEST__ is replaced with the current app's manifest */
const manifest = {
  ...__APP_MANIFEST__,
  icon,
};

AppManager.installApp({ manifest, RootComponent });
AppManager.open(manifest.slug);
