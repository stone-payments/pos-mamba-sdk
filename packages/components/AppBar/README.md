# AppBar

O módulo `AppBar` é composto por dois componentes: `AppBar` e `AppBarTitle`. Ambos servem para o controle e estilo da AppBar da aplicação.

<!-- @example ./example/Example.html -->

## Parâmetros

<AppBar ...props/>

| Parâmetro | Descrição           | Tipo            | Padrão    |
|-----------|---------------------|-----------------|-----------|
| title     | Título da AppBar    | `string`          | `''`        |
| textColor | Cor do Título       | `string` (hex)    | `'#fff'`    |
| bgColor   | Cor de Fundo da AppbBar| `string` (hex) | `'#4ebf1a'` |


<AppBarTitle ...props/>

| Parâmetro | Descrição                    | Tipo            | Padrão    |
|-----------|------------------------------|-----------------|-----------|
| title     | Altera o título da AppBar    | `string`        | `''`      |
