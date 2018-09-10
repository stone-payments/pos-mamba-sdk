# Http

## Descrição

Esta API Nativa auxilia a realizar pedidos `Http` de `GET` e `POST`, podendo optar por utilizar um proxy(necessário para realizar requisições GPRS) ou não.

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
  connect: string
}
```

### send(connectionOptions)

Recebe as especificações do request por meio de um objeto e retorna uma [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) que espera pelo seu resultado. Observe que nesse objeto existe o parâmetro `connect`, que especifica o tipo de canal utilizado, e pode ser `LAN`(direto) ou `NET`(via proxy). Também existe o parâmetro `method`, que define o verbo http, e suporta apenas `GET` ou `POST`.

```js
import Http from '@mambasdk/pos/api/http.js'

const myRequest = {
  url: "http://myapi.com/",
  headers:{
        "Content-Type": "application/json;charset=UTF-8",
        "Cache-Control": "no-cache",
        "authorization": "CDBDE4E6DC4E6AC1845606D0720BAFA557FA046347876CAA3986872AC1123852",
  },
  method: "GET",
  data: JSON.stringify({title:"Test", body:"This is a Test."}),
  connect: "NET",
}


Http.send(myRequest).then((result)=> {
  // in case the request have no errors
  console.log(result)
})
.catch((error) => {
  // if the request fails
  console.log(error)
});

```
