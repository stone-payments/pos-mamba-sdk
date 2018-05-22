<div class="container">

  <h1>Default switch <span>{'<Switch />'}</span></h1>
  <div class="row">
    <Switch on:change="console.log(event)"/>
  </div>

  <h1>Checked switch <span>{'<Switch checked />'}</span></h1>
  <div class="row">
    <Switch checked on:change="console.log(event)"/>
  </div>

  <h1>Disabled switch <span>{'<Switch disabled />'}</span></h1>
  <div class="row">
    <Switch disabled on:change="console.log(event)"/>
  </div>

  <h1>Disabled checked switch <span>{'<Switch checked disabled />'}</span></h1>
  <div class="row">
    <Switch checked disabled on:change="console.log(event)"/>
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
      Switch: '../src',
    },
  }
</script>
