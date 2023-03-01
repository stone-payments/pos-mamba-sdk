# `@mamba/org`

O pacote `@mamba/org` contém métodos que aplicam as customizações específicas para cada organização.

## Image

O componente `Image` trata as imagens específicas de cada organização através da tag `img`.

| Propriedades | Descrição                  | Tipo       | Padrão      |
| ------------ | -------------------------- | ---------- | ----------- |
| fileName     | Nome da imagem             | `string`   | `null`      |
| class        | Classe CSS                 | `string`   | ``          |

## ORG

`import * as ORG from '@mamba/org/org.js';`

### `getAppOrgParams(defaultAppOrgParams: string)`

`ORG.getAppOrgParams()` faz o merge do arquivo json default do app com o arquivo fornecido pelo backend, substituindo o `value` de cada `key` se forem do mesmo tipo. Análogo ao `lodash.merge`, porém levemente diferente. Nessa implementação o merge substitui objetos do tipo Array, enquanto o lodash os mescla.

Caso o arquivo de configuração do backend não esteja acessível (arquivo não encontrado no POS ou execução no desktop), o arquivo default será usado.

```js
import { getAppOrgParams } from '@mamba/org/org.js';
import defaultAppOrgParams from './path/to/defaultAppOrgParamFile.json';

const finalAppOrgParamJsonFile = getAppOrgParams(defaultAppOrgParams);
```
