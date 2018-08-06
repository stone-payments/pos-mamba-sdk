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
  cancel: (atk: string) => Promise;
  failedCancellation: () => boolean;
}

interface PaymentOptions {
  amount: number;
  min_installments: number;
  max_installments: number;
  editable_amount: boolean;
}
```

### pay(params)

Abre o aplicativo de pagamentos passando os parâmetros de pagamento (valor, número máximo e mínimo de parcelas e se pode ser editado) e retorna uma [`Promise`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise).

```js
import Payment from '@mambasdk/api/payment.js';

Payment.pay({ amount: 500, editable_amount: false, min_installments: 1, max_installments: 3})
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
import Payment from '@mambasdk/api/payment.js';

Payment.getAmountAuthorized(); // 500
```

### enableCardEvent()

**Habilita** a leitura de cartões.

```js
import Payment from '@mambasdk/api/payment.js';

Payment.enableCardEvent(); // card event enabled
```

### disableCardEvent()

**Desabilita** a leitura de cartões.

```js
import Payment from '@mambasdk/api/payment.js';

Payment.disableCardEvent(); // card event disabled
```

### isPaying()

Retorna se está ocorrendo um pagamento no momento.

```js
import Payment from '@mambasdk/api/payment.js';

Payment.isPaying(); // true or false
```

### failedPayment()

Retorna se o último pagamento falhou.

```js
import Payment from '@mambasdk/api/payment.js';

Payment.failedPaying(); // true or false
```

### getCardHolderName()

```js
import Payment from '@mambasdk/api/payment.js';

Payment.getCardHolderName(); // 'JAMES LEE'
```

### getAtk()

Retorna o código único da transação gerado pelo autorizador da transação.

```js
import Payment from '@mambasdk/api/payment.js';

Payment.getAtk(); // '11111111111111'
```

### getItk()

Retorna o código único da transação gerado pelo POS.

```js
import Payment from '@mambasdk/api/payment.js';

Payment.getItk(); // '11111111111111'
```

### getAuthorizationDateTime()

Retorna o horário da trasansação, caso ocorra falhas retorna uma linha vazia.

```js
import Payment from '@mambasdk/api/payment.js';

Payment.getAuthorizationDateTime(); // '2018-05-03:00:00:00.00'
```

### getBrand()

Retorna a Bandeira da transação

```js
import Payment from '@mambasdk/api/payment.js';

Payment.getBrand(); // 'MASTER'
```

### getOrderId()

Retorna o id do pagamento, em caso de erros retorna uma `string` vazia.

```js
import Payment from '@mambasdk/api/payment.js';

Payment.getOrderId(); // '12356068'
```

### getAuthorizationCode()

Retorna o código do autorizador. Caso a operação falhe, retorna uma `string` vazia.

```js
import Payment from '@mambasdk/api/payment.js';

Payment.getAuthorizationCode(); // '111111'
```

### getInstallmentCount()

Retorna o número de parcelas do pagamento. Caso a operação falhe, retorna `0`.

```js
import Payment from '@mambasdk/api/payment.js';

Payment.getAuthorizationCode(); // 0
```

### getPan()

Retorna o número da conta do cartão em que compra foi realizado. Caso a operação falhe, retorna uma
`string` vazia.

```js
import Payment from '@mambasdk/api/payment.js';

Payment.getPan(); // '56497#####41578'
```

### getType()

Retorna o tipo da transação `CREDITO` ou `DEBITO`.

```js
import Payment from '@mambasdk/api/payment.js';

Payment.getType(); // 'CREDITO'
```
### cancel(atk)

Cancela uma transação utilizando o atk desta.

```js
import Payment from '@mambasdk/api/payment.js';

Payment.cancel('000000')
.then((amountCanceled) => {
  console.log(amountCancelled);
 }) // 50
.catch((error) => {
  console.log(error);
}) // 'Cancellation Failed.'
```

### failedCancellation()

Retorna `true` caso o último cancelamento tenha falhado.

```js
import Payment from '@mambasdk/api/payment.js';

Payment.failedCancellation() // true or false
```
