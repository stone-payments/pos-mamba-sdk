<div class="container">

  <h1>Default input <span>{'<Input />'}</span></h1>
  <div class="row">
    <Input />
  </div>

  <h1>Alphanumeric input <span>{'<Input alphanumeric/>'}</span></h1>
  <div class="row">
    <Input alphanumeric />
  </div>

  <h1>Autofocused input <span>{'<Input autofocus />'}</span></h1>
  <div class="row">
    <Input autofocus/>
  </div>

  <h1>Password input <span>{'<Input type="password"/>'}</span></h1>
  <div class="row">
    <Input type="password" />
  </div>

  <h1>Labeled input <span>{'<Input label="Input"/>'}</span></h1>
  <div class="row">
    <Input label="Input"/>
  </div>

  <h1>Labeled password input <span>{'<Input type="password" label="Password"/>'}</span></h1>
  <div class="row">
    <Input type="password" label="Password"/>
  </div>

  <h1>Custom colored input <span>{'<Input bgColor="red" textColor="white" />'}</span></h1>
  <div class="row">
    <Input bgColor="red" textColor="white"/>
  </div>

  <h1>Custom colored labeled input <span>{'<Input bgColor="red" textColor="white" label="Text" />'}</span></h1>
  <div class="row">
    <Input bgColor="red" textColor="white" label="Text"/>
  </div>
</div>

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

<script>
  export default {
    components: {
      Input: '../src',
    },
  }
</script>
