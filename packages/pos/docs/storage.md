# Storage

## Descrição

A API Nativa de storages permite salvar informações persistentes da sua Aplicação, que podem ser recuperadas mesmo após o POS ser reiniciado.

## Interface

```ts
interface Storage {
  set: (key: string, value: string) => boolean
  get: (key: string) => string
  clear: () => boolean
}
```

### set(key, value)

Salva uma informação com uma estrutura de chave e valor (key : value), ou seja, é possível criar uma chave única e associá-la a um tipo de informação que deseja persistir no POS.

```js
import Storage from '@mamba/pos/api/storage.js'

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

Storage.set('users', JSON.stringify(myData))
```

### get(key)

Retorna o valor armazenado na chave passada para o método.

```js
import Storage from '@mamba/pos/api/storage.js'

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

Storage.set('users', JSON.stringify(myData))

const savedData = Storage.get('users')

savedData[0].name // Pedro
savedData[1].idade // 22
```

### clear()

Limpa todos os dados armazenados pela aplicação.

```js
import Storage from '@mamba/pos/api/storage.js'

const myData = 'dados importantes'

Storage.set('data', myData)
Storage.get('data') // 'dados importantes'

Storage.clear()
Storage.get('data') // ''
```
