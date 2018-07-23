# System

## Descrição

Este módulo da API Nativa é responsável por expor métodos que entregram informações sobre o estado da máquina, como: tipo de conexão, informações da bateria, tempo passado desde de incialização do sistema e outros mais.

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

### beep()

Emite um beep sonoro pelo POS podendo especificar na entrada do método o tempo (ms) e a frequência sonora. No caso da frequência, está deve ser um dos 7 TONES `(TONE1, TONE2, ..., TONE7)`, caso esteja em ambiente de desenvolvimento um aviso será emitido no console. Se não específicado o tempo de beep e a frequência serão utilizados valores padrões `(System.Tones.TONE1, 300)`.

```js
import System from 'mamba/native/system.js'

/** Default beep */
System.beep(); // Beep: tone = 1700, duration = 300
System.beep(System.Tones.TONE3, 500) // Beep: tone = 2000, duration = 500
System.beep(System.Tones.TONE7, 800) // Beep: tone = 2800, duration = 800
```

### hasEthernet()

Informa se o POS tem Conexão via Ethernet. Caso esteja em ambiente de desenvolvimento, retorna true.

```js
import System from '@mamba/native/system.js'

/** With ethernet */
System.hasEthernet(); // true

/** Without ethernet */
System.hasEthernet(); // false
```

### hasWifi()

Informa se o POS tem Conexão via Wifi. Caso esteja em ambiente de desenvolvimento, retorna true.

```js
import System from '@mamba/native/system.js'

/** With wifi */
System.hasWifi(); // true

/** Without wifi */
System.hasWifi(); // false
```

### hasGprs()

Informa se o POS tem Conexão via GPRS. Caso esteja em abiente de desenvolvimento, retorna false.

```js
import System from '@mamba/native/system.js'

/** With GPRS */
System.hasGprs(); // true

/** Without GPRS */
System.hasGprs(); // false
```

### isBatteryPresent()

Informa se a bateria está conectada.

```js
import System from '@mamba/native/system.js'

/** With battery */
System.isBatteryPresent(); // true

/** Without battery */
System.isBatteryPresent(); // false
```

### getPowerSupply()

Retorna o tipo de fonte de energia na qual o POS está conectado no momento. Podendo ser:
`ADAPTER`, `BATTERY`, `USB`. Em ambiente de desenvolvimento retorna `USB`.

```js
import System from '@mamba/native/system.js'

/** When connected to a power-supply */
System.getPowerSupply(); // 'ADAPTER'

/** When using only the POS battery */
System.getPowerSupply(); // 'BATTERY'

/** When connected through an USB port */
System.getPowerSupply(); // 'USB'
```

### getTimeFromBoot()

Retorna em milissegundos o tempo desde a inicialização do sistema. Em ambiente de desenvolvimento retorna `0`.

```js
import System from '@mamba/native/system.js'

const timeUp = System.getTimeFromBoot() / 3600;
console.log(`O Sistema está ligado à: ${timeUp} minutos.`) // O Sistema está ligado à $timeUp minutos
```

### getSerialNumber()

Retorna uma string com o número de serial da máquina. No ambiente de desenvolvimento retorna `'00000'`.

```js
import System from '@mamba/native/system.js'

System.getSerialNumber(); // '12745'
```

### getBatteryStatus()

Retorna um `JSON` com o estado atual da bateria.

```js
import System from '@mamba/native/system.js'

/** When the battery is being used without its power supply  */
System.getBatteryStatus(); // {present: true, level: 50, status: DISCHARGE} -- padrão retornado em ambiente de desenvolvimento

/** When the battery state is not found */
System.getBatteryStatus(); // {present: false, level: 0, status: CHECK_NOT_SUPPORTED}

/** When the battery is charging */
System.getBatteryStatus(); // {present: true, level: 25, status: IN_CHARGE}

/** When the battery is fully charged */
System.getBatteryStatus(); // {present: true, level: 100, status: CHARGE_COMPLETE}

/** Without battery */
System.getBatteryStatus(); // {present: false, level: 100, status: ABSENT}
```

### getBatteryLevel()

Retorna a porcentagem da carga da bateria do dispostivo.

```js
import System from '@mamba/native/system.js'

System.getBatteryLevel(); // 50
```
