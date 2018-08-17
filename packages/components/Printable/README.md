# Printable

O componente `@mamba/printable` encapsula o fluxo de impressão do POS, permitindo a impressão de qualquer conteúdo HTML estático .

## Parâmetros

| Parâmetro | Descrição                                            | Tipo            | Padrão    |
| :-------- | :--------------------------------------------------- | :-------------- | :-------- |
| dithering | Define se deve ser aplicado um algoritmo de dithering na impressão. Use esta função somente para imprimir imagens, pois o dithering diminui a qualidade da impressão de texto  | `boolean` | `false` |

## Métodos

### print()

Envia o conteúdo do componente `printable` para impressão.

```html
<Printable ref:printableContent dithering={true}>
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium esse possimus eaque harum, voluptatum optio hic. Dignissimos, molestias eligendi, cumque et eos iusto quasi mollitia fuga quam laudantium tempora aliquid?
</Printable>

<!-- Print the ref:printableContent content -->
<button on:click="refs.printableContent.print()">Print</button>

<script>
  export default {
    components: {
      Printable: '@mamba/printable',
    },
  };
</script>

```