<div class="range">
  <div class="indicator" style="color: {textColor};">
    {#if icon}
      <img class="icon" src={icon} alt="range symbol" />
    {/if}
    <span class="value">{value}{unit}</span>
  </div>
  <button style={buttonStyle} on:click="decrement()">-</button>
  <div class="track" style="background-color: {barColor}">
    <div class="bar" style="width: {barWidth}%; background-color: {mainColor}"></div>
  </div>
  <button style={buttonStyle} on:click="increment()">+</button>
</div>

<script>
  export default {
    data() {
      return {
        min: 0,
        max: 100,
        step: 10,
        value: 0,
        label: '',
        unit: '%',
        mainColor: '#3da10f',
        textColor: '#000',
        barColor: '#000',
      }
    },
    oncreate() {
      if (!this.options.data || typeof this.options.data.value === 'undefined') {
        const { min, max } = this.get()
        this.set({ value: (max + min) / 2 })
      }
    },
    computed: {
      barWidth: ({ value, max, min }) => (value - min) / (max - min) * 100,
      buttonStyle({ mainColor }) {
        return [`background-color: ${mainColor}`].join(';')
      },
    },
    methods: {
      decrement() {
        const { min, value, step } = this.get()
        this.set({ value: Math.max(min, value - step) })
        this.fire('change', { value })
      },
      increment() {
        const { max, value, step } = this.get()
        this.set({ value: Math.min(max, value + step) })
        this.fire('change', { value })
      },
    },
  }
</script>

<style>
  .range {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 30px;
  }

  .indicator {
    position: absolute;
    left: 50%;
    top: -25px;
    transform: translateX(-50%);
    font-size: 18px;
    font-weight: bold;
  }

  .icon,
  .value {
    display: inline-block;
    vertical-align: middle;
  }

  .icon {
    margin-right: 5px;
  }

  .track {
    width: 100%;
    margin: 0 15px;
    position: relative;
    background-color: #000;
  }

  .bar {
    height: 6px;
    background-color: #3da10f;
    will-change: width;
    transition: width 0.3s ease;
  }

  button {
    flex: 0 0 31px;
    appearance: none;
    border: none;
    border-radius: 3px;
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    width: 31px;
    height: 31px;
    line-height: 1;
  }
</style>
