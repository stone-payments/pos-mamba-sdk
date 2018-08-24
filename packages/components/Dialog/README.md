# Dialog

O módulo `Dialog` é composto por 3 componentes: `Dialog`, `ConfirmationDialog` e `PromisedDialog`. Cada um desses componentes cria um modal próprio de tela cheia com suas especificações.
Por exemplo: O `PromisedDialog` é exibido durante a excução de uma `Promise` e após sua conclusão fecha o modal, já o `ConfirmationDialog` exibe uma tela com dois botões que controlam o fluxo da aplicação.
Para casos de apenas uma exibição de mensagem durante um período de tempo, o uso do `Dialog` é aconselhável.

<!-- @example ./example/Example.html -->

## Parâmetros

`<Dialog ...props />`

| Parâmetro   | Descrição                                              | Tipo            | Padrão     |
|-------------|--------------------------------------------------------|-----------------|------------|
| align       | Alinhamento vertical do conteúdo (`top`, `center`)     | `string`        | `center`   |
| bgColor     | Define a cor de fundo do modal                         | `string`        | `'#e3e3e3'`|
| textColor   | Define a cor do texto do modal                         | `boolean`       | `'#4a4a4a'`|
| title       | Título do modal                                        | `string`        | `undefined`|
| fullscreen  | Define se o modal ocupará a tela inteira               | `boolean`       | `false`    |

`<ConfirmationDialog ...props />`

| Parâmetro     | Descrição                                              | Tipo            | Padrão       |
|---------------|--------------------------------------------------------|-----------------|--------------|
| negativeLabel | Texto no Botão de Confirmação Negativa                 | `string`        | `'Cancelar'` |
| positiveLabel | Texto no Botão de Confirmação Positiva                 | `string`        | `'Confirmar'`|

`<PromisedDialog ...props />`

| Parâmetro   | Descrição                                               | Tipo            | Padrão     |
|-------------|---------------------------------------------------------|-----------------|------------|
| delay       | Tempo de espera depois de executar a `Promise`          | `string`        | `'right'`  |
| promise     | A `Promise` a ser executada                             | `boolean`       | `false`    |

## Métodos

### open(duration)

Abre o `Dialog` e o mantém aberto pelo tempo especificado.

### close(delay)

Fecha o `Dialog` após o tempo especificado.
