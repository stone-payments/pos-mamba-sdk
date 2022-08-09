# Keyboard

Como usar:

```js
<Keyboard />

<script>
  export default {
    components: {
      Keyboard: '@mamba/keyboard/Keyboard.html',
    },
  };
</script>
```

## Eventos

```ts
interface KeyboardTypeEvents {
  /**
   * Executes the callback function every time mamba keyboard is rendered (e.g: when you change layouts).
   */
  onRender?: (instance: Keyboard) => void;

  /**
   * Executes the callback function once mamba keyboard is rendered for the first time (on initialization).
   */
  onInit?: (instance: Keyboard) => void;

  /**
   * Retrieves the current input
   */
  onChange?: (input: string, e?: KeyboardHandlerEvent) => void;

  /**
   * Executes the callback function on any key press. Returns button layout name (i.e.: “{enter}”, "b", "c", "2" ).
   */
  onKeyPress?: (button: string, e?: KeyboardHandlerEvent) => void;

  /**
   * Execute the callback function on keypress of non-standard type only (functionality type i.e.: “{alt}”).
   */
  onFunctionKeyPress?: (button: string, instance: Keyboard, e?: KeyboardHandlerEvent) => void;
}
```

## Opções

````ts
interface KeyboardOptions {
  /**
   * Specifies which keyboard type should be used out of the box.
   * Also can enforce by define dataset `<input data-keyboard-type="<type>" />`
   * @defaultValue {@link KeyboardType.Default}
   */
  keyboardType?: KeyboardType;

  /**
   * Specifies a custom keyboard layout to be used. This should be used in addition to {@link KeyboardType} setted to {@link KeyboardType.Custom}
   */
  layout?: KeyboardLayoutObject;

  /**
   * Specifies which layout should be used inside the "layout" option, useful to handle function keys (e.g. "{shift}")". This should be used in addition to {@link KeyboardType} setted to {@link KeyboardType.Custom}. Initial layout also can be defined here.
   */
  layoutName?: string;

  /**
   * Specifies which direction layout should render. Horizontaly, Verticaly or Fixed.
   * - {@link LayoutDirection.Horizontal}, layout will render from left to right axis (row flow)
   * - {@link LayoutDirection.Vertical}, layout will render from top to bottom axis (column flow)
   * - {@link LayoutDirection.Fixed}, layout will render in fixed grid mode. This mode helps draw layout like `space-evenly` on POS. But not support flexible arrange.
   * @defaultValue {LayoutDirection.Horizontal}
   */
  layoutDirection?: LayoutDirection;

  /**
   * A prop to add your own css classes to the keyboard wrapper.
   * You can add multiple classes separated by a space.
   */
  theme?: string;

  /**
   * Replaces variable buttons (such as `{backspace}`) with a human-friendly name (e.g.: `backspace`).
   */
  labels?: { [button: string]: string };

  /**
   * Converts button output value (such as `{check}`) to standard keyboard output (e.g.: `enter`).
   */
  outputs?: { [button: string]: string };

  /**
   * Change the CSS class to add to the button when it gets active by click.
   */
  activeButtonClass?: string;

  /**
   * Customize the CSS class to handle keyboard hidden events.
   *
   */
  hiddenKeyboardClass?: string;

  /**
   * Shows aditional debug information.
   * Runs a `console.log` every time a key is pressed.
   * Shows the buttons pressed and the current input.
   * Add `debug` class to main keyboard wrapper
   */
  debug?: boolean;

  /**
   * `number`: Restrains mamba keyboard input to a certain length.
   */
  maxLength?: any;

  /**
   * If input is readonly(or static `div` element as input), keyboard will disable cursor event handlers since it won't be necessary.
   *
   * This property do not change or include <input> readonly attribute
   */
  readonly?: boolean;

  /**
   * A prop to ensure characters are always be added/removed at the end of the string.
   */
  disableCursorPositioning?: boolean;

  /**
   * Restrains input(s) change to the defined regular expression pattern.
   */
  inputPattern?: RegExp;

  /**
   * Exclude specific buttons from each layout
   * @example
   *
   * ```js
   * excludeFromLayout: {
   *   default: ['a'],
   *   shift: ['B'],
   * }
   * ```
   */
  excludeFromLayout?: { [layoutName: string]: string[] };

  /**
   * Include specific function buttons to go through synthetic event dispatch.
   * This is useful to send key press of function keys to the input event handler, like math keys.
   *
   * The key code will be resolved by String.charcode if it's not already mapped. (only for single char)
   * @example
   * ```js
   * {
   *   ...
   *   // These keys will not display on input but send input events without braces
   *   // (e.g. KeyboardEvent({ key: "+", code: 107 }))
   *   allowKeySyntheticEvent: ['{+}', '{-}', '{*}', '{≠}'],
   * }
   * ```
   */
  allowKeySyntheticEvent?: string[];

  /**
   * Points key events to a customizable input element, instead of using document active element.
   * You can type and directly display the value in a `div` element setted with `data-keyboard="true" property`, so keyboard will insert its value to the element `innerText`.
   */
  input?: KeyboardInputOption;

  /**
   * Specifies if keyboard should operate automatic or manually.
   * - In automatic({@link KeyboardUpdateMode.Auto}) mode, it will try handle input key press value on focused elements.
   *
   * - In manually({@link KeyboardUpdateMode.Manual}) mode, it will leave the changes to you handle outside, using {@link KeyboardTypeEvents.onChange} event along with `oninput` DOM event.
   * @example
   * ```js
   * function onChange(input, e) {
   *   inputComponent.set({ value: input });
   * }
   *
   * const keyboard = new Keyboard({
   *  onChange: input => this.onChange(input),
   * });
   * // Update virtual keyboard input when the real one updates directly
   * inputDOMElement.addEventListener('input', event => {
   *   keyboard.setInput(event.target.value);
   * });
   *
   * ```
   *
   * @defaultValue {@link KeyboardUpdateMode.Auto}
   */
  updateMode?: KeyboardUpdateMode;

  /**
   * Keep keyboard visible (dont hide when input loose focus)
   *
   * @defaultValue `false`
   */
  keepVisible?: boolean;

  /**
   * Keep input cursor at its ends
   *
   * @defaultValue `false`
   */
  lockCursor?: boolean;

  /**
   * If  should render keyboard when it's instance creates
   * Call `render()` method to show the keyboard
   * @defaultValue `true`
   */
  autoRender?: boolean;

  /**
   * Make beep sound for every key press
   * ! This do not disable POS sound entirely. Only for this Keyboard instance
   * @defaultValue System preference depending of the app, otherwise `false`
   */
  soundEnabled?: boolean;

  /**
   * Define keyboard beep tone
   *
   * @defaultValue {@link BeepTone.TONE_3}
   */
  beepTone?: BeepTone;

  /**
   * Define keyboard beep time
   *
   * @defaultValue `90`
   */
  beepTime?: number;

  /**
   * Enable or disables key suggestions
   * @defaultValue `true`
   */
  enableLayoutSuggestions?: boolean;

  /**
   * Character suggestions for especial and exotic keys
   * Define it was tuple it max of four optional words
   * Some prefab keyboard already have some latin words
   * @see [Default Suggestions](./mappings/defaultSuggestions.ts)
   */
  layoutSuggestions?: { [key: string]: [string?, string?, string?, string?] };

  /**
   * Other options can exist
   */
  [name: string]: any;
}
````

# Teclados predisponíveis

```ts
enum KeyboardType {
  Default = 'default',
  Numeric = 'numeric',
  Phone = 'phone',
  Math = 'math',
  Custom = 'custom',
}
```

```js
import Keyboard from '@mamba/keyboard/api/index.js';

Keyboard.setOptions({
  keyboardType: 'numeric',
});
```

## Ou use um dos métodos prontos:

### ◼︎ Default _(alfanumérico)_

<img src="./images/default_keyboard_type.png" alt="alpha" width="40%" />
<br/><br/>

```js
import Keyboard from '@mamba/keyboard/api/index.js';

Keyboard.setKeyboardAsDefaultType();
```

### ◼︎ Numérico

<img src="./images/numeric_keyboard_type.png" alt="numeric" width="40%" />
<br/><br/>

```js
import Keyboard from '@mamba/keyboard/api/index.js';

Keyboard.setKeyboardAsNumericType();
```

### ◼︎ Calculadora

<img src="./images/math_keyboard_type.png" alt="numeric" width="40%" />
<br/><br/>

```js
import Keyboard from '@mamba/keyboard/api/index.js';

Keyboard.setKeyboardAsMathType();
```

### ◼︎ Telefone (Number pad)

<img src="./images/phone_keyboard_screenshot.png" alt="numeric" width="40%" />
<br/><br/>

```js
import Keyboard from '@mamba/keyboard/api/index.js';

Keyboard.setKeyboardAsPhoneType();
```

# API

Responsável por expor métodos de controle sobre o teclado, bem como métodos de ajuda auxiliares, e acesso aos métodos do teclado virtual e seus métodos derivados.

## Interface

```ts
interface Keyboard {
  virtualKeyboard: Keyboard;
  visibility: KeyboardVisibility;
  setKeyboardInputAsNumeric: () => void;
  setKeyboardInputAsAlphanumeric: () => void;
  getKeyCode: (keyName: string) => number;
  getKeyName: (keyCode: number) => string;
  isNumericKey: (keyCode: number) => boolean;
  isActionKey: (keyCode: number) => boolean;
  isBackspaceEnabled: () => boolean;
  disableBackspace: () => void;
  enableBackspace: () => void;
  setOptions(options?: {}): void;
  setInput(input: string): void;
  getInput(): string;
  clearInput(): void;
  replaceInput(keyboardInput: { default: string }): void;
  render(): void;
  show(): void; // Render alias
  unmount(): void;
  currentInputPatternIsValid(): boolean;
  getButtonElement(button: string): undefined | KeyboardElement | KeyboardElement[];
  setKeyboardAsCustomType(otherOptions?: {}): void;
  setKeyboardAsDefaultType(): void;
  setKeyboardAsMathType(): void;
  setKeyboardAsNumericType(): void;
  setKeyboardAsPhoneType(): void;
}
```

### setKeyboardInputAsNumeric()

Define que a máquina irá digitar apenas números.

```js
import Keyboard from '@mamba/keyboard/api/index.js';

Keyboard.setKeyboardInputAsNumeric();
```

### setKeyboardInputAsAlphanumeric()

Define que a máquina irá digitar caracteres alfanuméricos.

```js
import Keyboard from '@mamba/keyboard/api/index.js';

Keyboard.setKeyboardInputAsAlphanumeric();
```

### getKeyCode(keyName)

Retorna o `código da tecla` referente a uma tecla da máquina.

```js
import Keyboard from '@mamba/keyboard/api/index.js'

Keyboard.getKeyCode('Enter'); // 13
Keyboard.getKeyCode('Back'); // 8
Keyboard.getKeyCode('Close'); // 27
Keyboard.getKeyCode('Help'); // 17
Keyboard.getKeyCode('Shortcuts'); // 16
Keyboard.getKeyCode('0'); // 48
...
Keyboard.getKeyCode('9'); // 57
```

### getKeyName(keyCode)

Retorna o `nome da tecla` referente ao código de uma tecla da máquina.

```js
import Keyboard from '@mamba/keyboard/api/index.js'

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
import Keyboard from '@mamba/keyboard/api/index.js';

/** 13 = 'enter' */
Keyboard.isNumericKey(13); // false

/** 57 = '9' */
Keyboard.isNumericKey(57); // true
```

### isActionKey(keyCode)

(_Obsoleto_, usar `isFunctionKey()`)

Retorna se uma tecla representa uma ação.

```js
import Keyboard from '@mamba/keyboard/api/index.js';

/** 13 = 'enter' */
Keyboard.isActionKey(13); // true

/** 57 = '9' */
Keyboard.isActionKey(57); // false
```

### isFunctionKey(keyCode)

Retorna se uma tecla representa uma ação.

```js
import Keyboard from '@mamba/keyboard/api/index.js';

/** 13 = 'enter' */
Keyboard.isFunctionKey(13); // true

/** 57 = '9' */
Keyboard.isFunctionKey(57); // false
```

### isBackspaceEnabled()

Retorna se o uso do botão de `voltar`/`backspace` está habilitado ou não no aplicativo.

### disableBackspace()

Desabilita o uso do botão de `voltar`/`backspace` no aplicativo em questão.

### enableBackspace()

Habilita o uso do botão de `voltar`/`backspace` no aplicativo em questão.

```js
import Keyboard from '@mamba/keyboard/api/index.js';

Keyboard.isBackspaceEnabled(); // true

/** Disable the backspace button */
Keyboard.disableBackspace();

Keyboard.isBackspaceEnabled(); // false

/** Enable the backspace button */
Keyboard.enableBackspace();
```

## Keyboard native key map

Para usar as teclas nativas do teclado (teclado físico POS), você precisa instalar `@mamba/core`.
O objeto `KEYBOARD` fornece os mapas de teclas e nomes de teclas específicos do POS.

```js
import { KEYBOARD } from '@mamba/core';
```

See [@mamba/core Docs](../../core/README.md) for more info.
