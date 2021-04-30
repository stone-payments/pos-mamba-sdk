# Flatlist

O componente `Flatlist` serve para renderizar listas simples e básicas:


| Parâmetross  | Descrição                                                             | Tipo           | Padrão      |
| ------------ | --------------------------------------------------------------------- | -------------- | ----------- |
| renderIte    | Recbe o Component onde os items serão renderizados                    | `Component`    | `'right'`   |
| data         | Recebe um objeto com os itens que seram renderizados                  | `object`       | `nul`       |
| dataSection  | Recebe um objeto com os itens que seram renderizados em sessões        | `object`       | `nul`       |


## Eventos

`<Flatlist ... on:active="..." />`

| Eventos       | Disparado quando ...                                                              | Tipo              |
| ------------- | --------------------------------------------------------------------------------- | ----------------- |
| active        | Recebe os propriedades do item que esta ativo/selecionado                         | `function(event)` |

