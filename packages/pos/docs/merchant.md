# Merchant

## Descrição

Este módulo da API Nativa é responsável por expor métodos relativos ao lojista e suas informações.

## Interface

```ts

interface MerchantInfo {
  zipCode: string,
  country: string,
  city: string,
  state: string,
  neighborhood: string,
  complement: string,
  street: string,
  number: string,
  displayName: string,
  taxationIdentificationType: string,
  taxationIdentificationNumber: string,
  acquirerIssuedMerchantId: string,
}

interface Merchant {
  getStoneCode: () => string;
  getInfo: () => MerchantInfo
}
```

### getStoneCode()

Retorna o `Stone Code` do lojista.

```js
import Merchant from '@mamba/pos/api/merchant.js';

Merchant.getStoneCode(); // '123123123'
```

### getInfo()

Retorna as seguintes informações do lojista pelo objeto `MerchantInfo`.

```js
import Merchant from '@mamba/pos/api/merchant.js';

Merchant.getInfo(); // '123123123'
```