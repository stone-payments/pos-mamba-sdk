import { Store } from 'svelte/store.js';
import Device from '../../../api/device.js';

export const INITIAL_DATA = {
  device: Device.getDevice(),
};

const store = new Store(INITIAL_DATA);

store.getDevice = () => Device.getDevice();

store.setDevice = model => {
  Device.setDevice(model);
  store.set({ device: model });
};

if (__DEV__) {
  window.__store__ = store;
}

export default store;
