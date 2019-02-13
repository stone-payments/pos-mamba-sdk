# Tabs

O módulo `Tabs` é responsável por exibir uma lista de abas, possibilitando a troca de conteúdo de acordo com a sua seleção.

### TabPane

O `TabPane` é um wrapper sem funcionalidades, gerenciado pelo seu componente pai `Tabs`.
Os items da `Tabs` são renderizados na ordem em que os `TabPane` são declarados.


O atributo `title` será usado como label no item da aba.
Omitir o attributo `title`, resulta a aba e seu contúdo correspondente não ser exibido.

<!-- @example ./example/Example.html -->

## Parâmetros

`<TabPane ...props />`

| Parâmetro   | Descrição                         | Tipo               | Padrão        |
|-------------|-----------------------------------|--------------------|---------------|
| title       | Título a ser utilizado para criar o item na navegação de abas        | `string`           | `undefined`   |

## Eventos

`<Tabs ... on:event="..."/>`

| Eventos     | Disparado quando ...           | Tipo        |
|-------------|--------------------------------|-------------|
| change      | Especifique uma função que será chamada quando trocar de aba. Recebe índice atual e antigo.  |`function({ currentIndex, lastIndex })` |