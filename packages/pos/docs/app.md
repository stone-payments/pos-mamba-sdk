# App

## Descrição

A API Nativa `App` ajuda a administrar funções básicas de sua aplicação.

## Interface

```ts
interface Http {
  doClose: () => void;
  getAppKey: () => string;
  isRunningOnDevice: () => boolean;
}

```


### doClose()

Fecha a aplicação em andamento.

```js
import App from '@mamba/pos/api/app.js'

App.doClose()
```

### getAppKey()

Retorna a chave da aplicação em andamento.

```js
import App from '@mamba/pos/api/app.js'

App.getAppKey() // '124563'
```

### isRunningOnDevice()

Retorna verdadeiro caso a apliação esteja rodando no `POS`.


```js
import App from '@mamba/pos/api/app.js'

// at web browser
App.isRunningOnDevice() // false

// at the POS
App.isRunningOnDevice() // true
```
