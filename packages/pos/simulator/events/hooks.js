import requester from './requester.js';

export const $Http = {
  ADD_HEADER: '$Http.addHeader',
};

export const tryClearHook = (hook) => {
  try {
    if (typeof hook === 'function') {
      hook();
    }
  } catch (_) {
    //
  }
};

export const useAddHeaderHook = () => {
  let _callback;
  let unsubscribe;
  const _onMessage = (event) => {
    const { detail } = event;
    tryClearHook(unsubscribe);
    if (!detail) return;
    if (!/localhost/g.test(detail.origin)) return;
    if (__DEV__ && __DEBUG_LVL__ >= 2) console.log(`[${event.type} event]`, detail);
    if (typeof _callback === 'function' && detail.key && detail.value) {
      _callback(detail);
    }
  };

  return (cb) => {
    _callback = cb;
    window.addEventListener($Http.ADD_HEADER, _onMessage, false);
    unsubscribe = () => window.removeEventListener($Http.ADD_HEADER, _onMessage);
    return (method, payload, url) => requester($Http.ADD_HEADER, { method, payload, url });
  };
};
