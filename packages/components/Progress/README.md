# Progress

O módulo `Progress` é composto por dois componentes: `ProgressBar` e `CircularProgress`. Ambos podem ser
utilizados para representar a execução de uma tarefa, que pode ter etapas definidas ou não.

`<ProgressBar ...props />`

| Propriedades | Descrição          | Tipo               | Padrão      |
| :----------- | :----------------- | :----------------- | :---------- |
| color        | Cor da barra       | `string` (hex)     | `#00A868`   |
| height       | Espessura da barra | `string` (px)      | `6px`       |
| progress     | Porcentagem atual  | `string` (0 a 100) | `undefined` |

`<CircularProgress ...props />`

| Propriedades | Descrição             | Tipo               | Padrão      |
| :----------- | :-------------------- | :----------------- | :---------- |
| color        | Cor do círculo        | `string` (hex)     | `#00A868`   |
| height       | Raio do círculo       | `string` (px)      | `25px`      |
| progress     | Porcentagem atual     | `string` (0 a 100) | `undefined` |
| speed        | Velocidade de rotação | `string` (0 a 10)  | `10`        |
