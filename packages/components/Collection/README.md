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

## Eventos

`<Row ... on:event="..."/>`

| Eventos     | Descrição                                                                                   | Tipo        |
|-------------|---------------------------------------------------------------------------------------------|-------------|
| click       | Especifique uma função que será chamada quando uma Row é clicada                            |`function()` |
| showExtra   | Especifique uma função que será chamada quando o conteúdo extra é exibido                   |`function()` |
| hideExtra   | Especifique uma função que será chamada quando quando o conteúdo extra é escondido          |`function()` |

#### Exemplos:

Quando o componente `Row` for clicado o roteador retorna para a página `home`.
```html
<Row on:click="root.router.go('/')" />
```

Quando o conteúdo em `extra` for exbidio digita no console a mensagem.
```html
<Row on:showExtra="console.log('extra extra')" />
```

Quando o conteúdo em `extra` for escondido, executa o método `myMethod()`.
```html
<Row on:click="myMethod()" />
```

## Slots

`<Row ... />`

| Slot        | Descrição                                                                                  |
|-------------|--------------------------------------------------------------------------------------------|
| controller  | Utilize o slot `controller` para adicionar um controlador customizado para sua `Row`        |
| extra       | Utilize o slot `extra` para adicionar conteúdo adicional após o contéudo da `Row`          |
| description | Utilize o slot `description` para adicionar uma descrição à `Row`                          |
