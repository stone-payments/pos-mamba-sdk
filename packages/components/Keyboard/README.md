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
