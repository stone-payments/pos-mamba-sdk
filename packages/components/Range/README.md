# Range

O módulo `Range` pode ser usado para representar um intervalo de valores.

<!-- @example ./example/Example.Html -->

## Parâmetros

| Parâmetro | Descrição                                     | Tipo              | Padrão      |
| :-------- | :-------------------------------------------- | :---------------- | :---------- |
| value     | Valor pré definido                            | `int`             | `50`        |
| step      | degrau de valores                             | `int`             | `10`        |
| max       | valor máximo                                  | `int`             | `100`       |
| min       | valor mínimo                                  | `int`             | `0`         |
| mainColor | cor do progreasso e botões                    | `string` (hex)    | `#3da10f`   |
| barColor  | cor de fundo                                  | `string` (hex)    | `#000`      |
| textColor | cor do texto                                  | `string` (hex)    | `#404040`   |
| icon      | icone que será apresentado ao lado do texto   | `string`          | `undefined` |
| change    | lança um evento a cada alteração no range     | `function`        | `undefined` |
| unit      | unidade de valor                              | `string` (%,x...) | `undefined` |
