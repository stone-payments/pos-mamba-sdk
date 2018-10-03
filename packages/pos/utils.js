export const bootstrapApp = (AppConstructor, __manifest__) => {
  /**
   * This file contain utility methods used by the apps in general.
   * This runs on the simulation AND the POS.
   */
  const target = document.getElementById('app-root');

  /**
   * If we're inside the simulator context,
   * let it know that an app is opening
   * */
  if (__SIMULATOR__) {
    const { AppManager } = window.MambaWeb;
    /** __manifest__ is replaced with the current app's manifest */
    AppManager.register(AppConstructor, __manifest__); // eslint-disable-line
    AppManager.open(AppConstructor, target);
    return;
  }

  return new AppConstructor({ target });
};
