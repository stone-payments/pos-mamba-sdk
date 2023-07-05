import { AppManager } from '@mamba/pos/simulator';
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-unresolved */
// @ts-ignore
import App from './App.svelte';

/** __APP_MANIFEST__ is replaced with the current app's manifest */
const manifest = {
  // @ts-ignore
  ...__APP_MANIFEST__,
};

/** Show the Virtual POS before installing and opening the app */
// View.show();

const target = document.getElementById('app-root');

const RootComponent = new App({ target: target || document.body });

/** Install the app on the mamba simulator */
AppManager.installApp({ manifest, RootComponent });

/** Open the app */
AppManager.open(manifest.slug);
