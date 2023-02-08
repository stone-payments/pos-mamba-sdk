# Sprite

O componente `Gif` permite a utilização de imagens Gifs em substituição ao componente de `Sprite`.

| Propriedades | Descrição                  | Tipo       | Padrão      |
| ------------ | -------------------------- | ---------- | ----------- |
| src          | Caminho para a imagem      | `string`   | `undefined` |
| width        | Largura da imagem          | `int` (px) | `undefined` |
| height       | Altura da imagem           | `int` (px) | `width`     |

## Sub componentes

### LoadingGif

`import LoadingGif from '@mamba/gif/Loading.html';`

O component `LoadingGif` é um component `Gif` já configurado com a animação padrão de loading do POS.
