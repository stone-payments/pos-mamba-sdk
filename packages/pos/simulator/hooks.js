import * as Managers from './plugins/index.js';

const { System } = Managers;

export const onBoot = fn => {
  if (System.booted) return fn(Managers);
  System.on('boot', () => fn(Managers));
};

export const onViewLoad = fn => {
  if (System.POS) return fn(Managers);
  System.on('viewLoad', () => fn(Managers));
};
