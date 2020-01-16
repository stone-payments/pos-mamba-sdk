# Tabs

O módulo `Tabs` é responsável por exibir uma lista de abas, possibilitando a troca de conteúdo de acordo com a sua seleção.

Usar o modo de funcionamento `route` do parâmetro `changeOn`, faz com que a troca das abas seja feita pela rota da aplicação. Isso é útil para lembrar a posição do índice da aba para rotas internas, e voltar na história do navegador, ou para quando você quiser entrar um uma página exibindo um índice específico.

## Como utilizar

```js
import Tabs from '@mamba/tabs/Tabs.html';
import TabPane from '@mamba/tabs/TabPane.html';

...

<Tabs>
  <TabPane label="Tab 1">Your content</TabPane>
  <TabPane label="Tab 2">Another content</TabPane>
  ...
</Tabs>
```

## TabPane

O `TabPane` é um wrapper sem funcionalidades, gerenciado pelo seu componente pai `Tabs`. Os items da `Tabs` são renderizados na ordem em que os `TabPane` são declarados.
<br/><br/>
O atributo `label` será usado como label no item da aba.
Omitir o attributo `label`, resulta a aba e seu contúdo correspondente não ser exibido.
Para que o parâmetro `route` funcionar corretamente, é necessário que o caminho da aba seja completo e absoluto, incluindo a rota do pai.

<!-- @example ./example/Example.html -->
<div class="iframe-wrapper">
  <iframe src="http://bundlebrowser.didiraja.now.sh/#!/tabs"></iframe>
</div>

## Parâmetros

`<Tabs ...props />`

| Parâmetro | Descrição                                                            | Tipo     | Padrão  |
| --------- | -------------------------------------------------------------------- | -------- | ------- |
| changeOn  | Define qual o modo de funcionamento das abas: por `state` ou `route` | `string` | `state` |

`<TabPane ...props />`

| Parâmetro | Descrição                                                                   | Tipo     | Padrão      |
| --------- | --------------------------------------------------------------------------- | -------- | ----------- |
| label     | Título a ser utilizado para criar o item na navegação de abas               | `string` | `undefined` |
| route     | Rota da aba para ser usada com modo de troca por `route` do modo `changeOn` | `string` | `undefined` |

## Eventos

`<Tabs ... on:event="..."/>`

| Eventos | Disparado quando ...                                                                        | Tipo                                    |
| ------- | ------------------------------------------------------------------------------------------- | --------------------------------------- |
| change  | Especifique uma função que será chamada quando trocar de aba. Recebe índice atual e antigo. | `function({ currentIndex, lastIndex })` |
