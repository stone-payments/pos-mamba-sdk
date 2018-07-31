# Printable

## Descrição

O componente `@mambasdk/printable` encapsula o fluxo de impressão do POS, permitindo a impressão de qualquer conteúdo HTML estático .

<!-- @example ./example/Example.Html -->

## Parâmetros

| Parâmetro | Descrição                                            | Tipo            | Padrão    |
| :-------- | :--------------------------------------------------- | :-------------- | :-------- |
| options | Opções que são enviadas ao método `.print()` do módulo `@mambasdk/printer` | `object` | `{}` |

### Opções

| Parâmetro | Descrição           | Tipo            | Padrão    |
| :-------- | :------------------ | :-------------- | :-------- |
| use_dithering | Define se deve ser aplicado um algoritmo de dithering na impressão. Use esta função somente para imprimir imagens, pois o dithering diminui a qualidade da impressão de texto | `boolean` | `false` |

## Métodos

### print()

Envia o conteúdo do componente `printable` para impressão.

```html
<Printable ref:printableContent options={ useDithering: true }>
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium esse possimus eaque harum, voluptatum optio hic. Dignissimos, molestias eligendi, cumque et eos iusto quasi mollitia fuga quam laudantium tempora aliquid?
</Printable>

<!-- Print the ref:printableContent content -->
<button on:click="refs.printableContent.print()">Print</button>

<script>
  export default {
    components: {
      Printable: '@mambasdk/printable',
    },
  };
</script>

```