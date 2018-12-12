import { AppManager } from '@mamba/pos/simulator/index.js';
import icon from '%mamba_app_icon_path%'; // eslint-disable-line
import App from './index.html';

/** __MANIFEST__ is replaced with the current app's manifest */
const manifest = __MANIFEST__;
manifest.icon = icon;

AppManager.installApp(App, manifest);
AppManager.open(manifest.slug);
