import { Core } from '../../simulator/libs/main.js';

export const NAMESPACE = '$Card';

export const SIGNALS = ['cardInserted', 'cardRemoved'];

export const SETTINGS = {
  isInserted: false,
};

export function setup(Card) {
  Card.isCardInserted = () => Core.get('$Card.isInserted');

  Core.on('toggleCard', isInserted => {
    Core.set('$Card.isInserted', isInserted);
    if (isInserted) {
      Card.cardInserted();
    } else {
      Card.cardRemoved();
    }
  });
}
