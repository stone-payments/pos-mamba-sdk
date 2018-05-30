<div class="container">
  <h1>Default sprite <span>{'<Sprite src="..." width="..." height="..."/>'}</span></h1>
  <div class="row">
    <Sprite ref:sprite src="./static/stone.png" width="70px"/>
  </div>
  <button on:click="refs.sprite.start()">play</button>
  <button on:click="refs.sprite.stop()">pause</button>
</div>

<script>

  export default {
    components: {
      Sprite: '../src',
    },
  }
</script>

<style>
  :global(body) {
    background-color: #ddd;
  }

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
