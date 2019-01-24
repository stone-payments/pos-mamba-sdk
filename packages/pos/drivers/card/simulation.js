import { Registry, HardwareManager } from '../../simulator/index.js';

export const NAMESPACE = '$Card';

export const SIGNALS = ['cardInserted', 'cardRemoved'];

export const SETTINGS = {
  isInserted: false,
};

export function setup(Card) {
  Card.isCardInserted = () => Registry.get().$Card.isInserted;

  HardwareManager.on('toggleCard', isInserted => {
    Registry.set(draft => {
      draft.$Card.isInserted = isInserted;
    });

    if (isInserted) {
      Card.cardInserted();
    } else {
      Card.cardRemoved();
    }
  });
}
