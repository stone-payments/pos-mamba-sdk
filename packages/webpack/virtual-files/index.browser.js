import { AppManager, View } from '@mamba/pos/simulator/index.js';
import icon from '__APP_ICON__'; // eslint-disable-line
import RootComponent from './index.html';

/** __APP_MANIFEST__ is replaced with the current app's manifest */
const manifest = {
  ...__APP_MANIFEST__,
  icon,
};

/** Show the Virtual POS before installing and opening the app */
View.showPOS();

/** Install the app on the mamba simulator */
AppManager.installApp({ manifest, RootComponent });

/** Open the app */
AppManager.open(manifest.slug);
