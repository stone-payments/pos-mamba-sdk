# Keyboard

## Descrição

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
import Keyboard from'@mamba/pos/api/keyboard.js'

Keyboard.setKeyboardAsNumeric()
```

### setKeyboardAsAlphanumeric()

Define que a máquina irá digitar caracteres alfanuméricos.

```js
import Keyboard from '@mamba/pos/api/keyboard.js'

Keyboard.setKeyboardAsAlphanumeric()
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
import Keyboard from '@mamba/pos/api/keyboard.js'

/** 13 = 'enter' */
Keyboard.isNumericKey(13); // false

/** 57 = '9' */
Keyboard.isNumericKey(57); // true
```

### isActionKey(keyCode)

Retorna se uma tecla representa uma ação.

```js
import Keyboard from '@mamba/pos/api/keyboard.js'

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
import Keyboard from '@mamba/pos/api/keyboard.js'

Keyboard.isBackspaceEnabled(); // true

/** Disable the backspace button */
Keyboard.disableBackspace();

Keyboard.isBackspaceEnabled(); // false

/** Enable the backspace button */
Keyboard.enableBackspace();
```
