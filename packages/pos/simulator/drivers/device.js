import { Registry } from '../index.js';

export const NAMESPACE = '$Device';

export const PERSISTENT_SETTINGS = {
  device: 'MP35',
};

export function setup(Device) {
  Device.getDevice = () => Registry.persistent.get().$Device.device;

  Device.setDevice = model => {
    Registry.persistent.set(draft => {
      draft.$Device.device = model;
    });
  };
}
