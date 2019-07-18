# RadioButton

O módulo `RadioButton` é usado para ativar opções predefinida.

<!-- @example ./example/Example.Html -->

## Parâmetros

| Parâmetro | Descrição                                         | Tipo            | Padrão     |
| :-------- | :------------------------------------------------ | :-------------- | :--------- |
| change    | lança um evento quando o componente é modificado  | `function`      | `undefined`|
| checked   | deixa o switch ativado                            | `undefined`     | `true`     |
| disabled  | desabilita o switch                               | `undefined`     | `true`     |


## Métodos

### RadioButton.toggle(value)

Alterna o valor de `checked` do switch, caso `value` seja passado como parâmtro define `checked` para este valor.
