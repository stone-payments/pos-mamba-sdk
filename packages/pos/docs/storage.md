# Storage

## Descrição

A API Nativa de storage permite salvar informações, representáveis em **string**, persistentes da sua aplicação, que podem ser recuperadas mesmo após o POS ser reiniciado.

## Interface

```ts
interface Storage {
  setItem: (key: string, value: any) => boolean
  getItem: (key: string) => any
  clear: () => boolean
}
```

### set(key, value)

Salva uma informação com uma estrutura de chave e valor (key : value), ou seja, é possível criar uma chave única e associá-la a um tipo de informação que deseja persistir no POS.

```js
import Storage from '@mamba/pos/api/storage.js'

const myData = [
  {
    name: 'Pedro',
    age: 25,
  },
  {
    name: 'Marina',
    age: 22,
  },
]

Storage.setItem('users', myData)
```

### get(key)

Retorna o valor armazenado na chave passada para o método.

```js
import Storage from '@mamba/pos/api/storage.js'

const myData = [
  {
    name: 'Pedro',
    age: 25,
  },
  {
    name: 'Marina',
    age: 22,
  },
]

Storage.setItem('users', myData)

const savedData = Storage.getItem('users')

savedData[0].name // Pedro
savedData[1].age // 22
```

### clear()

Limpa todos os dados armazenados pela aplicação.

```js
import Storage from '@mamba/pos/api/storage.js'

const myData = 'dados importantes'

Storage.setItem('data', myData)
Storage.getItem('data') // 'dados importantes'

Storage.clear()
Storage.getItem('data') // ''
```
