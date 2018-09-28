/**
 * This file contain utility methods used by the apps in general.
 * This runs on the simulation AND the POS.
 */
export const initApp = (
  AppConstructor,
  target = document.getElementById('app-root'),
) => {
  /**
   * If we're inside the simulator context,
   * let it know that an app should be opened
   * */
  if (__SIMULATOR__) {
    window.MambaWeb.openApp(AppConstructor, target);
    return;
  }

  new AppConstructor({ target });
};
