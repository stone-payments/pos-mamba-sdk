<div class="sprite" ref:sprite style="background-position: {_position}px 0"></div>

<script>
  const FPS = 60

  export default {
    data() {
      return {
        _spriteWidth: null,
        _position: 0,
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
        this.set({ _spriteWidth: image.width })
        this.start()
      }
    },
    methods: {
      start() {
        const { _spriteWidth, _position } = this.get()
        const STEP = _spriteWidth ? _spriteWidth / FPS : 0
        let _positionAux = _position

        const interval = setInterval(() => {
          _positionAux -= STEP
          if (_positionAux < -_spriteWidth) {
            _positionAux = 0
          }
          this.set({ _position: _positionAux })
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
    display: inline-block;
  }
</style>
