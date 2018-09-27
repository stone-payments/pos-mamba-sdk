# Card

## Descrição

Manipula o evento de cartão no POS.

### once(param, callBack)

Escuta apenas uma vez um evento de cartão, podendo ser  `cardInserted` para cartão inserido e `cardRemoved` para cartão removido.

```js
  import Card from '@mamba/pos/api/card.js';

  Card.once('cardInserted', () => {
    console.log('Inserted card');

  });

  Card.once('cardRemoved', () => {
    console.log('Removed card');

  });

```

## Eventos

| Nome         | Descrição                                  |
|--------------|--------------------------------------------|
| cardInserted | Cartão inserido no POS, executa o callback |
| cardRemoved  | Cartão removido do POS, executa o callback |
