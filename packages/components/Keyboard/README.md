# Keyboard

#### Keyboard

```js
import KeyboardInput from '@mamba/input/Keyboard.html';
```

#### NumericKeyboard

```js
import NumericKeyboard from '@mamba/input/NumericKeyboard.html';
```

# Documentação do teclado virtual numérico

A nova versão do teclado numérico consiste em instanciar o componente e configurar os eventos por ele emitido. Essa versão visa uma maior usabilidade do componente e melhor encapsulamento das responsabilidades do próprio, visto que ele independe do cenário que vai ser colocado e permite com que qualquer lógica seja empregada. Os eventos apesar de retornarem o mesmo payload, foram dividos afim de incentivar uma maior segregação de responsabilidade.

### Eventos

| Nome         | Descrição                   | Payload           |
| ------------ | --------------------------- | ----------------- |
| keypress     | Teclas comuns do teclado    | { input: string } |
| mathKeypress | Teclas do teclado numerico  | { input: string } |
| backspace    | Tecla para apagar caractere | { input: string } |
| submit       | Tecla de submit             | { input: string } |

## Keyboard

| Parâmetross | Descrição                                | Tipo     | Padrão |
| ----------- | ---------------------------------------- | -------- | ------ |
| maxLength   | Limita o número de caracteres do teclado | `number` | `30`   |

## NumericKeyboard

| Parâmetross | Descrição                                          | Tipo      | Padrão  |
| ----------- | -------------------------------------------------- | --------- | ------- |
| type        | Define qual o tipo de teclado deve ser renderizado | `string`  | `null`  |
| isFocused   | Define se o teclado deve ou não começar aberto     | `boolean` | `false` |

`<NumericKeyboard ... on:event="..." />`

| Eventos  | Disparado quando ...                                   | Tipo              |
| -------- | ------------------------------------------------------ | ----------------- |
| submit   | Dispara quando o botão de confirmação for selecionado. | `function(event)` |
| addInput | Envia os botões de operação matematica selecionado     | `function(event)` |

# Native API

Este módulo da API Nativa é responsável por expor métodos de controle sobre o teclado da máquina, bem como métodos de ajuda auxiliares.

## Interface

```ts
interface Keyboard {
  setKeyboardAsNumeric: () => void;
  setKeyboardAsAlphanumeric: () => void;

  getKeyCode: (keyName: string) => number;
  getKeyName: (keyCode: number) => string;

  isNumericKey: (keyCode: number) => boolean;
  isActionKey: (keyCode: number) => boolean;

  isBackspaceEnabled: () => boolean;
  disableBackspace: () => void;
  enableBackspace: () => void;
}
```

### setKeyboardAsNumeric()

Define que a máquina irá digitar apenas números.

```js
import Keyboard from '@mamba/pos/api/keyboard.js';

Keyboard.setKeyboardAsNumeric();
```

### setKeyboardAsAlphanumeric()

Define que a máquina irá digitar caracteres alfanuméricos.

```js
import Keyboard from '@mamba/pos/api/keyboard.js';

Keyboard.setKeyboardAsAlphanumeric();
```

### getKeyCode(keyName)

Retorna o `código da tecla` referente a uma tecla da máquina.

```js
import Keyboard from '@mamba/pos/api/keyboard.js'

Keyboard.getKeyCode('enter'); // 13
Keyboard.getKeyCode('back'); // 8
Keyboard.getKeyCode('close'); // 27
Keyboard.getKeyCode('help'); // 17
Keyboard.getKeyCode('shortcuts'); // 16
Keyboard.getKeyCode('0'); // 48
...
Keyboard.getKeyCode('9'); // 57
```

### getKeyName(keyCode)

Retorna o `nome da tecla` referente ao código de uma tecla da máquina.

```js
import Keyboard from '@mamba/pos/api/keyboard.js'

Keyboard.getKeyName(13); // 'enter'
Keyboard.getKeyName(8); // 'back'
Keyboard.getKeyName(27); // 'close'
Keyboard.getKeyName(17); // 'help'
Keyboard.getKeyName(16); // 'shortcuts'
Keyboard.getKeyName(48); // '0'
...
Keyboard.getKeyName(57); // '9'
```

### isNumericKey(keyCode)

Retorna se uma tecla representa um número.

```js
import Keyboard from '@mamba/pos/api/keyboard.js';

/** 13 = 'enter' */
Keyboard.isNumericKey(13); // false

/** 57 = '9' */
Keyboard.isNumericKey(57); // true
```

### isActionKey(keyCode)

Retorna se uma tecla representa uma ação.

```js
import Keyboard from '@mamba/pos/api/keyboard.js';

/** 13 = 'enter' */
Keyboard.isActionKey(13); // true

/** 57 = '9' */
Keyboard.isActionKey(57); // false
```

### isBackspaceEnabled()

Retorna se o uso do botão de `voltar` está habilitado ou não no aplicativo.

### disableBackspace()

Desabilita o uso do botão de `voltar` no aplicativo em questão.

### enableBackspace()

Habilita o uso do botão de `voltar` no aplicativo em questão.

```js
import Keyboard from '@mamba/pos/api/keyboard.js';

Keyboard.isBackspaceEnabled(); // true

/** Disable the backspace button */
Keyboard.disableBackspace();

Keyboard.isBackspaceEnabled(); // false

/** Enable the backspace button */
Keyboard.enableBackspace();
```

## Keyboard keys

The `KEYBOARD` object provides the specific key-maps and key-names of POS.

```js
import { KEYBOARD } from '@mamba/pos';
```

### KEY_NAMES

```js
const { KEY_NAMES } = KEYBOARD;

KEY_NAMES.ENTER; // enter
```

Values:

```json
{
  "CLOSE": "close",
  "BACK": "back",
  "ENTER": "enter",
  "HELP": "help",
  "SHORTCUTS": "shortcuts",
  "KEYUP": "keyup",
  "KEYDOWN": "keydown",
  "F24": "F24",
  "F23": "F23",
  "KEY_0": "0",
  "KEY_1": "1",
  "KEY_2": "2",
  "KEY_3": "3",
  "KEY_4": "4",
  "KEY_5": "5",
  "KEY_6": "6",
  "KEY_7": "7",
  "KEY_8": "8",
  "KEY_9": "9"
}
```

### KEY_CODES

```js
const { KEY_CODES } = KEYBOARD;

KEY_CODES.ENTER; // 13
```

Values:

```json
{
  "ENTER": 13,
  "KEYBACK": 8,
  "CLOSE": 27,
  "HELP": 17,
  "SHORTCUTS": 16,
  "F23": 134,
  "F24": 135,
  "KEYUP": 38,
  "KEYDOWN": 40,
  "KEY_0": 48,
  "KEY_1": 49,
  "KEY_2": 50,
  "KEY_3": 51,
  "KEY_4": 52,
  "KEY_5": 53,
  "KEY_6": 54,
  "KEY_7": 55,
  "KEY_8": 56,
  "KEY_9": 57
}
```

### KEYMAP

This object is more useful with the method [Keyboard.getKeyName(keyCode)]. See example below.

[keyboard.getkeyname(keycode)]: #getkeynamekeycode

```js
const { KEY_MAP } = KEYBOARD; // or KEYMAP (deprecated)

KEY_MAP.13; // enter
```

Values:

```json
{
  "8": "back",
  "13": "enter",
  "16": "shortcuts",
  "17": "help",
  "27": "close",
  "38": "keyup",
  "40": "keydown",
  "48": "0",
  "49": "1",
  "50": "2",
  "51": "3",
  "52": "4",
  "53": "5",
  "54": "6",
  "55": "7",
  "56": "8",
  "57": "9",
  "134": "F23",
  "135": "F24"
}
```

## Usage example

Let's say you want to do some action on your screen based on some POS key.

```html
<svelte:window on:keyup="onKeyup(event)" />

<script>
  import Keyboard from '@mamba/pos/api/keyboard.js';
  import { KEYBOARD } from '@mamba/pos/index.js';

  export default {
    methods: {
      /**
       * @description handle physical keyboard events
       * @param {KeyboardEvent} event
       */
      onKeyup(event) {
        const { keyCode } = event;
        const { KEY_NAMES, KEY_CODES } = KEYBOARD;

        const keyName = Keyboard.getKeyName(keyCode);

        if (keyName === KEY_NAMES.BACK) {
          // Do something with back key name
        } else if (keyName === KEY_NAMES.ENTER) {
          // Do something with enter key name
        }

        // Using key code directly
        if (keyCode === KEY_CODES.SHORTCUTS) {
          // Do something with shortcut key code
        }
      },
    },
  };
</script>
```
