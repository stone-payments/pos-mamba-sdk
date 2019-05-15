# Http

## Descrição

Esta API Nativa auxilia a realizar pedidos `Http` de `GET` e `POST`, `PUT` e `DELETE`, podendo optar por utilizar um proxy(necessário para realizar requisições `GPRS`) ou não.

## Interface

```ts
interface Http {
  send: (connectionOptions) => Promise
}

interface connectionOptions {
  url: string;
  method: string;
  data: string;
  headers: HeaderOptions;
  proxy: boolean;
  encodeURI: boolean;
}
```

### send(connectionOptions)

Recebe as especificações do request por meio de um objeto e retorna uma [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) que espera pelo seu resultado. Observe que nesse objeto existe alguns parâmetros.

- `method`, que define o verbo http, e suporta apenas `GET` ou `POST`.
- `proxy`, que específica o tipo de canal utilizado, e pode ser `false`(direto), `true`(via proxy). Por padrão é `false` desabilitando o uso do proxy, não sendo possível fazer requisições por `GPRS`.

```js
import Http from '@mamba/pos/api/http.js'

const myRequest = {
  url: 'http://myapi.com/',
  headers:{
        'Content-Type':'application/json;charset=UTF-8',
        'Cache-Control':'no-cache',
        'Authorization':'CDBDE4E6DC4E6AC1845606D0720BAFA557FA046347876CAA3986872AC1123852'
  },
  method: 'GET',
  data: {title:'Test', body:'This is a Test.'},
  proxy: true
}


Http.send(myRequest).then((result)=> {
  // in case the request have no errors
  console.log(result.status)
  console.log(result.body)

})
.catch((error) => {
  // if the request fails
  console.log(error.status)
  console.log(error.msg)
});

```
