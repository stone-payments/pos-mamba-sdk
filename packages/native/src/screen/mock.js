const MAX_BRIGHTNESS = 10
const MIN_BRIGHTNESS = 1

let brightnessValue = 5

const brightness = {
  decrease() {
    brightnessValue = Math.max(MIN_BRIGHTNESS, brightnessValue - 1)
    console.log(`[@mamba/native/screen] Brightness is now: ${brightnessValue}`)
  },
  increase() {
    brightnessValue = Math.min(brightnessValue + 1, MAX_BRIGHTNESS)
    console.log(`[@mamba/native/screen] Brightness is now: ${brightnessValue}`)
  },
  get() {
    return brightnessValue
  },
}

export default function(Screen) {
  Object.assign(Screen, {
    brightness,
  })
}
