# Sprite

O componente `Sprite` ajuda na criação de animações utilizando uma *SpriteSheet*. É recomendado que se utilize este componente no lugar de arquivos `.gif` por ter um desempenho melhor.

<!-- @example ./example/Example.html -->
<div class="iframe-wrapper">
  <iframe src="http://bundlebrowser.didiraja.now.sh/#!/sprite"></iframe>
</div>

## Parâmetros

| Parâmetro   | Descrição                         | Tipo               | Padrão        |
|-------------|-----------------------------------|--------------------|---------------|
| src         | Caminho para a spritesheet       | `string`            | `undefined`   |
| width       | Largura da animação              | `int` (px)          | `undefined`   |
| height      | Altura da animação               | `int` (px)          | `width`       |

## Métodos

### start()

Inicia a animação do `Sprite`.

### stop()

Pausa a animação do `Sprite`.

## Sub componentes

### LoadingSprite

`import LoadingSprite from '@mamba/sprite/Loading.html';`

O component `LoadingSprite` é um component `Sprite` já configurado com a animação padrão de loading do POS.
