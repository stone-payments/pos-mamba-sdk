# AppBar

O módulo `AppBar` é composto por dois componentes: `AppBar` e `AppBarModifier`. O `AppBar` é a barra que fica localizada no canto superior da aplicação, ela pode ser estilizada utilizando seus `props`. Caso queira alterar qualquer um desses props em outra página, isso pode ser feito através do `AppBarModifier`, sem a necessidade de criar outra `AppBar`.

## Parâmetros

`<AppBar ...props/>`

| Parâmetro | Descrição           | Tipo            | Padrão    |
|-----------|---------------------|-----------------|-----------|
| title     | Título da AppBar    | `string`          | `''`        |
| textColor | Cor do Título       | `string` (hex)    | `'#fff'`    |
| iconColor | Cor dos ícones       | `string` (hex)    | `'#fff'`    |
| bgColor   | Cor de Fundo da AppbBar| `string` (hex) | `'#00A868'` |
| border   | Mostra a borda abaixo da `AppBar` | `boolean` | `true` |
| borderColor   | Mostra a borda abaixo da `AppBar` | `string` | `#D5DEE8` |

`<AppBarModifier ...props/>`

| Parâmetro | Descrição                    | Tipo            | Padrão    |
|-----------|------------------------------|-----------------|-----------|
| title     | Título da AppBar    | `string`          | `''`        |
| textColor | Cor do Título       | `string` (hex)    | `'#fff'`    |
| bgColor   | Cor de Fundo da AppbBar| `string` (hex) | `'#00A868'` |
| border   | Mostra a borda abaixo da `AppBar` | `boolean` | `true` |
| borderColor   | Mostra a borda abaixo da `AppBar` | `string` | `#D5DEE8` |
