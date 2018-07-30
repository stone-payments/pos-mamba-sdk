# Payment

## Descrição

O módulo de Payment da API Nativa expõe métodos de controle de pagamento e informações sobre
o estado deste. Para execução do pagamento, a aplicação nativa de pagamentos será chamada para realizar
a transação.

## Interface

```ts
interface Payment {
  pay: (params: PaymentOptions, onPayCallback: Function) => void;
  getAmountAuthorized: () => number;
  enableCardEvent: () => void;
  disableCardEvent: () => void;
  isPaying: () => boolean;
  failedPaying: () => boolean;
  getCardHolderName: () => string;
  getAtk: () => string;
  getItk: () => string;
  getAuthorizationDateTime: () => Date;
  getBrand: () => string;
  getOrderId: () => string;
  getAuthorizationCode: () => string;
  getInstallmentCount: () => number;
  getPan: () => string;
  getType: () => string;
}

interface PaymentOptions {
  amount: number;
  editable_amount: boolean;
}
```

### Pay()

Abre o aplicativo de pagamentos passando os parâmetros de pagamento. Ao final executa o callback
passado à função e retorna o valor efetivamente pago pelo usuário, caso a operação de
pagamento não seja realizada, o valor retornado será 0.

```js
import Payment from '@mambasdk/payment';

Payment.pay({ amount: 500, editable_amount: false });
```

### getAmountAuthorized()

Retorna o valor autorizado do pagamento ou 0 caso ocorra algum problema.

```js
import Payment from '@mambasdk/payment';

Payment.getAmountAuthorized(); // 500
```

### enableCardEvent()

`Desabilita` a leitura de cartões.

```js
import Payment from '@mambasdk/payment';

Payment.enableCardEvent(); // card event enabled
```

### disableCardEvent()

`Habilita` a leitura de cartões.

```js
import Payment from '@mambasdk/payment';

Payment.disableCardEvent(); // card event disabled
```

### isPaying()

Retorna se está ocorrendo um pagamento no momento.

```js
import Payment from '@mambasdk/payment';

Payment.isPaying(); // true
Payment.isPaying(); // false
```

### failedPayment()

Retorna se o último pagamento falhou.

```js
import Payment from '@mambasdk/payment';

Payment.failedPaying(); // true
Payment.failedPaying(); // false
```

### getCardHolderName()

```js
import Payment from '@mambasdk/payment';

Payment.getCardHolderName(); // 'JAMES LEE'
```

### getAtk()

Retorna o código único da transação gerado pelo autorizador da transação.

```js
import Payment from '@mambasdk/payment';

Payment.getAtk(); // '11111111111111'
```

### getItk()

Retorna o código único da transação gerado pelo POS.

```js
import Payment from '@mambasdk/payment';

Payment.getItk(); // '11111111111111'
```

### getAuthorizationDateTime()

Retorna o horário da trasansação, caso ocorra falhas retorna uma linha vazia.

```js
import Payment from '@mambasdk/payment';

Payment.getAuthorizationDateTime(); // '2018-05-03:00:00:00.00'
```

### getBrand()

Retorna a Bandeira da transação

```js
import Payment from '@mambasdk/payment';

Payment.getBrand(); // 'MASTER'
```

### getOrderId()

Retorna o id do pagamento, em caso de erros retorna uma `string` vazia.

```js
import Payment from '@mambasdk/payment';

Payment.getOrderId(); // '12356068'
```

### getAuthorizationCode()

Retorna o código do autorizador. Caso a operação falhe, retorna uma `string` vazia.

```js
import Payment from '@mambasdk/payment';

Payment.getAuthorizationCode(); // '111111'
```

### getInstallmentCount()

Retorna o número de parcelas do pagamento. Caso a operação falhe, retorna 0.

```js
import Payment from '@mambasdk/payment';

Payment.getAuthorizationCode(); // 0
```

### getPan()

Retorna o número da conta do cartão em que compra foi realizado. Caso a operação falhe, retorna uma
`string` vazia.

```js
import Payment from '@mambasdk/payment';

Payment.getPan(); // '56497#####41578'
```

### getType()

Retorna o tipo da transação `CREDITO` ou `DEBITO`.

```js
import Payment from '@mambasdk/payment';

Payment.getType(); // 'CREDITO'
```
