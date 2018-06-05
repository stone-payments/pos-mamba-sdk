<div class="range">
  <div class="indicator">
    {#if icon}
      <img src={icon} alt="range symbol" />
    {/if}
    <span>{value}{min === 0 && max === 100 ? '%' : ''}</span>
  </div>
  <button style={buttonStyle} on:click="set({ value: Math.max(min, value - step) })">-</button>
  <div class="bar">
    <div class="value" style="width: {barWidth}%; background-color: {color}"></div>
  </div>
  <button style={buttonStyle} on:click="set({ value: Math.min(max, value + step) })">+</button>
</div>

<script>
  export default {
    data() {
      return {
        min: 0,
        max: 100,
        step: 10,
        value: 0,
        color: '#3da10f',
      }
    },
    onstate({ changed, current: { value }, previous }) {
      if (changed.value) {
        this.fire('change', { value })
      }
    },
    computed: {
      barWidth: ({ value, max, min }) => (value - min) / (max - min) * 100,
      buttonStyle({ color }) {
        return [`background-color: ${color}`]
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

  .indicator img,
  .indicator span {
    display: inline-block;
    vertical-align: middle;
  }

  .indicator img {
    margin-right: 5px;
  }

  .bar {
    width: 100%;
    margin: 0 15px;
    position: relative;
    background-color: #000;
  }

  .value {
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
