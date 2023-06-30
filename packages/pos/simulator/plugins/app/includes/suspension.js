export default (AppManager) => {
  AppManager.suspend = (app) => {
    const { runtime } = app;
    const lastURL = window.location.href;
    const suspended = {
      lastURL,
    };

    runtime.target.classList.add('is-suspended');
    runtime.suspended = suspended;

    AppManager.suspendGlobalEvents({ runtime });

    AppManager.fire('appSuspended', app);
  };

  AppManager.resume = (app) => {
    const { runtime } = app;

    runtime.target.classList.remove('is-suspended');

    // TODO: https://developer.chrome.com/extensions/history#method-deleteAll
    // if (typeof window.history.deleteAll === 'function') {
    //   await window.history.deleteAll();
    // }

    window.history.replaceState('', document.title, runtime.suspended.lastURL);

    AppManager.resumeGlobalEvents({ runtime });

    delete runtime.suspended;

    AppManager.fire('appResumed', app);
  };
};
