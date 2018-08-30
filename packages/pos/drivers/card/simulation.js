import { State } from '../../simulator/libs/main.js';

export const NAMESPACE = 'Card';

export const SIGNALS = ['cardInserted', 'cardRemoved'];

export const SETTINGS = {
  isInserted: false,
};

export function setup(Card) {
  Card.isCardInserted = () => State.get('Card.isInserted');

  State.on('toggleCard', isInserted => {
    State.set('Card.isInserted', isInserted);
    if (isInserted) {
      Card.cardInserted();
    } else {
      Card.cardRemoved();
    }
  });
}
