# Brands

O componente `Brands` permite de modo fácil exibir o ícone das principais bandeiras disponíveis através da POS Stone. Ideal para quem mexe diretamente com requisicões de transação.

Caso não haja a bandeira especificada, ele exibe a bandeira padrão `blank`.

<!-- @example ./example/Example.html -->

## Parâmetros

| Parâmetro | Descrição                      | Tipo     | Padrão  |
| :-------- | :----------------------------- | :------- | :------ |
| icon      | Nome (caixa baixa) da bandeira | `string` | `blank` |
| width     | Largura da imagem              | `string` | `30`    |

<br />

As bandeiras compatíveis com o POS podem ser:

`alelo`, `amex`, `cabal`, `diners`, `elo`, `hipercard`, `mastercard`, `senff`, `sodexo`, `ticket`, `verdecard`, `visa`, `vr`, `hiper`, `greencard`, `cooper`, `valecard`, `verocard`, `up brasil`, `ben visa vale`, `redecompras`, `unionpay`, `banescard` e `sorocred`

<br />

---

## Utilidades

### getBrand(name)

<br />

Método auxiliar que retorna a imagem da bandeira. Pode ser útil para usar com `background-image` por exemplo. <br />
Caso use tag `img`, utilize o componenent `@mamba/brands/Brands.html`.

<br />

```
<div style="background-image: url({getBrand('visa')});"></div>

<script>
  import getBrand from '@mamba/brands/getBrand.js';

  export default {
     helpers: { getBrand },
  }
</script>
```
