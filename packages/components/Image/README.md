# Image

O componente `Image` permite adicionar imagens através da tag `img`, sendo possível definir a altura e largura.

| Propriedades | Descrição                  | Tipo       | Padrão      |
| ------------ | -------------------------- | ---------- | ----------- |
| src          | Caminho para a imagem      | `string`   | `undefined` |
| width        | Largura da imagem          | `int` (px) | `0`         |
| height       | Altura da imagem           | `int` (px) | `width`     |

## Sub componentes

### GenericLoading

`import GenericLoading from '@mamba/image/GenericLoading.html';`

O componente `GenericLoading` é um componente `Image` já configurado com uma imagem Gif da animação padrão de loading do POS.
