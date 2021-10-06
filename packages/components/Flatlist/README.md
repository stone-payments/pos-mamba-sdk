# Flatlist

O componente `Flatlist` serve para renderizar listas simples e básicas com utilização de setas(UP / DOWN) do teclado e touch.


| Parâmetros   | Descrição                                                             | Tipo           | Padrão      |
| ------------ | --------------------------------------------------------------------- | -------------- | ----------- |
| renderItem   | Recebe o Component onde os items serão renderizados                    | `Component`    | `null`          |
| renderTitle  | Define um component para ser usado Título das seções. Caso seja omitido, sera renderizado um título padrão  | `Component` | `null`          |
| data         | Recebe um objeto com os itens que seram renderizados                  | `object`       | `null`       |
| dataSection  | Recebe um objeto com os itens que seram renderizados em sessões       | `object`       | `null`       |
| className    | Classe a ser adicionado ao elemento pai do componente	               | `string`       | ``          |
| style        | Define os estilos para o container pai do FlatList, podendo ser uma `string` ou um objeto de [propriedades CSS em JavaScript](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference#common_css_properties_reference)	               | `string` | `object`      | ``          |
| separator    | Define um separador para as seções. Caso seja omitido, sera renderizado o separador padrão | `Component`    | `null`   |
| showSeparator    | Define se deve mostrar o separador | `boolean`    | `true`   |
| intersectSelectedEvents | Previne chamadas iguais de eventos: `itemSelected` ∩ `onSelected`           | `boolean`      | `false`     |
| autoSelectOnTouch | Define se dispara a classe para realçar o item quando for selecionado por touch | `boolean` | `true` |
| autoShortcuts | Define se os shortcuts serão gerados automaticamente com base nos índices (max. 0-9)| `boolean` | `false` |
| decorator | Define um objeto padrão que irá para todos os items da listagem | `object` | `undefined` |
| decoratorOverrides | Define um objeto que irá sobrescrever a propriedade `decorator`. | `object` | `undefined` |
| overrideEnterKeystroke | Define se o FlatList sempre vai ter prioridade no evento de `enter` do teclado | `boolean` | `true` |
| disableEnterKeystroke | Define se o FlatList deve habilitar ou desabilitar o evento de `enter` | `boolean` | `false` |
| disabled | Permite desabilitar os eventos da FlatList e das Rows | `boolean` | `false` |
| selectedIndex | Define a linha que irá estar selecionada quando for criado a lista | `number` | `0` |

## Eventos

`<Flatlist ... on:active="itemActive(event)" on:selected="itemSelected(event)" />`

| Eventos       | Disparado quando ...                                                              | Tipo              |
| ------------- | --------------------------------------------------------------------------------- | ----------------- |
| active    | Recebe os propriedades do item que esta ativo/selecionado                     | `function(event)` |
| selected  | Recebe os propriedades do item que foi selecionado por click ou teclado     | `function(event)` |
| setup | Configura elemento que recebe entrada(input) como primeiro item para ser simulado como linha da lista. ⚠️ Este elemento precisa ser uma referência de um HTMLElement. Se o componente Svelte pai desse elemento DOM tiver a propriedade `autofocus`, também precisa ser retirado. O `setupFirstFocusable` retorna `true` ou `false` se obteve todos os requisitos. | ```function({ setupFirstFocusable: ({ element, forwardedRef = undefined }) => Boolean })``` |


## Exemplo de configuração do `on:setup`

Declarando um método `on:setup` no Flatlist e o Input que irá funcionar como linha da lista:
```html
<!-- Lembre-se de não setar a propriedade `autofocus`, senão terá um comportamento inadequado. -->
<MoneyInput ref:moneyInput />

<FlatList
  ...
  on:setup="setupFlatlist(event)"
/>
```

Exemplo de método:
```html
<script>
  export default {
    methods: {
      setupFlatlist({ setupFirstFocusable }) {
        const { refs: { moneyInput: element } = {} } = this;

        // Verificando se o componente pai esta renderizado
        if(element && element.refs && element.refs.amountInput) {

          // Desconstruindo o <input> da lista de referências do pai
          const { amountInput } = element.refs;

          // Chama a função
          setupFirstFocusable({
            element: amountInput,
            forwardedRef: 'input',
          });
        }
      },
    }
  }
</script>
```

## Passando Data:

Data é um `array` de objetos que irão compor os items da lista.
Todas as propriedades do objeto serão repassadas para o componente `renderItem` com exceção das propriedades `shortcut` e `onSelected`, na qual o <FlatList /> faz o uso para:

- O `shortcut` que você definir será usado para criar atalhos do teclado no component.
- O `onSelected` é usado como método para quando o item for selecionado.
- Outras propriedades serão passadas normalmente para o componente declarado no `renderItem`.

```js
const data = [
  {
    label: {
      value: 'Row 1',
    },
    shortcut: 1,
    onSelected: ({ sectionIndex, index, position, data } ) => {
      /*
      * In this case, this anonymous function can call this script methods
      */
      console.log(index, sectionIndex, position, data) // 0 0 1 {label: {…}, shortcut: 1, onSelected: ƒ}
    },
  },
  {
    label: {
      value: 'Row 2',
    },
    shortcut: 2,
  },
  false && { // Conditional item
    label: {
      value: 'Row 3',
    },
    shortcut: 3,
  },
]
```

#### Método `onSelect` da row:

##### Função anônima:

- A função anônima pode chamar qualquer método da página:
  ```js
  // FlatList data
  const data = [
    {
      shortcut: 1
      label: {
        value: 'My Row',
      },
      onSelected: (item) => {
        const { someProp } = this.get();

        this.itemHandler(item, someProp);
      },
    }
  ];
  ```

  ```js
  // ... Page methods
  methods: {
    itemHandler(item, someProp) {
      // ... do something with item and someProp
    },
  },
  ```

##### Executar um método que retorne uma função:

- Executando um método no `onSelect`, irá chamar a função desejada quando a lista for montada, possibilitando retornar uma função dinâmica.
  ```js
  // FlatList data
  const data = [
    {
      shortcut: 1
      label: {
        value: 'Choose your destiny',
      },
      onSelected: this.getSelectedHandler(),
    }
  ];
  ```

  ```js
  // ... Page methods
  methods: {
    getSelectedHandler() {
      if(myCondition) return (itemData) => {
        console.log('Condition function', itemData);
      };

      return (itemData) => {
        console.log('Default function', itemData);
      };
    },
  },
  ```

##### Referênciando um método da página:

- Você pode referenciar um método da página para ser usado no `onSelected`, mas o `this` de dentro do escopo da função referenciada, será a referência de seu objeto.
  ```js
  // FlatList data
  const data = [
    {
      shortcut: 1
      label: {
        value: 'Some row',
      },
      onSelected: this.itemHandler,
    }
  ];
  ```

  ```js
  // ... Page methods
  methods: {
    itemHandler() { // Without bind
      console.log(this) // { label: { value: 'Some row' }}, shortcut: 1, onSelected: function... }
    },
  },
  ```

- Para referenciar métodos do mesmo componente/página, quando executada de dentro do escopo da função, use `bind` na referência do `onSelect`:
  ```js
  // FlatList data
  const data = [
    {
      label: 'Item row',
      onSelected: this.itemHandler.bind(this),
    }
  ];
  ```

  ```js
  // ... Page methods
  methods: {
    anotherMethod() {
      // ...
    },
    itemHandler() { // With bind
      this.anotherMethod();
    },
  },
  ```

### Múltiplas seções:

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
| data         | Array de objetos que irão compor os items da seção. | `array` |


#### Exemplo de `renderItem`:
```html
<!-- Item.html -->

<!-- <FlatList /> envia `isActive` para seu component, podendo ser udado para realçar o elemento selecionado -->
<div class:active="isActive">
  <!-- Recebe `label` do `data`  -->
  {label}
</div>

<style>
  .active {
    background: #f00;
  }
</style>
```


## Item de lista padrão

O `FlatList` exporta um componente padrão para ser usado na propriedade `renderItem` dele:

Exemplo:
```html
<FlatList
  data={dataList}
  renderItem={DefaultRow}
  decorator={GetDefaultDecorator}
/>

<script>
  import { DefaultRow, FlatList, GetDefaultDecorator } from '@mamba/flatlist/index.js';
  export default {
    components: {
      FlatList,
    },
    helpers: {
      DefaultRow,
      GetDefaultDecorator,
    },
    data() {
      return {
        // Row items
        dataList: [],
      };
    },
  }
</script>
```

### Decoradores

Como decoradores define um objeto padrão que irá aplicar para todos os items da listagem sem a necessidade de colocar manualmente em cada objeto de sua lista, o FlatList exporta um decorador padrão, o  `GetDefaultDecorator`:


```js
import { GetDefaultDecorator } from '@mamba/flatlist/index.js';
```

`GetDefaultDecorator` é um objeto pré-definido que ja entrega os padrões de layout para cada modelo de POS.
- Se alguma lista tiver muitas variações do padrão, você pode definir seu prórpio `decorator`, ou se precisar alterar algum detalhe do padrão, use o `decoratorOverrides`.
- `decoratorOverrides` pode ser usado para sobrescrever alguma propriedade padrão para todas as linhas, ou por modelo de POS específico, como por exemplo, tirar os prefixos:

```html
<FlatList
  ...
  decorator={GetDefaultDecorator}
  decoratorOverrides={{
    prefix: null
  }}
/>
```
Por modelo:
```html
<FlatList
  ...
  decorator={GetDefaultDecorator}
  decoratorOverrides={{
    S920: {
      prefix: null
    }
  }}
/>
```

### Estrutura do `DefaultRow`

A estrutura do objeto que irá compor o array para o `DefaultRow` é diferente, tendo várias propriedades para customiza-lo:

```ts
type Alignment = 'start' | 'center' | 'end';

declare type Component = void;

interface ComponentView {
  // Fixture value
  value?: () => Component | any;

  /* If Value is component, set its props like:
   * props: {
   *   checked: true,
   * },
   */
  props?: object;

  /* If Value is component, set its events like:
   * on: {
   *   change: () => console.log('change'),
   * },
   */
  on?: object;
}

interface Fixture extends ComponentView {
  // Styles
  style?: object;
  wrapperStyle?: object;
  contentStyle?: object;
}

type SelectEvent = {
  data: DefaultRowProps;
  index: number;
  position: number;
  renderItemRefs: Component;
}

interface DefaultRowProps {
  // Action when selected with touch, keyboard action, or shortcut.
  onSelected?: (event: SelectEvent) => {};

  // The keyboard shortcut
  shortcut?: number | string;

  // Row top level style
  wrapperStyle?: object;

  // Row content container style (don't include and/start fixtures container)
  contentStyle?: object;

  // If row should highlighted or not
  highlightSelect?: boolean;

  // The highlight color
  highlightColor?: string;

  // If the row should have minimal spaces
  small?: boolean;

  // Whether the line should behave without internal spaces so that your children can fill it.
  fill?: boolean;

  // Vertical items align
  align?: Alignment;

  // Useful to put anything before the label
  startFixture?: Fixture;

  // If you dont want work with labels, you can inject your own main content in the row.
  customView?: ComponentView;

  // show or not chevron icon on all lines
  showChevron?: boolean;

  // Row labels
  label?: {
    value: string;
    description?: string;
    style?: object;

    // Anything immediate before label. Can be a function that will receive the row position
    prefix?: (position: number) => string | number;
    prefixStyle?: object;
  };

  rightLabel?: {
    value: string;
    description?: string;
    style?: object;

    // Anything immediate next to righLabel. Can be a function that will compute some value
    sufix?: () => string | number;
    sufixStyle?: object;
  };

  // Useful to put anything after the label or rightLabel block
  endFixture?: Fixture;
}

```
### Acesse as ref do `DefaultRow`

Utilize para acessa o elemento e ter acesso as suas funcionalidades, como `States` e `Funções` .

##### Exemplo:
```ts
interface DefaultRowProps = {
  // Action when selected with touch, keyboard action, or shortcut.
  onSelected: function(event) {
    const { endFixture } = event.renderItemRefs;
    endFixture.updateProps({
      checked: true,
    });
  },
}
```

### Estilos

O `DefaultRow` possúi propriedades de estilo para customizar suas partes como `style`, `wrapperStyle` e `contentStyle`. O valor delas é um objeto de [propriedades CSS em JavaScript](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference#common_css_properties_reference):

```js
{
  label: {
    value: 'Item',
  },
  style: {
    fontSize: '14px',
    borderBottomWidth: '2px',
  },
}
```
