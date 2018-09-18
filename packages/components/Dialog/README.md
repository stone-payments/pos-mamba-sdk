# Dialog

O módulo `Dialog` é composto por 3 componentes: `Dialog`, `ConfirmationDialog` e `PromisedDialog`. Cada um deles cria um modal próprio de tela cheia com suas especificações.
O `PromisedDialog` é exibido durante a execução de uma `Promise` e após sua conclusão fecha o modal. Já o `ConfirmationDialog` exibe uma tela com dois botões que controlam o fluxo da aplicação. Para casos de apenas uma exibição de mensagem durante um período de tempo, o uso do `Dialog` é aconselhável.

<!-- @example ./example/Example.html -->

## Parâmetros

`<Dialog ...props />`

| Parâmetro   | Descrição                                              | Tipo            | Padrão     |
|-------------|--------------------------------------------------------|-----------------|------------|
| align       | Alinhamento vertical do conteúdo (`top`, `center`)     | `string`        | `center`   |
| bgColor     | Define a cor de fundo do modal                         | `string`        | `'#e3e3e3'`|
| textColor   | Define a cor do texto do modal                         | `boolean`       | `'#4a4a4a'`|
| isOpen      | Define se o modal vai estar aberto por padrão          | `boolean`       | `'false'`  |
| title       | Título do modal                                        | `string`        | `undefined`|
| fullscreen  | Define se o modal ocupará a tela inteira               | `boolean`       | `false`    |

`<ConfirmationDialog ...props />`

| Parâmetro     | Descrição                                              | Tipo            | Padrão       |
|---------------|--------------------------------------------------------|-----------------|--------------|
| negativeLabel | Texto no Botão de Confirmação Negativa                 | `string`        | `'Cancelar'` |
| positiveLabel | Texto no Botão de Confirmação Positiva                 | `string`        | `'Confirmar'`|
| isOpen        | Define se o modal vai estar aberto por padrão          | `boolean`       | `'false'`    |
| title         | Título do modal                                        | `string`        | `undefined`  |

`<PromisedDialog ...props />`

| Parâmetro   | Descrição                                               | Tipo            | Padrão     |
|-------------|---------------------------------------------------------|-----------------|------------|
| delay       | Tempo de espera depois de executar a `Promise`          | `string`        | `'right'`  |
| promise     | A `Promise` a ser executada                             | `boolean`       | `false`    |
| isOpen      | Define se o modal vai estar aberto por padrão           | `boolean`       | `'false'`  |
| title       | Título do modal                                         | `string`        | `undefined`|

## Eventos

`<ConfirmationDialog ...props />`

| Nome     | Descrição                                                 |
|----------|-----------------------------------------------------------|
| nagative | Selecionando sair do dialogo ou botão vermelho do teclado |
| positive | Selecionando aceitar do dialogo ou botão verde do teclado |

## Métodos

### open(duration)

Abre o `Dialog` e o mantém aberto pelo tempo (`duration` em milissegundos) especificado.

### close(delay)

Fecha o `Dialog` após o tempo (`delay` em milissegundos) especificado.
