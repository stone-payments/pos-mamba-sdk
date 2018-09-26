# Button

O Componente `Button` permite de modo fácil criar botões seguindo um estilo padrão com diversas opções
de customização, podendo até mesmo englobar um outro componente, como pode ser visto nos exemplos abaixo.
Além disso, os botões também podem ser acionados por um shortcut e executar métodos por este atalho ou quando clicados.

<!-- @example ./example/Example.html-->

## Parâmetros

| Parâmetro      | Descrição                               | Tipo            | Padrão    |
| :------------- | :-------------------------------------- | :-------------- | :-------- |
| bgColor        | Cor do botão                           | `string` (hex)    | `#4ebf1a` |
| bottom         | Fixa o botão na parte inferior da tela | `boolean`         | `false`     |
| borderColor    | Cor da borda do botão                  | `string` (hex)    | `null`      |
| disable        | Desabilita o botão                     | `boolean`         | `false`     |
| size           | Tamanho do botão (opções: `small`, `regular`, `large`, `full`)   | `string` | `regular`|
| textColor      | Cor do texto no botão                  | `string` (hex)    | `#fff`    |

## Métodos

### click()

Aciona o evento de clique do botão.

### focus()

Coloca o foco no botão.
