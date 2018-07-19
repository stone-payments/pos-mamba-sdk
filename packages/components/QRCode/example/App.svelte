<div class="container">
  <h1>Default QR Code<span>{'<QRCode></QRCode>'}</span></h1>
  <div class="row">
    <QRCode/>
  </div>
  <h1>Setting QRCode Value<span>{'<QRCode value="http://stone.com.br"></QRCode>'}</span></h1>
  <div class="row">
    <QRCode value="http://stone.com.br/"/>
  </div>
  <h1>...and Colors/Size<span>{'<QRCode color="yourcolorcss"></QRCode>'}</span></h1>
  <div class="row">
    <QRCode size="small" foreground="blue"/>
    <QRCode size="medium" foreground="red"/>
    <QRCode size="large" foreground="green"/>
  </div>
  <h1>Error Rate Level<span>{'<QRCode value="OLA" level="H"></QRCode>'}</span></h1>
  <div class="row">
    <QRCode value="OLA" level='H'/>
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
  }

  .row {
    margin-bottom: 50px;
  }

</style>

<script>

  export default {
    components: {
      QRCode: '../src',
    },
  }

</script>
