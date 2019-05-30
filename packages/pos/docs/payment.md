# Payment

## Descrição

O módulo de Payment da API Nativa expõe métodos de controle de pagamento e informações sobre
o estado do mesmo. Para execução do pagamento, a aplicação nativa de pagamentos será chamada para realizar
a transação.

## Interface

```ts
interface Payment {
  pay: (params: PaymentOptions) => Promise;
  getAmountAuthorized: () => number;
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
  cancel: (atk?: string) => Promise;
  failedCancellation: () => boolean;
}

interface PaymentOptions {
  order_id: number;
  amount: number;
  editable_amount: boolean;
  min_installments: number;
  max_installments: number;
  /* Respectivamente: Credito, Débito e Voucher/Ticket */
  transactionType: 'credit' | 'debit' | 'voucher';
  /* Respectivamente: À vista, Sem Juros e Com Juros */
  installmentType: 'none' | 'merchant' | 'issuer';
  /** 2 ~ 99 */
  installmentCount: number;
}
```

### pay(params)

Abre o aplicativo de pagamentos passando os parâmetros de pagamento (valor, pode ser editado, número máximo e mínimo de parcelas e um id para a transação) e retorna uma [`Promise`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise).

```js
import Payment from '@mamba/pos/api/payment.js';

Payment.pay({
  amount: 500,
  editable_amount: false,
  min_installments: 1,
  max_installments: 3,
  order_id: 21,
})
  .then(() => {
    console.log('Payment Done');
  })
  .catch(error => {
    console.log(error);
  });

// Payment Done
```

### getAmountAuthorized()

Retorna o valor autorizado do pagamento ou 0 caso ocorra algum problema.

```js
import Payment from '@mamba/pos/api/payment.js';

Payment.getAmountAuthorized(); // 500
```

### isPaying()

Retorna se está ocorrendo um pagamento no momento.

```js
import Payment from '@mamba/pos/api/payment.js';

Payment.isPaying(); // true or false
```

### failedPayment()

Retorna se o último pagamento falhou.

```js
import Payment from '@mamba/pos/api/payment.js';

Payment.failedPaying(); // true or false
```

### getCardHolderName()

Retorna o nome do portador do cartão inserido no leitor.

```js
import Payment from '@mamba/pos/api/payment.js';

Payment.getCardHolderName(); // 'JAMES LEE'
```

### getAtk()

Retorna o código único da transação gerado pelo autorizador da transação.

```js
import Payment from '@mamba/pos/api/payment.js';

Payment.getAtk(); // '11111111111111'
```

### getItk()

Retorna o código único da transação gerado pelo POS.

```js
import Payment from '@mamba/pos/api/payment.js';

Payment.getItk(); // '11111111111111'
```

### getAuthorizationDateTime()

Retorna o horário da transação e, caso ocorra falha, retorna uma linha vazia.

```js
import Payment from '@mamba/pos/api/payment.js';

Payment.getAuthorizationDateTime(); // '2018-05-03:00:00:00.00'
```

### getBrand()

Retorna a Bandeira da transação.

- OUTROS
- MASTERCARD
- VISA
- TICKET
- VR
- ELO
- ALELO
- SODEXO
- HIPERCARD
- HIPER
- COOPER
- SENFF
- AMEX
- GREENCARD
- VALECARD
- VEROCARD
- VERDECARD
- CABAL
- UP BRASIL
- SOROCRED
- BANESCARD

```js
import Payment from '@mamba/pos/api/payment.js';

Payment.getBrand(); // 'MASTER'


```

### getOrderId()

Retorna o id do pagamento e, em caso de erro, retorna uma `string` vazia.

```js
import Payment from '@mamba/pos/api/payment.js';

Payment.getOrderId(); // '12356068'
```

### getAuthorizationCode()

Retorna o código do autorizador. Caso a operação falhe, retorna uma `string` vazia.

```js
import Payment from '@mamba/pos/api/payment.js';

Payment.getAuthorizationCode(); // '111111'
```

### getInstallmentCount()

Retorna o número de parcelas do pagamento. Caso a operação falhe, retorna `0`.

```js
import Payment from '@mamba/pos/api/payment.js';

Payment.getInstallmentCount(); // 0
```

### getPan()

Retorna o PAN (Permanent Account Number) mascarado do cartão em que compra foi realizado. Caso a operação falhe, retorna uma
`string` vazia.

```js
import Payment from '@mamba/pos/api/payment.js';

Payment.getPan(); // '56497#####41578'
```

### getType()

Retorna o tipo da transação `Crédito` ou `Débito`.

```js
import Payment from '@mamba/pos/api/payment.js';

Payment.getType(); // 'Crédito'
```

### cancel()

Abre o app de cancelamento com todas as transações realizadas pelo seu app.

```js
import Payment from '@mamba/pos/api/payment.js';

Payment.cancel()
  .then(amountCanceled => {
    console.log(amountCancelled); // 50
  })
  .catch(error => {
    console.log(error); // 'Cancellation Failed.'
  });
```

### cancel(atk)

Cancela uma transação utilizando o ATK desta.

```js
import Payment from '@mamba/pos/api/payment.js';

Payment.cancel('000000')
  .then(amountCanceled => {
    console.log(amountCancelled); // 50
  })
  .catch(error => {
    console.log(error); // 'Cancellation Failed.'
  });
```

### failedCancellation()

Retorna `true` caso o último cancelamento tenha falhado.

```js
import Payment from '@mamba/pos/api/payment.js';

Payment.failedCancellation(); // true or false
```
