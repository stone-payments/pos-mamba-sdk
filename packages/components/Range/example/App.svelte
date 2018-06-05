<div class="container">

  <h1>Default range <span>{'<Range />'}</span></h1>
  <div class="row">
    <Range on:change="console.log(event)"/>
  </div>

  <h1>Range with default value <span>{'<Range value={75} step={5}/>'}</span></h1>
  <div class="row">
    <Range value={75} step={5} on:change="console.log(event)"/>
  </div>

  <h1>Custom range <span>{'<Range max={1000} min={-1000} step={500}/>'}</span></h1>
  <div class="row">
    <Range max={1000} min={-1000} step={500} on:change="console.log(event)"/>
  </div>

  <h1>Custom colored range <span>{'<Range color="red"/>'}</span></h1>
  <div class="row">
    <Range color="red" on:change="console.log(event)"/>
  </div>

  <h1>Range with image <span>{'<Range icon="pathToFile"/>'}</span></h1>
  <div class="row">
    <Range icon="static/brightness.png" on:change="console.log(event)"/>
  </div>
</div>

<style>
  h1 span {
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
    font-family: monospace;
  }

  .container {
    max-width: 80%;
    width: 700px;
    margin: 80px auto;
  }

  .row {
    margin-bottom: 50px
  }
</style>

<script>
  export default {
    components: {
      Range: '../src',
    },
  }
</script>
