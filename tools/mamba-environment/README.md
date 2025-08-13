# Mamba Environment para Ubuntu 22.04 LTS

Este script:
- Instala e configura todos softwares necessários para desenvolvimento
- Clona os repositórios mais importantes

O script `mamba-environment.sh` possui alguns passos para ajudar na criação de um ambiente funcional de desenvolvimento do MAMBA.

- Linux kernel >= 6.2.0 
- Qt Creator >= 11.0.2
- Qt LTS >= 6.2.4

## Disclaimer

Script apenas nas seguintes distros: 

- Ubuntu 22.04 LTS - sistema homologado Stone

Colaborações e testes deste script são bem vindos.

## Utilização

Execute o comando abaixo e selecione sequencialmente a partir do passo *a*.

```bash
wget -O - https://raw.githubusercontent.com/stone-payments/pos-mamba-sdk/master/tools/mamba-environment/mamba-environment.sh | bash
```

## Status de teste do script
Não foi plenamente testado na última versão por falha em rodar VM de teste.
Ao verificar erros, por favor corrija ou relate.
