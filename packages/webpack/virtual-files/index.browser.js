import { onViewLoad } from '@mamba/pos/simulator/index.js';
import icon from '__APP_ICON__'; // eslint-disable-line

/** __APP_MANIFEST__ is replaced with the current app's manifest */
const manifest = {
  ...__APP_MANIFEST__,
  icon,
};

onViewLoad(async ({ AppManager }) => {
  const app = await AppManager.loadApp(() => import('./index.html'), manifest);
  AppManager.open(app.manifest.slug);
});
