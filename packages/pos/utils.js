/**
 * This file contain utility methods used by the apps in general.
 * This runs on the simulation AND the POS.
 */
export const initApp = (
  App,
  store,
  target = document.getElementById('app-root'),
) => {
  const appInstance = new App({ target, store });

  /**
   * If we're inside the simulator context,
   * let it know that an app is opening
   * */
  if (__SIMULATOR__) {
    window.MambaWeb.openApp(appInstance);
  }

  return appInstance;
};
