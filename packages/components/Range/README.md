# Range

O módulo `Range` pode ser usado para representar um valor dentro de um intervalo, que pode ser alterado a partir dos botões nas laterais.


<div class="iframe-wrapper">
  <iframe src="https://bundlebrowser.mambaweb.now.sh/#!/range"></iframe>
</div>

## Parâmetros

| Parâmetro  | Descrição                                                          | Tipo              | Padrão      |
| :--------- | :----------------------------------------------------------------- | :---------------- | :---------- |
| value      | valor escolhido                                                    | `int`             | `50`        |
| step       | intervalo entre valores                                            | `int`             | `10`        |
| max        | valor máximo                                                       | `int`             | `100`       |
| min        | valor mínimo                                                       | `int`             | `0`         |
| mainColor  | cor do progresso e botões                                          | `string` (hex)    | `#3da10f`   |
| barColor   | cor de fundo                                                       | `string` (hex)    | `#000`      |
| textColor  | cor do texto                                                       | `string` (hex)    | `#404040`   |
| icon       | ícone que será apresentado ao lado do texto                        | `string`          | `undefined` |
| unit       | unidade de valor                                                   | `string` (%,x...) | `undefined` |
| validation | função de validação que impede mudança de valor caso retorne falso | `function`        | `undefined` |

## Eventos

`<Range ... on:event="..."/>`

| Eventos   | Disparado quando ... | Tipo            |
| --------- | -------------------- | --------------- |
| decrement | O valor é decrescido | `function(int)` |
| increment | O valor é aumentado  | `function(int)` |

## Métodos

### increment()

Aumenta em uma unidade do `Step` o valor atual do `Range`.

### decrement()

Diminui em uma unidade do `Step` o valor atual do `Range`.

## Validação

Às vezes o valor mínimo e máximo de um intervalo não representa, de fato, o valor mínimo/máximo que o usuário pode selecionar. Para estes casos, é possível usar a _prop_ `validation` para validar o novo valor. Basta passar uma função que receberá o novo possível valor.

```html
<Range validation="{rangeValidation}" />

<script>
  export {
    components: {
      Range: '@mamba/range',
    },
    data() {
      return {
        /** Limita o valor entre 20 e 80 */
        rangeValidation: value => value >= 20 && value <= 80,
      };
    },
  }
</script>
```
