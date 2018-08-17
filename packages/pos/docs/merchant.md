# Merchant

## Descrição

Este módulo da API Nativa é responsável por expor métodos relativos ao lojista e suas informações.

## Interface

```ts
interface Merchant {
  getStoneCode: () => string;
}
```

### getStoneCode()

Retorna o `Stone Code` do lojista.

```js
import Merchant '@mamba/pos/api/merchant.js';

Merchant.getStoneCode(); // '123123123'
```
