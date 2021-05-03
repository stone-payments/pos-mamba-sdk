# Flatlist

O componente `Flatlist` serve para renderizar listas simples e básicas com utilização de setas(UP / DOWN) do teclado e touch.


| Parâmetros   | Descrição                                                             | Tipo           | Padrão      |
| ------------ | --------------------------------------------------------------------- | -------------- | ----------- |
| renderItem   | Recebe o Component onde os items serão renderizados                    | `Component`    | `null`          |
| renderTitle  | Define um component para ser usado Título das seções. Caso seja omitido, sera renderizado um título padrão  | `Component` | `null`          |
| data         | Recebe um objeto com os itens que seram renderizados                  | `object`       | `null`       |
| dataSection  | Recebe um objeto com os itens que seram renderizados em sessões       | `object`       | `null`       |
| className    | Classe a ser adicionado ao elemento pai do componente	               | `string`       | ``          |
| separator    | Define um separador para as seções. Caso seja omitido, sera renderizado o separador padrão | `Component`    | `null`   |
| intersectSelectedEvents | Previne chamadas iguais de eventos: `itemSelected` ∩ `onSelected`           | `boolean`      | `false`     |
| itemHandler | Objeto ou componente que irá ser usado no parâmetro `this` quando o `onSelected` for um método de objeto | `function`      | `null`     |
| autoSelectOnTouch | Define se dispara a classe para realçar o item quando for selecionado por touch | `boolean` | `true` |


## Eventos

`<Flatlist ... on:active="..." />`

| Eventos       | Disparado quando ...                                                              | Tipo              |
| ------------- | --------------------------------------------------------------------------------- | ----------------- |
| itemActive    | Recebe os propriedades do item que esta ativo/selecionado                     | `function(event)` |
| itemSelected  | Recebe os propriedades do item que foi selecionado por click ou teclado     | `function(event)` |



## Passando Data:

Data é um `array` de objetos que irão compor os items da lista.
Todas as propriedades do objeto serão repassadas para o componente `renderItem` com exceção das propriedades `shortcut` e `onSelected`, na qual o <FlatList /> faz o uso para:

- O `shortcut` que você definir será usado para criar atalhos do teclado no component.
- O `onSelected` é usado como método para quando o item for selecionado.

```js
const data = [
  {
    label: 'Item 1',
    shortcut: 1, /* Ex: Tecla 1 irá tentar disparar `onSelected` e `itemSelected` */
    onSelected: (item) => {
      /*
      * Usando a propriedade `itemHandler` do Flatlist,
      * você pode chamar métodos de uma classe ou objeto diretamente.
      * `O `this` sera o `itemHandler` declarado no <FlatList />.
      */
      this.itemClickHandler(item);
    },
    otherProp: 'foo',
  },
  {
    label: 'Item 2',
    shortcut: 1,
    /*
    * Apenas referencia uma função.
    * O `this` será o script pai.
    * `itemHandler` não terá efeito.
    */
    onSelected: this.itemClickHandler,
    otherProp: 'foo',
  },
]
```

#### Múltiplas seções:

Útil para renderizar múltiplas listas com contextos diferentes.


```js
const dataSection = [
  {
    title: 'Título da seção',
    data: [ ... ]
  }
]
```

| Parâmetros   | Descrição                                                             | Tipo           |
| ------------ | --------------------------------------------------------------------- | -------------- |
| title        | É usada para renderizar um título antes da lista. A omissão dela faz com que nenhum título seja renderizado.                    | `string`    |
| data         | Array de objetos que irão compor os items da seção, como a declada acima | `array` |


#### Exemplo de `renderItem`:
```html
<!-- Item.html -->

<!-- <FlatList /> envia `isActive` para seu component, podendo ser udado para realçar o elemento selecionado -->
<div class:active="isActive">
  <!-- Recebe `label` do `data` -->
  {label}
</div>

```

