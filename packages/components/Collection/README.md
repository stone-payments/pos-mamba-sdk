# Collection

O módulo `Collection` é composto de dois componentes: `Collection` e `Row` que juntos, ajudam a organizar itens em listas.


<!-- @example ./example/Example.html -->

## Parâmetros

<Collection ...props />

| Parâmetro   | Descrição                         | Tipo               | Padrão        |
|-------------|-----------------------------------|--------------------|---------------|
| title       | Título da coleção.                | `string`           | `undefined`   |


<Row ...props />

| Parâmetro   | Descrição                         | Tipo               | Padrão        |
|-------------|-----------------------------------|--------------------|---------------|
| href        | Link acionado quando clicado.     | `string`           | `undefined`   |
| showExtra   | Mostra o conteúdo extra.          | `boolean`          | `false`       |
| shortcut    | Atalho para click.                | `string` (keycode) | `undefined`   |
| description | Texto Descrição na Linha.         | `string`           | `undefined`   |