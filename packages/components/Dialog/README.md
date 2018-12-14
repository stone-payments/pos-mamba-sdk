# Dialog

O módulo `Dialog` é composto por 3 componentes: `Dialog`, `ConfirmationDialog` e `PromisedDialog`. Cada um deles cria um modal próprio de tela cheia com suas especificações.
O `PromisedDialog` é exibido durante a execução de uma `Promise` e após sua conclusão fecha o modal. Já o `ConfirmationDialog` exibe uma tela com dois botões que controlam o fluxo da aplicação. Para casos de apenas uma exibição de mensagem durante um período de tempo, o uso do `Dialog` é aconselhável.

<!-- @example ./example/Example.html -->

## Parâmetros

`<Dialog ...props />`

| Parâmetro   | Descrição                                              | Tipo            | Padrão     |
|-------------|--------------------------------------------------------|-----------------|------------|
| align       | Alinhamento vertical do conteúdo (`top`, `center`)     | `string`        | `center`   |
| bgColor     | Define a cor de fundo do modal                         | `string`        | `'#e3e3e3'`|
| textColor   | Define a cor do texto do modal                         | `boolean`       | `'#4a4a4a'`|
| isOpen      | Define se o modal vai estar aberto por padrão          | `boolean`       | `'false'`  |
| title       | Título do modal                                        | `string`        | `undefined`|
| fullscreen  | Define se o modal ocupará a tela inteira               | `boolean`       | `false`    |

`<ConfirmationDialog ...props />`

| Parâmetro     | Descrição                                              | Tipo            | Padrão       |
|---------------|--------------------------------------------------------|-----------------|--------------|
| negativeLabel | Texto no Botão de Confirmação Negativa                 | `string`        | `'Cancelar'` |
| positiveLabel | Texto no Botão de Confirmação Positiva                 | `string`        | `'Confirmar'`|
| isOpen        | Define se o modal vai estar aberto por padrão          | `boolean`       | `'false'`    |
| title         | Título do modal                                        | `string`        | `undefined`  |

`<PromisedDialog ...props />`

| Parâmetro   | Descrição                                               | Tipo            | Padrão     |
|-------------|---------------------------------------------------------|-----------------|------------|
| delay       | Tempo de espera depois de executar a `Promise`          | `string`        | `'right'`  |
| promise     | A `Promise` a ser executada                             | `boolean`       | `false`    |
| isOpen      | Define se o modal vai estar aberto por padrão           | `boolean`       | `'false'`  |
| title       | Título do modal                                         | `string`        | `undefined`|

## Eventos

`<Dialog ... on:event="..." />`

| Evento   | Disparado quando ...  | Tipo              |
|----------|-----------------------|-------------------|
| open     | O diálogo for exibido | `function()`      |
| close    | O diálogo fechar      | `function()`      |

#### Exemplos:

Chama `myMethod()` quando o diálogo for exibido.
```html
<Dialog on:open="myMethod()" />
```


Chama o `console.log` quando o diálogo fechar.
```html
<Dialog on:close="console.log('Dialog fechou')" />
```

---

`<PromisedDialog ... on:event="..." />`

| Evento   | Descrição                                                                                                                        | Tipo              |
|----------|----------------------------------------------------------------------------------------------------------------------------------|-------------------|
| success  | Especifique uma função que será chamada quando a Promise do diálogo for de sucesso(`.then`). Recebe o valor da `Promise.resolve` | `function(event)` |
| failure  | Especifique uma função que será chamada quando a Promise do diálogo for de falha(`.catch`). Recebe o valor da `Promise.reject`   | `function(event)` |

#### Exemplos:

Chama `console.log` quando a Promise for de sucesso.
```html
<PromisedDialog on:success="console.log('promise success', event)" />
```

Chama o método `promiseFailed` quando o Promise falhar.
```html
<PromisedDialog on:failure="promiseFailed(event)" />

...
  methods: {
    promiseFailed(event) {
      console.log(event)
    },
  }
...


```
---

`<ConfirmationDialog ... on:event="..." />`

| Evento   | Descrição                                                                                                        | Tipo         |
|----------|------------------------------------------------------------------------------------------------------------------|------------- |
| nagative | Especifique uma função que será chamada quando o diálogo receber a ação negativa ou do botão vermelho do teclado | `function()` |
| positive | Especifique uma função que será chamada quando o diálogo receber a ação positiva ou do botão verde do teclado    | `function()` |

#### Exemplos:

Chama `myMethod()` quando o diálogo receber ação positiva.
```html
<ConfirmationDialog on:positive="myMethod()" />
```


Chama o `console.log` quando o diálogo receber ação negativa.
```html
<ConfirmationDialog on:nagative="console.log('on:negative')" />
```


## Métodos

### Dialog.open(duration)

Abre o `Dialog` e o mantém aberto pelo tempo (`duration` em milissegundos) especificado.

### Dialog.close(delay)

Fecha o `Dialog` após o tempo (`delay` em milissegundos) especificado.


### ConfirmationDialog.open()

Abre o `ConfirmationDialog`.

### ConfirmationDialog.close()

Fecha o `ConfirmationDialog`.

## Slots

`<Dialog ... />`

| Slot   | Descrição                                                                                   |
|--------|---------------------------------------------------------------------------------------------|
| extra  | O slot `extra` pode ser usado para adicionar conteúdo adicional após a mensagem do diálogo. |

<br/>

Exemplo:

```html
<Dialog>
  Minha mensagem
  <slot name="extra">Conteúdo extra</slot>
</Dialog>
```


