# QRCode

O componente `QRCode` ajuda na criação de códigos `QR` e ainda permite estiliza-los com logos, cores e tamanhos. Fora essas opções, também há como controlar o [Error Level Rate](https://blog.qrstuff.com/2011/12/14/qr-code-error-correction), que serve para precaver erros caso o `QR` seja danificado.

<!-- @example ./example/Example.html-->
<div class="iframe-wrapper">
  <iframe src="https://bundlebrowser.mambaweb.now.sh/#!/qrcode"></iframe>
</div>

## Parâmetros

| Parâmetro | Descrição                                   | Tipo            | Padrão     |
| :-------- | :------------------------------------------ | :-------------- | :--------- |
| color     | Cor do QR                                   | `string` (hex)  | `black`    |
| level     | Nível de Correção de Error (`H`,`M`,`L`)    | `string`        | `M`        |
| logo      | Caminho para a imagem de logo               | `string`        | `undefined`|
| size      | Tamanho do QR (`medium`, `small`, `large`)  | `string`        | `medium`   |
| value     | Valor codificado                            | `string`        | `''`       |
