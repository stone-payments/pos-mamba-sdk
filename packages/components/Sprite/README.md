# Sprite

O componente `Sprite` ajuda na criação de animações utilizando uma SpriteSheet. É preferivél que se utilize este componente no lugar de Gifs por ter um desempenho **extremamente** melhor.

<!-- @example ./example/Example.html -->

## Parâmetros

<Sprite ...props />

| Parâmetro   | Descrição                         | Tipo               | Padrão        |
|-------------|-----------------------------------|--------------------|---------------|
| src         | Caminho para a spritesheet.       | `string`           | `undefined`   |
| width       | Largura da Animação.              | `int` (px)         | `undefined`   |
| height      | Altura da Animação.               | `int` (px)         | `width`       |