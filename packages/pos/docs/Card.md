# Card

## Descrição

Manipula o evento de cartão no POS.

## Interface

```ts
interface Conect {
  once: (param: propierts, callBack: function) => void

  cardInserted: () => boolean
  cardRemoved: () => boolean
}
```

### once(param, callBack)

Fica escutando eventos de cartão, podendo ser definido no par^metro `cardInserted` para cartão inserido no POS e `cardRemoved` para cartão removido.

```js
  import Card from '@mamba/pos/api/card.js';

  Card.once('cardInserted', () => {
    console.log('Inserted card');

    const cardInserted = Card.isCardInserted();
    if (cardInserted)
      console.log(`isCardInserted: ${cardInserted}`);
  });

  Card.once('cardRemoved', () => {
    console.log('Removed card');

    const cardRemoved = Card.isCardRemoved();
    if (cardRemoved)
      console.log(`isCardRemoved: ${cardRemoved}`);
  });

```
