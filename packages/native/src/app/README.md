# App

## Descrição

O módulo App da API Nativa é responsável por ceder métodos de controle e informações sobre sua aplicação.

## Exemplos

### doClose()
Fecha a aplicação caso esteja no POS, imprime no registro do console do navegador a mesagem: [@mamba/native/app] App closed

```javascript
import {App} from Native

app.doClose()
// aplicação fecha no POS
// ou
// no browser um console.log() indica a ação.

```

### getAppKey()
Retorna a App key do aplicativo em execução.

```javascript
import {App} from Native

const appKey = App.getAppKey()
console.log(`appKey: ${appKey}`)
// output:
// appKey: 123456
```

### isRunningOnDevice()
Informa se a aplicação está sendo executada no ambiente do POS ou navegador.

```javascript

import {App} from Native

App.isRunningOnDevice() ? console.log('Estou no POS') : console.log('Estou no Browser')
// output:
// Estou no POS
// ou
// output:
// Estou no Browser

```

## Métodos

```ts
interface App {
  doClose: () => void
  getAppKey: () => string
  isRunningOnDevice: () => boolean
}
```