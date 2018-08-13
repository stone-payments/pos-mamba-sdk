# Http

## Descrição

Esta API Nativa auxilia à realizar pedidos `Http` de `GET` e `POST`, podendo optar por utilizar um proxy ou não.

## Interface

```ts
interface Http {
  send: (connectionOptions) => Promise
}

interface connectionOptions {
  url:string;
  method: string;
  data: string;
  headers: HeaderOptios;
  connect: string
}
```

### send()

Retorna uma `Promise` que espera pelo resultado do request. Para isso, a função recebe as especificações do request por meio de um objeto. Observe que neste objeto existe o parâmetro `connect` que especifica o tipo de conexão, que pode ser `LAN`(via proxy) ou `NET`(direto). Além deste, há também o method que pode ser `GET` ou `POST`, além dos outros parâmetros já conhecidos.

```js
import Http from '@mambasdk/api/http.js'

const myRequest = {
  url: "http://myapi.com/",
  headers:{
        "Content-Type": "application/json;charset=UTF-8",
        "Cache-Control": "no-cache",
        "authorization": "CDBDE4E6DC4E6AC1845606D0720BAFA557FA046347876CAA3986872AC1123852",
  },
  method: "GET",
  data: JSON.stringify({title:"Test", body:"This is a Test."}),
  connect: "LAN",
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