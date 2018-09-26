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

Sempre que um evento `close` é disparado no [componente raiz](https://svelte.technology/guide#component-root) (através de algo como `this.root.fire('close')`), o fluxo de fechamento do aplicativo é iniciado.

Por padrão, quando o usuário clicar no botão `close`/`x` o fluxo se inicia automaticamente. Entretanto, é possível sobrescrever este comportamento através de um método `onClose` no [componente raiz](https://svelte.technology/guide#component-root) de seu aplicativo. Deste modo, é possível customizar o fluxo de fechamento, adicionando uma tela, um diálogo, algum tipo de lógica, etc.

### Meta informações

Através do disparo de eventos no [componente raiz](https://svelte.technology/guide#component-root), o `App` controla meta informações de estado e fluxos do aplicativo:

#### Navegação da `AppBar` e da tecla de `back`:

`this.root.fire('navigation', boolean | { home, back })`;

O evento `navigation` habilita/desabilita a navegação do app. Passa-se um parâmetro *booleano* ou um objeto composto por `back` e/ou `home` com um valor *booleano*.

#### Atalhos de tecla automáticos (`shortcut="nomeDaTecla"`):

`this.root.fire('shortcuts', boolean)`;

O evento `shortcuts` habilita/desabilita os atalhos automáticos de teclado. Passa-se um parâmetro *booleano*.

## Sub componentes

### Keystroke

`import Keystroke from '@mamba/app/Keystroke.html';`

O componente `Keystroke` associa um evento de tecla á uma tecla específica e o desassocia automaticamente quando é destruído. Quando a tecla é apertada, o componente dispara um evento de `keystroke`.

É importante ressaltar que, enquanto algum `<Keystroke/>` estiver associado a uma tecla e `ativo`, nenhum atalho de teclado automático (`shortcut="nomeDaTecla"`) desta tecla estará ativo.

#### Parâmetros

`<Keystroke ...props on:keystroke="..."/>`

| Parâmetro   | Descrição                                              | Tipo            | Padrão     |
|-------------|--------------------------------------------------------|-----------------|------------|
| key          | Define a tecla associada ao handler                   | `string`        | `null`     |
| active       | Define ser o handler deve estar ativo ou não           | `boolean`      | `true`     |
