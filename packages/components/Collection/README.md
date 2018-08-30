# Collection

O módulo `Collection` é composto por dois componentes: `Collection` e `Row`, que juntos ajudam a organizar itens em listas.
`Collection` é um conjunto de `Row` de um assunto comum, semelhante a uma tabela com apenas uma coluna e diversas linhas.

<!-- @example ./example/Example.html -->

## Parâmetros

`<Collection ...props />`

| Parâmetro   | Descrição                         | Tipo               | Padrão        |
|-------------|-----------------------------------|--------------------|---------------|
| title       | Título da coleção                 | `string`           | `undefined`   |

`<Row ...props />`

| Parâmetro   | Descrição                         | Tipo               | Padrão        |
|-------------|-----------------------------------|--------------------|---------------|
| label        | Texto da linha  | `string`           | `''`   |
| href        | Link acionado quando a `<Row/>` é clicada  | `string`           | `undefined`   |
| showExtra   | Mostra o conteúdo extra           | `boolean`          | `false`       |
| shortcut    | Tecla de atalho para a ação da `<Row/>`: `0..9`,`enter`,`shortcuts`,`help` | `string` (keyname) | `undefined`   |
| description | Texto de descrição abaixo do título          | `string`           | `undefined`   |
