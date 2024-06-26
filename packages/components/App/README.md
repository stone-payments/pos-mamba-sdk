# App

O componente `<App>` é responsável por encapsular toda a aplicação. Sem ele a aplicação perderá algumas funcionalidades básicas, o que o torna **obrigatório**.

Vale ressaltar também, que este componente não deve ser utilizado em nenhum outro lugar da aplicação além do ponto de entrada.
<br/>
<br/>

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
    },
  };
</script>
```

### Controle de atalhos do teclado

O `POS` possúi uma porção de teclas que podem ser utilizadas como atalhos de clique. Para designer uma tecla a certo evento de `click`, basta atribuir `shortcut="nomeDaTecla"` a algum elemento.

As teclas existentes no `POS` são: `close`, `back`, `enter`, `help`, `shortcuts`, `0`, `1`, `...`, `8`, `9`.

### Fluxo de fechamento do app

Sempre que executado o método `this.root.close()` do [componente raiz](https://svelte.technology/guide#component-root), o fluxo de fechamento do aplicativo é iniciado.

Por padrão, quando o usuário clicar no botão `close`/`x` o fluxo se inicia automaticamente. Caso, deseje que para fechar a aplicação a senha de administrador do `POS` seja informada, basta adicionar `askPasswordOnClose` no seu componente `App`.
<br/><br/>

```html
<App askPasswordOnClose>
  <!--
    Tudo relacionado ao aplicativo deve
    estar dentro do componente <App></App>
  -->
</App>
```

Entretanto, também é possível sobrescrever este comportamento através de um método `onClose` no [componente raiz](https://svelte.technology/guide#component-root) de seu aplicativo. Deste modo, é possível customizar o fluxo de fechamento da sua maneira, adicionando uma tela, um diálogo, algum tipo de lógica, etc.

<br/>

---

### Meta informações

O componente `<App/>` se registra como a propriedade `meta` no [componente raiz](https://svelte.technology/guide#component-root). Possibilitando o acesso meta informações de estado e fluxos do aplicativo:
<br/>
<br/>

- Navegação da `AppBar` e da tecla de `back`:

  Habilita/desabilita a navegação do app. Passa-se um objeto composto por `back` e `home` com um valor _booleano_ ou um valor _booleano_ único que será usado para ambos os casos.

  ```js
  this.root.meta.setNavigable({ home: boolean, back: boolean } | boolean);
  ```

- Esconde/mostra o `AppBar`. Passa-se um valor _booleano_:

  ```js
  this.root.meta.hideAppBar(boolean);
  ```

- Navegação da `AppBar` no botão de voltar com rota customizada e passagem de parâmetros:

  Customiza a rota quando for clicado no botão de voltar no `AppBar`. Passa-se um objeto composto por `route` e `params`, a propriedade `route` é obrigatória e precisa receber uma _string_, a propriedade `params` é opcional e o valor precisa ser um _object_.

  ```js
  this.root.meta.setNavigableRoute('/', { name: 'Mamba' });
  ```

- Atalhos de tecla automáticos `shortcut="nomeDaTecla"`

  Habilita/desabilita os atalhos automáticos de teclado. Passa-se um parâmetro _booleano_.

  ```js
  this.root.meta.setShortcuts(boolean);
  ```

- Bloqueio de _scroll_. Habilita/desabilita o _scroll_ do app.

  ```js
  this.root.meta.setScrollable(boolean);
  ```

## Sub componentes

### Keystroke

<br/>

O componente `Keystroke` associa um evento de tecla á uma tecla específica e o desassocia automaticamente quando é destruído. Quando a tecla é apertada, o componente dispara um evento de `keystroke`.

É importante ressaltar que, enquanto algum `<Keystroke/>` estiver associado a uma tecla e `ativo`, nenhum atalho de teclado automático (`shortcut="nomeDaTecla"`) desta tecla estará ativo.

<br/>

#### Uso

```html
<Keystroke key="back" on:keystroke="this.root.router.go('/')" />

<script>
  export default {
    components: {
      Keystroke: '@mamba/app/Keystroke.html',
    },
  };
</script>
```

`<Keystroke ...props/>`

| Propriedades | Descrição                                    | Tipo      | Padrão |
| ------------ | -------------------------------------------- | --------- | ------ |
| key          | Define a tecla associada ao handler          | `string`  | `null` |
| active       | Define ser o handler deve estar ativo ou não | `boolean` | `true` |

## Eventos

`<Keystroke ... on:event="..."/>`

| Eventos   | Disparado quando ...                | Tipo                                                                           |
| --------- | ----------------------------------- | ------------------------------------------------------------------------------ |
| keystroke | Uma das teclas do POS é pressionada | `function`([keyup](https://developer.mozilla.org/pt-BR/docs/Web/Events/keyup)) |

#### Exemplos:

Chama `myMethod(keyup)` passando como parâmetro o evento de keyup quando a tecla especificada em `key` é pressionada.

```html
<Keystroke key="back" on:keystroke="myMethod(event)" />
```
