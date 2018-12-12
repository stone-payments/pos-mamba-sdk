# Printer

## Descrição

Este módulo da API Nativa é responsável por controlar a impressora da máquina.

> Para impressões, é recomendado o uso do componente **@mamba/printable** ao invés de usar esta biblioteca diretamente.

## Interface

```ts
interface Printer {
  print: (element: HTMLElement, options: PrinterOptions) => Promise
  getPaperWidth: () => number
  isPrinting: () => boolean
  failedPrinting: () => boolean
}

interface PrinterOptions {
  use_dithering: boolean
}
```

### print(element, options)

Recebe um `HTMLElement` e o imprime. Este método retorna uma [`Promise`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise) que é `resolvida` caso a impressora tenha terminado de imprimir com sucesso ou `rejeitada` caso tenha ocorrido alguma falha no processo.

#### Opções

| Parâmetro | Descrição           | Tipo            | Padrão    |
| :-------- | :------------------ | :-------------- | :-------- |
| use_dithering | Define se deve ser aplicado um algoritmo de dithering na impressão. Use esta função somente para imprimir imagens, pois o dithering diminui a qualidade da impressão de texto | `boolean` | `false` |

```js
import Printer from '@mamba/pos/api/printer.js';

const fooElement = document.querySelector('.receipt')

Printer.print(fooElement, {
  use_dithering: true
})
```

### getPaperWidth()

Retorna a largura do papel, em `px`, da impressora.

```js
import Printer from '@mamba/pos/api/printer.js';

Printer.getPaperWidth() // 384
```

### isPrinting()

Retorna se a impressora está no meio de uma impressão ou não.

```js
import Printer from '@mamba/pos/api/printer.js';

Printer.isPrinting() // false

/** Print something */
Printer
  .print(...,...)
  /** After printing something */
  .then(() => {
    Printer.isPrinting() // false
  })

Printer.isPrinting() // true
```

### failedPrinting()

Checa se houve alguma falha no último processo de impressão.

> O método **Printer.print()** retorna uma [Promise](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise). É recomendado o uso do **.catch()** para checar se houve alguma falha de impressão.

```js
import Printer from '@mamba/pos/api/printer.js';

/** Print something */
Printer
  .print(...,...)
  /** After failing to print something */
  .catch(() => {
    Printer.failedPrinting() // true
  })

Printer.failedPrinting() // false
```