# Image

O componente `Image` permite adicionar imagens através da tag `img`, sendo possível definir a altura e largura.

| Propriedades | Descrição                  | Tipo       | Padrão      |
| ------------ | -------------------------- | ---------- | ----------- |
| src          | Caminho para a imagem      | `string`   | `undefined` |
| width        | Largura da imagem          | `int` (px) | `undefined` |
| height       | Altura da imagem           | `int` (px) | `width`     |

## Sub componentes

### GenericLoading

`import GenericLoading from '@mamba/image/GenericLoading.html';`

O component `GenericLoading` é um component `Image` já configurado com uma imagem Gif da animação padrão de loading do POS.
