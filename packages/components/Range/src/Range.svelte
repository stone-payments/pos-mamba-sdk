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
        class: '',
        style: '',
        min: 0,
        max: 100,
        step: 10,
        value: 0,
        label: '',
        unit: '%',
        mainColor: '#3da10f',
        textColor: '#494949',
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
      barWidth: ({ value, max, min, unit }) => {
        if (unit === '%') {
          return value / max * 100
        }
        return (value - min) / (max - min) * 100
      },
      buttonStyle({ mainColor }) {
        return `background-color: ${mainColor}`
      },
    },
    methods: {
      decrement() {
        const { min, value, step } = this.get()
        this.set({ value: Math.max(min, value - step) })
        this.fire('decrement', { value })
        this.fire('change', { value })
      },
      increment() {
        const { max, value, step } = this.get()
        this.set({ value: Math.min(max, value + step) })
        this.fire('increment', { value })
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
    padding: 30px 15px 0;
  }

  .indicator {
    position: absolute;
    left: 50%;
    top: 0;
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
    flex-grow: 1;
    margin: 0 15px;
    position: relative;
    background-color: #000;
  }

  .bar {
    height: 6px;
    background-color: #3da10f;
  }

  button {
    -webkit-appearance: none;
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
