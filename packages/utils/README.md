# `@mamba/utils`

O pacote `@mamba/utils` contém métodos úteis para facilitar o desenvolvimento de aplicativos Mamba.

## UI

`import * as UI from '@mamba/utils/ui.js';`

### `timeout(delay: Number): Promise`

`UI.timeout()` move a execução do script para o final da pilha de execução. É uma simples abstração de um `setTimeout` que retorna uma `Promise`.

```js
import { timeout } from '@mamba/utils/ui.js';

function init() {
  console.log('Log imediato');
  timeout(300).then(() => {
    console.log('Log após 300ms');
  });
}

init();
```

Com isso, é possível utilizar `async/await` para facilitar a leitura de alguns métodos:

```js
import { timeout } from '@mamba/utils/ui.js';

async function init() {
  console.log('Log imediato');
  await timeout(300);
  console.log('Log após 300ms');
}

init();
```

## Money

`import * as Money from '@mamba/utils/money.js';`

### `format(value: Number): string`

`Money.format()` formata um valor númerico para um formato de dinheiro:

```js
import { format } from '@mamba/utils/money.js';

format(100); // '100,00'
format(1000); // '1.000,00'
format(100000); // '100.000,00'
format(1000000.27); // '1.000.000,27'
```

### `padZero(value: Number | string): string`

`Money.padZero()` adiciona um `0` para valores numéricos menores que `10` or _strings_ de tamanho `1`.

```js
import { padZero } from '@mamba/utils/money.js';

padZero(1); // '01'
padZero('2'); // '02'
padZero(17); // '17'
padZero('230'); // '230'
```

### Arredondando

- `round(value: Number): Number`

- `ceil(value: Number): Number`

- `floor(value: Number): Number`

`Money.round()`, `Money.ceil()`, `Money.floor()` são similares aos métodos `Math.*` de mesmo nome. A principal diferença é que lidam com alguns erros de arrendondamento da linguagem e levam em conta o valor decimal.

```js
import { round, ceil, floor } from '@mamba/utils/money.js';

Math.round(1.005); // 1
round(1.005); // 1.01

Math.floor(127.77 / 10); // 12
floor(127.77 / 10); // 12.77

Math.ceil(127.77 / 10); // 13
ceil(127.77 / 10); // 12.78
```
