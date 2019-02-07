# `@mamba/utils`

The `@mamba/utils` package contains useful methods to facilitate development of Mamba apps.

## Money

`import * as Money from '@mamba/utils/money.js';`

### `format(value: Number): string`

`Money.format()` formats a numeric value to a currency format:

```js
import { format } from '@mamba/utils/money.js';

format(100); // '100,00'
format(1000); // '1.000,00'
format(100000); // '100.000,00'
format(1000000.27); // '1.000.000,27'
```

### `padZero(value: Number | string): string`

`Money.padZero()` left-pads a `0` for numeric values less than 10 or string values of length `1`.

```js
import { padZero } from '@mamba/utils/money.js';

padZero(1); // '01'
padZero('2'); // '02'
padZero(17); // '17'
padZero('230'); // '230'
```

### Rounding

- `round(value: Number): Number`

- `ceil(value: Number): Number`

- `floor(value: Number): Number`

`Money.round()`, `Money.ceil()`, `Money.floor()` are similar to their `Math.*` counterpart, except that they deal with some common javascript rounding errors and take the decimal value in account.

```js
import { round, ceil, floor } from '@mamba/utils/money.js';

Math.round(1.005); // 1
round(1.005); // 1.01

Math.floor(127.77 / 10); // 12
floor(127.77 / 10); // 12.77

Math.ceil(127.77 / 10); // 13
ceil(127.77 / 10); // 12.78
```
