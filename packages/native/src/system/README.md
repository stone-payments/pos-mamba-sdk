# System

## Descrição

Este módulo da API Nativa é responsável por expor métodos que entregram informações sobre o estado da máquina, como: tipo de conexão, informações da bateria, tempo passado desde de incialização do sistema e outros mais.

## beep()

Emite um beep sonoro pelo POS podendo especificar na entrada do método o tempo (ms) e a frequência sonora. No caso da frequência, está deve ser um dos 7 TONES ('TONE1', 'TONE2', ..., 'TONE7') , caso esteja em ambiente de desenvolvimento um aviso será emitido no console. Se não específicado o tempo de beep e a frequência serão utilizados valores padrões ('TONE1', 300).

```javascript
import {System} from Native

// default beep
System.beep()
// output:
// Beep: tone = 1700, duration = 300
System.beep('TONE3',500)
// output:
// Beep: tone = 2000, duration = 500
```

## hasEthernet()

Informa se o POS tem Conexão via Ethernet. Caso esteja em ambiente de desenvolvimento, retorna true.

```javascript
import {System} from Native

console.log(System.hasEthernet())

// output:
// true
// or
// false
```

## hasWifi()

Informa se o POS tem Conexão via Wifi. Caso esteja em ambiente de desenvolvimento, retorna true.

```javascript
import {System} from Native

console.log(System.hasWifi())

// output:
// true
// or
// false
```

## hasGprs()

Informa se o POS tem Conexão via GPRS. Caso esteja em abiente de desenvolvimento, retorna false.

```javascript
import {System} from Native

console.log(System.hasGprs())

// output:
// true
// or
// false
```

## isBatteryPresent()

Informa se a bateria está conectada.

```javascript
import {System} from Native

console.log(System.isBatteryPresent())

// output:
// true
// or
// false
```

## getPowerSupply()

Retorna o tipo de fonte de energia na qual o POS está conectado no momento. Podendo ser:
'ADAPTER', 'BATTERY', 'USB'. Em ambiente de desenvolvimento retorna 'USB'

```javascript
import {System} from Native

System.getPowerSupply() === 'BATTERY' ?
  console.log('Por favor, conecte a uma fonte de energia') :
  console.log('Dispostivo Carregando')

// output:
// Por favor, conecte a uma fonte de energia
// ou
// Dispositivo Carregando
```

## getTimeFromBoot()

Retorna em milissegundos o tempo desde a inicialização do sistema. Em ambiente de desenvolvimento retorna 0.

```javascript
import {System} from Native

const timeUp = System.getTimeFromBoot()/360
console.log(`O Sistema está ligado à: ${timeUp} minutos.`)

// output:
// O Sistema está ligado à $timeUp minutos
```

## getSerialNumber()

Retorna uma string com o número de serial da máquina. No ambiente de desenvolvimento retorna 00000.

```javascript
import {System} from Native

const sNumber = System.getSerialNumber()
sNumber === '233561' ? console.log('POS encontrado') : console.log('Esse não é meu POS')
// output:
// POS encontrado
// ou
// Esse não é meu POS
```

## getBatteryStatus()

Retorna um JSON com o estado atual da bateria. Em ambiente de desenvolvimento retorna:

```
{
  present: true,
  level:50,
  status: 'DISCHARGE',
}
```

```javascript
import {System} from Native

const battery = System.getBatteryStatus()
if (battery.present){
  battery.level < 20 && battery.status === 'DISCHARGE' ?
    console.log('Porfavor, carregue seu dispostivo.') :
    console.log('Tudo certo.')
}

// output:
// Porfavor, carregue seu dispositivo
// ou
// Tudo Certo
```

## getBatteryLevel()

Retorna a porcentagem da carga da bateria do dispostivo.

```javascript
import {System} from Native

const batteryLevel = System.getBatteryLevel()

batteryLevel < 5 ?
  console.log('Nível de Bateria extremamente baixo.') :
  console.log('Acima do Nível Crítico')

// output:
// Nível de Baterua extremamente baixo.
// Acima do Nível Crítico
```

## Interface

```ts
interface System {
  beep: (tone: Tones, duration: number) => void
  hasEthernet: () => boolean
  hasWifi: () => boolean
  hasGprs: () => boolean
  isBatteryPresent: () => boolean
  getPowerSupply: () => PowerSupply
  getTimeFromBoot: () => number
  getSerialNumber: () => string
  getBatteryStatus: () => BatteryStatus
  getBatteryLevel: () => number
  Tones: Tones
  PowerSupply: PowerSupply
  BatteryStatus: BatteryStatus
}

enum Tones {
  TONE1,
  TONE2,
  TONE3,
  TONE4,
  TONE5,
  TONE6,
  TONE7,
}

enum PowerSupply {
  ADAPTER,
  BATTERY,
  USB,
}

enum BatteryStatus {
  CHECK_NOT_SUPPORTED,
  IN_CHARGE,
  CHARGE_COMPLETE,
  DISCHARGE,
  ABSENT,
}
```