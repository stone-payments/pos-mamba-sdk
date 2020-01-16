# Printable

O componente `Printable` encapsula o fluxo de impressão do POS, permitindo a impressão de qualquer conteúdo HTML estático.

<div class="iframe-wrapper">
  <iframe src="http://bundlebrowser.didiraja.now.sh/#!/printable"></iframe>
</div>

## Parâmetros

| Parâmetro                                         | Descrição                                                                                                                                                                     | Tipo      | Padrão  |
| :------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------- | :------ |
| [dithering](https://pt.wikipedia.org/wiki/Dither) | Define se deve ser aplicado um algoritmo de dithering na impressão. Use esta função somente para imprimir imagens, pois o dithering diminui a qualidade da impressão de texto | `boolean` | `false` |
| showPrintingDialog                                | define se o diálogo de "Imprimindo" deve aparecer ou não                                                                                                                      | `boolean` | `true`  |

## Eventos

`<Printable ... on:event="..."/>`

| Nome   | Disparado quando ....                                                                                 | Tipo                |
| ------ | ----------------------------------------------------------------------------------------------------- | ------------------- |
| finish | Ao finalizar uma impressão, recebendo `true` se a impressão foi concluída e `false` caso interrompida | `function(boolean)` |
| error  | Um erro de impressão ocorre                                                                           | `function()`        |

#### Exemplos:

Chama `myMethod()` quando a impressão termina, passando como parâmetro `event` que indica caso a impressão foi concluída ou interrompida.

```html
<Printable on:finish="myMethod(event)" />
```

Chama exibe no console a mensagem quando a impressão falha:

```html
<Printable on:error="console.log('your printing failed')" />
```

## Métodos

### print()

Envia o conteúdo do componente `printable` para impressão.

```html
<Printable ref:printableContent dithering="{true}">
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium esse
  possimus eaque harum, voluptatum optio hic. Dignissimos, molestias eligendi,
  cumque et eos iusto quasi mollitia fuga quam laudantium tempora aliquid?
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
