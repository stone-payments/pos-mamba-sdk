# Button

O Componente `Button` permite de modo fácil criar botões seguindo um estilo padrão com diversas opções
de customização, podendo até mesmo englobar um outro componente, como pode ser visto nos exemplos abaixo.
Além disso, os botões também podem ser acionados por um shortcut e executar métodos por este atalho ou quando clicados.


| Parâmetros      | Descrição                              | Tipo              | Padrão      |
| :------------- | :------------------------------------- | :---------------- | :---------- |
| bottom         | Fixa o botão na parte inferior da tela | `boolean`         | `false`     |
| disabled       | Desabilita o botão                     | `boolean`         | `false`     |
| secondary      | Habilita o estilo de botão secundário  | `boolean`         | `false`     |
| size           | Tamanho do botão (opções: `small`, `normal`, `fill`, `full`)       | `string` | `normal`|
| bgColor   | Cor primária do botão                  | `string` (hex)    | `''`        |
| textColor      | Cor do texto no botão                  | `string` (hex)    | `''`        |

## Métodos

### click()

Aciona o evento de clique do botão.

### focus()

Coloca o foco no botão.
