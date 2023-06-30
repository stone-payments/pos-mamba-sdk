# App

## Descrição

A API Nativa `App` ajuda a administrar funções básicas de sua aplicação.

## Interface

```ts
interface App {
  close: () => void;
  getAppKey: () => string;
  isRunningOnDevice: () => boolean;
  getVersion: () => string;
}

```


### close()

Fecha a aplicação em andamento.

```js
import App from '@mamba/pos/api/app.js'

App.close()
```

### getAppKey()

Retorna a chave da aplicação em andamento.

```js
import App from '@mamba/pos/api/app.js'

App.getAppKey() // '124563'
```

### getVersion()

Retorna a versão do seu aplicativo.

```js
import App from '@mamba/pos/api/app.js'

App.getVersion() // '1.0.0'
```

### isRunningOnDevice()

Retorna verdadeiro caso a aplicação esteja rodando no `POS`.


```js
import App from '@mamba/pos/api/app.js'

// at web browser
App.isRunningOnDevice() // false

// at the POS
App.isRunningOnDevice() // true
```
