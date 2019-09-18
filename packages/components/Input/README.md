# Input

O componente `Input` e `MoneyInput` contém funcionalidades de uma caixa de texto com estilos e controles embutidos para facilitar o desenvolvimento.

## Como utilizar

#### Input padrão

```js
import Input from '@mamba/input';
```

#### MoneyInput

```js
import MoneyInput from '@mamba/input/Money.html';
```

#### Keyboard

```js
import Input from '@mamba/input/Text.html';
```

<!-- @example ./example/Example.html -->

## Parâmetros

| Parâmetro    | Descrição                                                   | Tipo           | Padrão      |
| ------------ | ----------------------------------------------------------- | -------------- | ----------- |
| align        | Alinha a entrada de acordo com parâmetro (`left`, `right`)  | `string`       | `'right'`   |
| alphanumeric | Define o modo de entrada como alfanumérico                  | `boolean`      | `false`     |
| autofocus    | Inicia o elemento com foco                                  | `boolean`      | `false`     |
| forceFocus   | Força o foco no elemento de input                           | `boolean`      | `false`     |
| isFocused    | Retorna se o input está focado ou não                       | `boolean`      | `false`     |
| bgColor      | Cor de Fundo da Caixa de Entrada                            | `string` (hex) | `'#fff'`    |
| disabled     | Desabilita a entrada de texto                               | `boolean`      | `false`     |
| errorMessage | Define uma mensagem de erro caso a validação falhe          | `boolean`      | `false`     |
| errorColor   | Cor do Texto da Mensagem de Erro                            | `string` (hex) | `#d5000`    |
| label        | Título da Caixa de Entrada                                  | `string`       | `undefined` |
| readable     | Possibilita esconder o texto de Entrada                     | `boolean`      | `false`     |
| type         | Tipo de texto de entrada (`password`/`text`)                | `string`       | `'text'`    |
| textColor    | Cor do Texto da Caixa de Entrada                            | `string` (hex) | `'#4a4a4a'` |
| labelColor   | Cor do título do Input                                      | `string` (hex) | `'#4a4a4a'` |
| value        | Valor de padrão de entrada                                  | `string`       | `false`     |
| validation   | Adiciona um método de validação                             | `function`     | `undefined` |
| validateOn   | Define em que momento a validação ocorre (`input`/`submit`) | `string`       | `'submit'`  |
| mask         | Define uma máscara para o texto                             | `string`       | `null`      |

### Money

| Parâmetro       | Descrição                                                                                                     | Tipo                 | Padrão  |
| --------------- | ------------------------------------------------------------------------------------------------------------- | -------------------- | ------- |
| cents           | Valor do input em centavos                                                                                    | `string` or `number` | `0`     |
| readonlyOnEnter | Faz com que o campo se torne somente leitura no keypress do `enter` e se o valor em centavos for igual a zero | `boolean`            | `false` |

## Eventos

`<Input ... on:event="..." />`

| Evento        | Disparado quando ...                                                              | Tipo              |
| ------------- | --------------------------------------------------------------------------------- | ----------------- |
| submit        | A validação( se houver ) do campo for bem-sucedida, quando o campo for submetido. | `function(event)` |
| submitValid   | O campo for **inválido** no momento do `submit`                                   | `function(event)` |
| submitInvalid | O campo for **válido** no momento do `submit`                                     | `function(event)` |

<br/>

Os eventos `submit`, `submitValid` e `submitInvalid`, retornam as seguintes propriedades no objeto `event`:

```ts
event = {
  value: string; // Valor do campo (com máscara se houver)
  rawValue: string; // Valor sem máscara ou formatação
  isValid: boolean; // Representa o valor da validação (se houver)
}
```

> Além desses eventos, o `Input` recebe os eventos `focus`, `blur`, `keydown`, `keyup` e `input` por padrão.

---

`<MoneyInput ... on:event="..." />`

O evento `submit`, `submitValid` e `submitInvalid` retornam as seguintes propriedades no objeto `event` para o `MoneyInput`:

```ts
event = {
  cents: number; // Valor em centavos
  formatted: string; // Valor formatado na moeda
  isValid: boolean; // Representa o valor da validação (se houver)
}
```

## Métodos

### prepend(value)

Adiciona um valor fixo no ínicio do campo de digitação.

### append(value)

Adiciona um valor fixo no final do campo de digitação.

### focus()

Coloca o foco no componente de input.

### blur()

Desfoca o componente de input.

### validate()

Força a validação do Input e retorna um _booleano_ representando o resultado da validação.

### invalidate(message)

Define que o input está com conteúdo inválido e mostra uma mensagem de erro opcional.

### makeReadOnly()

Desabilita o preenchimento do campo

### makeWritable()

Habilita o preenchimento do campo

## Máscara

O componente padrão `Input` suporta máscaras para formatar o seu valor. Para definir uma máscara de _input_, basta passar um parâmetro `mask` com uma ou mais máscaras. Uma máscara é definida por _tokens_ que, por padrão, são:

- `#` - Dígito
- `X` - Caractér alfanumérico
- `S` - Letra
- `A` - Letra maiúscula
- `a` - Letra minúscula
- `!` - Escapa o caractér do _token_

Exemplo de CPF/CNPJ:

```
<Input
  label="CPF/CNPJ"
  mask={['###.###.###-##', '##.###.###/####-##']}
/>
```

### mask()

Força uma atualização do conteúdo do `Input` para se adequar às máscaras definidas. Use apenas se a _prop_ `value` for definida manualmente através de um `inputComponent.set({ value: ... })`.
