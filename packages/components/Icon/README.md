# Icon

O módulo Icon possui dois componentes: `Icon` e `RoundIcon`. Ambos facilitam a criação de ícones com
imagens padrões já disponíveis em nossa SDK. Além das imagens, também é possível customizar o estilo
do ícone e utilizar uma imagem própria.


<div class="iframe-wrapper">
  <iframe src="https://bundlebrowser.mambaweb.now.sh/#!/icon"></iframe>
</div>

## Parâmetros

`<Icon ...props/>`

| Parâmetro | Descrição                                            | Tipo            | Padrão    |
| :-------- | :--------------------------------------------------- | :-------------- | :-------- |
| color     | Pinta o ícone de acordo com a cor                   | `string` (hex)    | `#353E4B`  |
| size      | Tamanho do ícone (`normal`, `large`, `giant`)             | `string`          | `normal` |
| symbol    | Nome do ícone                                       | `string`          | `6px`     |
| level     | Pinta o ícone de acordo com o level (apenas wifi)   | `int` (0..3)      | `undefined` |

`<RoundIcon ...props/>`

| Parâmetro | Descrição                                      | Tipo         | Padrão     |
| :-------- | :--------------------------------------------- | :---------   | :--------- |
| bgColor   | Cor de fundo do círculo                          | `string` (hex) | `#00A868`  |
| borderRadius | Permite editar o `border-radius` do componente                                 | `string` (%) | `50%`  |
| color     | Cor do ícone                                 | `string` (hex) | `#ffffff`  |
| size      | Tamanho do ícone (`normal`, `large`, `giant`)   | `string`       | `normal`   |
