# Sprite

O componente `Sprite` ajuda na criação de animações utilizando uma *SpriteSheet*. É recomendado que se utilize este componente no lugar de arquivos `.gif` por este ter um desempenho melhor.

<!-- @example ./example/Example.html -->

## Parâmetros

<Sprite ...props />

| Parâmetro   | Descrição                         | Tipo               | Padrão        |
|-------------|-----------------------------------|--------------------|---------------|
| src         | Caminho para a spritesheet       | `string`            | `undefined`   |
| width       | Largura da animação              | `int` (px)          | `undefined`   |
| height      | Altura da animação               | `int` (px)          | `width`       |