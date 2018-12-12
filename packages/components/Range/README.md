# Range

O módulo `Range` pode ser usado para representar um valor dentro de um intervalo, que pode ser alterado a partir dos botões nas laterais.

<!-- @example ./example/Example.Html -->

## Parâmetros

| Parâmetro | Descrição                                     | Tipo              | Padrão      |
| :-------- | :-------------------------------------------- | :---------------- | :---------- |
| value     | valor escolhido                               | `int`             | `50`        |
| step      | intervalo entre valores                       | `int`             | `10`        |
| max       | valor máximo                                  | `int`             | `100`       |
| min       | valor mínimo                                  | `int`             | `0`         |
| mainColor | cor do progresso e botões                     | `string` (hex)    | `#3da10f`   |
| barColor  | cor de fundo                                  | `string` (hex)    | `#000`      |
| textColor | cor do texto                                  | `string` (hex)    | `#404040`   |
| icon      | ícone que será apresentado ao lado do texto   | `string`          | `undefined` |
| unit      | unidade de valor                              | `string` (%,x...) | `undefined` |

## Eventos

`<Range ... on:event="..."/>`

| Eventos     | Descrição                                                               | Tipo            |
|-------------|-------------------------------------------------------------------------|-----------------|
| decrement   | Especifique uma função que será chamada quando o valor é decrescido     | `function(int)` |
| increment   | Especifique uma que será chamada função quando o valor é aumentado      | `function(int)` |

## Métodos

### increment()

Aumenta em uma unidade do `Step` o valor atual do `Range`.

### decrement()

Diminui em uma unidade do `Step` o valor atual do `Range`.