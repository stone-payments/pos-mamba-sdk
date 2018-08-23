# Input

O componente `Input` contém funcionalidades de uma caixa de texto com estilos e controles embutidos para facilitar o desenvolvimento.

<!-- @example ./example/Example.html -->

## Parâmetros

| Parâmetro   | Descrição                                                  | Tipo            | Padrão     |
|-------------|------------------------------------------------------------|-----------------|------------|
| align       | Alinha a entrada de acordo com paramêtro (`left`, `right`) | `string`        | `'right'`  |
| alphanumeric| Define o modo de entrada como alfanúmerico                 | `boolean`       | `false`    |
| autofocus   | Inicia o elemento com foco                                 | `boolean`       | `false`    |
| bgColor     | Cor de Fundo da Caixa de Entrada                           | `string` (hex)  | `'#fff'`   |
| disabled    | Desabilita a entrada de texto                              | `boolean`       | `false`    |
| errorMessage| Define uma mensagem de erro caso a validação falhe         | `boolean`       | `false`    |
| errorColor  | Cor do Texto da Mensagem de Erro                           | `string` (hex)  | `#d5000`   |
| label       | Título da Caixa de Entrada                                 | `string`        | `undefined`|
| readable    | Possibilita esconder o texto de Entrada                    | `boolean`       | `false`    |
| type        | Tipo de texto de entrada (`password`/`text`)               | `string`        | `text`     |
| textColor   | Cor do Texto da Caixa de Entrada                           | `string` (hex)  | `'#4a4a4a'`|
| value       | Valor de padrão de entrada                                 | `string`        | `false`    |
| validation  | Adiciona um método de validação                            | `function`      | `undefined`|
| validateOn  | Define em que momento a validação ocorre (`input`/`submit`)| `string`        | `submit`   |