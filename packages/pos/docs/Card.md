# Card

## Descrição

Manipula o evento de cartão no POS.

## Interface

```ts
interface Connect {
  once: (param: property, callBack: function) => void
  
}
```

### once(param, callBack)

Fica escutando eventos de cartão, podendo ser definido no par^metro `cardInserted` para cartão inserido no POS e `cardRemoved` para cartão removido.

```js
  import Card from '@mamba/pos/api/card.js';

  Card.once('cardInserted', () => {
    console.log('Inserted card');

  });

  Card.once('cardRemoved', () => {
    console.log('Removed card');

  });

```
