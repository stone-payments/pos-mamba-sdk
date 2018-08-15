# Progress

O módulo `Progress` é composto por dois componentes: `ProgressBar` e `CircleProgress`. Ambos podem ser
utilizados para representar a execução de um tarefa com etapas definidas ou não.

<!-- @example ./example/Example.Html -->

## Parâmetros

`<ProgressBar ...props />`

| Parâmetro | Descrição           | Tipo            | Padrão    |
| :-------- | :------------------ | :-------------- | :-------- |
| color     | Cor da barra        | `string` (hex)    | `#6ebf1a` |
| height    | Espessura da barra  | `string` (px)     | `6px`     |
| progress  | Porcentagem atual   | `string` (0 a 100)| `undefined` |

`<ProgressCircle ...props />`

| Parâmetro | Descrição               | Tipo            | Padrão     |
| :-------- | :---------------------- | :-------------- | :--------- |
| color     | Cor do círculo          | `string` (hex)    | `#6ebf1a`  |
| height    | Raio do círculo         | `string` (px)     | `25px`     |
| progress  | Porcentagem atual       | `string` (0 a 100)| `undefined`  |
| speed     | Velocidade de rotação   | `string` (0 a 10) | `10`       |
