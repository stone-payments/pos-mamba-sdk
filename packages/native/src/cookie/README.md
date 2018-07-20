# Cookie

## Descrição
A API Nativa de cookies permite salvar informações persistentes de sua Aplicação, podendo ser recuperado mesmo após o POS ser reiniciado.

## Exemplo

### set()
Salva um cookie utilizando eo referencia por uma chave de acesso.

```javascript
  import {Cookie} from Native

  const myData = [{nome:'Pedro', idade:25}, {nome: 'Marina', idade: 22}]
  Cookie.set('users', JSON.stringify(myData))
```

### get()
Retorna o valor armazenado na chave passada para o método.

```javascript
  import {Cookie} from Native
  const myData = [{nome:'Pedro', idade:25}, {nome: 'Marina', idade: 22}]
  Cookie.set('users', JSON.stringify(myData))
  const savedData = Cookie.get('users')
  console.log(savedData[0].name)
  // output:
  // Pedro
  console.log(savedData[1].idade)
  // output:
  // 22
```

### clear()
Limpa todos os dados armazenados pela aplicação.

```javascript
  import {Cookie} from Native
  const myData = "dados importantes"
  Cookie.set('data')
  const savedData = Cookie.get('data')
  console.log(savedData)
  // output:
  // dados importantes
  Cookie.clean()
  const newSavedData = Cookie.get('data')
  console.log(newSavedData)
  // output:
  // undefined
```

## Métodos

```ts
class Cookie {
  set(key: string, value: string): true
  get(key: string): string
  clear(): true
}
```
