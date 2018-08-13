# QRCode

## Descrição

O componente `QRCode` ajuda na criação de códigos `QR` e ainda permite estilizar-los com logos, cores e tamanhos.

## Exemplo

<!-- @example ./example/Example.html-->

## Parâmetros

| Parâmetro | Descrição                                   | Tipo            | Padrão     |
| :-------- | :------------------------------------------ | :-------------- | :--------- |
| color     | Cor do QR                                   | `string` (hex)  | `black`    |
| level     | Nível de Correção de Error (H,M,L)          | `string`        | `M`        |
| logo      | Caminho para a imagem de logo               | `string`        | `undefined`|
| size      | Tamanho do QR (medium, small, large)        | `string`        | `medium`   |
| value     | Valor codificado                            | `string`        | `''`       |