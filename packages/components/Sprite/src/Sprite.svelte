<div class="sprite" ref:sprite style="background-position: {position}px 0"></div>

<script>
  const FPS = 60

  export default {
    data() {
      return {
        spriteWidth: null,
        position: 0,
      }
    },
    oncreate() {
      const { src, width, height } = this.options.data
      const { sprite } = this.refs
      const image = new Image()

      sprite.style.backgroundImage = `url(${src})`
      sprite.style.width = width
      sprite.style.height = height || width

      image.src = src
      image.onload = () => {
        this.set({ spriteWidth: image.width })
        this.start()
      }
    },
    ondestroy() {
      const { interval } = this.get()
      clearInterval(interval)
    },
    methods: {
      start() {
        const { spriteWidth, position } = this.get()
        const STEP = spriteWidth ? spriteWidth / FPS : 0
        let positionAux = position

        const interval = setInterval(() => {
          positionAux -= STEP
          if (positionAux < -spriteWidth) {
            positionAux = 0
          }
          this.set({ position: positionAux })
        }, 1000 / FPS)

        this.set({ interval })
      },
      stop() {
        const { interval } = this.get()
        clearInterval(interval)
        this.set({ interval: null })
      },
    },
  }
</script>

<style>
  .sprite {
    display: inline-block
  }
</style>
