# Icon 
 
## Descrição
 
O módulo Icon possui dois componentes: Icon e Round Icon. Ambos, facilitam na criação de ícones com
imagens padrões já disponíveis em nossa SDK. Além das imagens, também é possível costumizar o estilo
do ícone e utilizar uma imagem própria .
 
## Exemplo
 
<!-- @example ./example/Example.Html -->
 
## Parâmetros
 
### Icon
 
| Parâmetro | Descrição                                            | Tipo            | Padrão    |
| :-------- | :--------------------------------------------------- | :-------------- | :-------- |
| color     | Pinta o ícone de acordo com a cor.                   | string (hex)    | 'fdfdfd'  |
| size      | Tamanho do ícone (normal, large, giant).             | string          | 'regular' |
| symbol    | Nome do ícone.                                       | string          | '6px'     |
| level     | Pinta o ícone de acordo com o level (apenas wifi).   | int (0..3)      | undefined |
 
### Round Icon
 
| Parâmetro | Descrição                                      | Tipo         | Padrão     |
| :-------- | :--------------------------------------------- | :---------   | :--------- |
| bgColor   | Cor de Fundo do ícone                          | string (hex) | '#4ebf1a'  |
| borderRadius | Permite editar o Border Radius do componente                                 | string (%) | '50%'  |
| color     | Cor do Circulo                                 | string (hex) | '#6ebf1a'  |
| size      | Velocidade de Rotação (normal, large, giant)   | string       | 'normal'   |
