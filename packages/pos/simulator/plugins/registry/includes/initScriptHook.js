export const REGISTRY_INIT_HOOK_NAME = 'initScriptHook';

/**
 * Try apply registry data before navigation on tests
 * @param {*} registry
 * @param {*} drivers
 * @returns {void}
 */
export default function initScriptHook(registry, drivers) {
  if (typeof window[REGISTRY_INIT_HOOK_NAME] === 'function') {
    try {
      window[REGISTRY_INIT_HOOK_NAME].call(this, registry, drivers);
    } catch (error) {
      if (__DEV__ || __DEBUG_LVL__ >= 2 || __TEST__) {
        console.log(error);
      }
    }
  }
}
