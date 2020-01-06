# Brands

O componente `Brands` permite de modo fácil exibir o ícone das principais bandeiras disponíveis através da POS Stone. Ideal para quem mexe diretamente com requisicões de transação.

Caso não haja a bandeira especificada, ele exibe a bandeira padrão `blank`.

<!-- @example ./example/Example.html-->

## Parâmetros

| Parâmetro | Descrição                      | Tipo     | Padrão  |
| :-------- | :----------------------------- | :------- | :------ |
| icon      | Nome (caixa baixa) da bandeira | `string` | `blank` |

Os nomes das bandeiras que são compatível com o POS podem ser:

```
  ALELO
  AMEX
  CABAL
  DINERS
  ELO
  HIPERCARD
  MASTERCARD
  SENFF
  SODEXO
  TICKET
  VERDECARD
  VISA
  VR
  HIPER
  GREENCARD
  COOPER
  VALECARD
  VEROCARD
  UP BRASIL
  BEN VISA VALE
  REDECOMPRAS
  UNIONPAY
  BANESCARD
  SOROCRED
```

## Utilidades

### getBrand.js

Método auxiliar que retorna a imagem da bandeira. Pode ser útil para usar com `background-image` por exemplo.
Caso use tag `img`, utilize o componenent `Brands.html`.

```js
<div style="background-image: url({getBrand('visa')});"></div>

<script>
  import getBrand from '@mamba/brands/getBrand.js';

  export default {
     helpers: { getBrand },
  }
</script>
```
