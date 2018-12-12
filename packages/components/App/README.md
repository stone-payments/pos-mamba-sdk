# App

`import App from '@mamba';`

## Descrição

O componente `<App>` é responsável por encapsular toda a aplicação. Sem ele a aplicação perderá algumas funcionalidades básicas, o que o torna **obrigatório**.

Vale ressaltar também, que este componente não deve ser utilizado em nenhum outro lugar da aplicação além do ponto de entrada.

```html
<App>
  <!--
    Tudo relacionado ao aplicativo deve
    estar dentro do componente <App></App>
  -->
</App>

<script>
  export default {
    components: {
      App: '@mamba/app',
    }
  }
</script>
```

### Controle de atalhos do teclado

O `POS` possúi uma porção de teclas que podem ser utilizadas como atalhos de clique. Para designer uma tecla a certo evento de `click`, basta atribuir `shortcut="nomeDaTecla"` a algum elemento.

As teclas existentes no `POS` são: `close`, `back`, `enter`, `help`, `shortcuts`, `0`, `1`, `...`, `8`, `9`.

### Fluxo de fechamento do app

Sempre que executado o método `this.root.close()` do [componente raiz](https://svelte.technology/guide#component-root), o fluxo de fechamento do aplicativo é iniciado.

Por padrão, quando o usuário clicar no botão `close`/`x` o fluxo se inicia automaticamente. Entretanto, é possível sobrescrever este comportamento através de um método `onClose` no [componente raiz](https://svelte.technology/guide#component-root) de seu aplicativo. Deste modo, é possível customizar o fluxo de fechamento, adicionando uma tela, um diálogo, algum tipo de lógica, etc.

### Meta informações

O componente `<App/>` se registra como a propriedade `meta` no [componente raiz](https://svelte.technology/guide#component-root). Possibilitando o acesso meta informações de estado e fluxos do aplicativo:

#### Navegação da `AppBar` e da tecla de `back`

`this.root.meta.setNavigable({ home: boolean, back: boolean } | boolean)`

Habilita/desabilita a navegação do app. Passa-se um objeto composto por `back` e `home` com um valor *booleano* ou um valor *booleano* único que será usado para ambos os casos.

#### Atalhos de tecla automáticos (`shortcut="nomeDaTecla"`)

`this.root.meta.setShortcuts(boolean)`;

Habilita/desabilita os atalhos automáticos de teclado. Passa-se um parâmetro *booleano*.

#### Bloqueio de *scroll*

`this.root.meta.setScrollable(boolean)`;

Habilita/desabilita o *scroll* do app.

## Sub componentes

### Keystroke

`import Keystroke from '@mamba/app/Keystroke.html';`

O componente `Keystroke` associa um evento de tecla á uma tecla específica e o desassocia automaticamente quando é destruído. Quando a tecla é apertada, o componente dispara um evento de `keystroke`.

É importante ressaltar que, enquanto algum `<Keystroke/>` estiver associado a uma tecla e `ativo`, nenhum atalho de teclado automático (`shortcut="nomeDaTecla"`) desta tecla estará ativo.

#### Parâmetros

`<Keystroke ...props/>`

| Parâmetro   | Descrição                                              | Tipo            | Padrão     |
|-------------|--------------------------------------------------------|-----------------|------------|
| key          | Define a tecla associada ao handler                   | `string`        | `null`     |
| active       | Define ser o handler deve estar ativo ou não           | `boolean`      | `true`     |

### Eventos

`<Keystroke ... on:event="..."/>`

| Eventos     | Descrição                                                                            | Tipo                                                                          |
|-------------|--------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| keystroke   | Especifique uma função que será chamada quando uma tecla é pressionada               |`function`([keyup](https://developer.mozilla.org/pt-BR/docs/Web/Events/keyup))  |

#### Exemplo:

Chama `myMethod(keyup)` passando como parâmetro o evento de keyup quando a tecla especificada em `key` é pressionada.
```html
<Keystroke key="back" on:keystroke="myMethod(keyup)" />
```