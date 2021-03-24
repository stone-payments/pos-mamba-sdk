import { Registry } from '../index.js';

export const NAMESPACE = '$Device';

export const SETTINGS = {
  deviceList: ['S920', 'MP35P'],
};

export const PERSISTENT_SETTINGS = {
  device: 'MP35P',
};

export function setup(Device) {
  Device.getList = () => Registry.get().$Device.deviceList;

  Device.getDevice = () => Registry.persistent.get().$Device.device;

  Device.setDevice = model => {
    Registry.persistent.set(draft => {
      draft.$Device.device = model;
    });
  };
}
