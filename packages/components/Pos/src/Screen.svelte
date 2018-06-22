<div class="screen">
  <div class="brightness" style="opacity: {brightnessOpacity};"></div>
  <div class="status-bar">
    <div>
      <div class="version">{version}</div>
    </div>
    <div>
      <div class="version">{time}</div>
    </div>
  </div>
  <div class="content">
    <slot></slot>
  </div>
</div>

<script>
  export default {
    data() {
      return {
        version: '2.1.0',
        brightnessLevel: 10,
        time: '00:00',
      }
    },
    computed: {
      brightnessOpacity: ({ brightnessLevel }) => 1 - brightnessLevel / 10,
    },
    oncreate() {
      /** Update the clock after each second */
      const updateTimer = () => {
        const curDate = new Date()
        const minutes = String(curDate.getMinutes()).padStart(2, '0')
        const hours = curDate.getHours()
        this.set({ time: `${hours}:${minutes}` })
        return updateTimer
      }
      setInterval(updateTimer(), 1000)

      if (this.store) {
        /** Listen for brightness changes */
        this.store.on('pos:brightness', ({ brightnessLevel }) => {
          this.set({ brightnessLevel })
        })
      }
    },
  }
</script>

<style>
  .status-bar {
    display: none;
  }

  @media all and (min-width: 481px) {
    .screen {
      position: absolute;
      top: 231px;
      left: 50px;
      width: 240px;
      height: 320px;
      display: flex;
      flex-flow: column;
      overflow: hidden;
    }

    .content {
      height: 100%;
      background-color: #fff;
      overflow-x: hidden;
      overflow-y: auto;
      flex: 0 1 auto;
    }

    .content::-webkit-scrollbar {
      display: none;
    }

    .brightness {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
      z-index: 100000;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .status-bar {
      position: relative;
      z-index: 1002;
      width: 100%;
      height: 20px;
      flex: 0 0 20px;
      background-color: #000;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 4px;
      color: #fff;
      font-size: 12px;
      font-weight: bold;
    }

    .screen :global(.button.is-fixed),
    .screen :global(.dialog) {
      position: absolute !important;
    }
  }
</style>
