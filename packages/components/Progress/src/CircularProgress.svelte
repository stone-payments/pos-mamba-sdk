<canvas ref:canvas></canvas>

<script>
  export default {
    data() {
      return {
        color: '#6ebf1a',
        progress: undefined,
        height: 25,
        speed: 10,
      }
    },
    onupdate({ changed, current }) {
      if (changed.progress) {
        this._drawCircularProgress()
      }
    },
    oncreate() {
      const data = this.options.data
      if (!data || typeof data.progress === 'undefined') {
        this.set({ progress: 0 })
        this.start()
      }
    },
    ondestroy() {
      const { interval } = this.get()
      clearInterval(interval)
    },
    methods: {
      start() {
        let { speed } = this.get()
        speed = parseFloat(speed)

        const interval = setInterval(() => {
          const { progress } = this.get()
          if (progress > 100) {
            this.set({ progress: 0 })
          } else {
            this.set({ progress: progress + 5 * speed / 10 })
          }
        }, 50)
        this.set({ interval })
      },
      stop() {
        const { interval } = this.get()
        clearInterval(interval)
        this.set({ interval: null })
      },
      _drawCircularProgress() {
        const { progress, color, height } = this.get()
        const fraction = parseFloat(progress) / 100
        const canvas = this.refs.canvas
        const context = canvas.getContext('2d')

        canvas.width = canvas.height = height

        context.beginPath()
        context.lineWidth = 4
        context.arc(
          canvas.width / 2,
          canvas.height / 2,
          (canvas.height - context.lineWidth) / 2,
          1.5 * Math.PI,
          Math.PI * (1.5 + fraction * 2),
          false,
        )

        context.strokeStyle = color
        context.stroke()
      },
    },
  }
</script>