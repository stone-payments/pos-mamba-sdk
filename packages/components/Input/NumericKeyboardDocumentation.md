#Documentação do teclado virtual numérico

A nova versão do teclado numérico consiste em instanciar o componente e configurar os eventos por ele emitido. Essa versão visa uma maior usabilidade do componente e melhor encapsulamento das responsabilidades do próprio, visto que ele independe do cenário que vai ser colocado e permite com que qualquer lógica seja empregada. Os eventos apesar de retornarem o mesmo payload, foram dividos afim de incentivar uma maior segregação de responsabilidade.

###Eventos
| Nome         | Descrição                   | Payload           |
|--------------|-----------------------------|-------------------|
| keypress     | Teclas comuns do teclado    | { input: string } |
| mathKeypress | Teclas do teclado numerico  | { input: string } |
| backspace    | Tecla para apagar caractere | { input: string } |
| submit       | Tecla de submit             | { input: string } |
