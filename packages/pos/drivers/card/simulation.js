import Core from '../../simulator/core.js';

export const NAMESPACE = '$Card';

export const SIGNALS = ['cardInserted', 'cardRemoved'];

export const SETTINGS = {
  isInserted: false,
};

export function setup(Card) {
  Card.isCardInserted = () => Core.Registry.get('$Card.isInserted');

  Core.HardwareManager.on('toggleCard', isInserted => {
    Core.Registry.set('$Card.isInserted', isInserted);
    if (isInserted) {
      Card.cardInserted();
    } else {
      Card.cardRemoved();
    }
  });
}
