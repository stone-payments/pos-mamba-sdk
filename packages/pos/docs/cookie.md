# Cookie

## Descrição

A API Nativa de cookies permite salvar informações persistentes de sua Aplicação, podendo ser recuperado mesmo após o POS ser reiniciado.

## Interface

```ts
interface Cookie {
  set: (key: string, value: string) => boolean
  get: (key: string) => string
  clear: () => boolean
}
```

### set()

Salva um cookie utilizando eo referencia por uma chave de acesso.

```js
import Cookie from '@mamba/pos/api/cookie.js'

const myData = [
  {
    nome: 'Pedro',
    idade: 25,
  },
  {
    nome: 'Marina',
    idade: 22,
  },
]

Cookie.set('users', JSON.stringify(myData))
```

### get()

Retorna o valor armazenado na chave passada para o método.

```js
import Cookie from '@mamba/pos/api/cookie.js'

const myData = [
  {
    nome: 'Pedro',
    idade: 25,
  },
  {
    nome: 'Marina',
    idade: 22,
  },
]

Cookie.set('users', JSON.stringify(myData))

const savedData = Cookie.get('users')

savedData[0].name // Pedro
savedData[1].idade // 22
```

### clear()

Limpa todos os dados armazenados pela aplicação.

```js
import Cookie from '@mamba/pos/api/cookie.js'

const myData = 'dados importantes'

Cookie.set('data', myData)
Cookie.get('data') // 'dados importantes'

Cookie.clear()
Cookie.get('data') // ''
```
