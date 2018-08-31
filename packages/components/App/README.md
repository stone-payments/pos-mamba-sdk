# App

## Descrição

O componente App é responsável por encapsular toda a aplicação. Sem ele a aplicação perderá algumas funcionalidades básicas, o que o torna **obrigatório**.
Por esse motivo, ele já está incluso no template disponibilizado no início do desenvolvimento. Vale ressaltar também, que este componente não deve ser utilizado em nenhum outro lugar da aplicação além do ponto de entrada.

## Sub componentes

### Keystroke

`import { Keystroke } from '@mamba/app';`

O componente `Keystroke` associa um evento de tecla á uma tecla específica e o desassocia automaticamente quando é destruído. Quando a tecla é apertada, o componente dispara um evento de `keystroke`.

#### Parâmetros

`<Keystroke ...props on:keystroke="..."/>`

| Parâmetro   | Descrição                                              | Tipo            | Padrão     |
|-------------|--------------------------------------------------------|-----------------|------------|
| key          | Define a tecla associada ao handler                   | `string`        | `'#e3e3e3'`|
| active       | Define ser o handler deve estar ativo ou não           | `boolean`      | `false`    |