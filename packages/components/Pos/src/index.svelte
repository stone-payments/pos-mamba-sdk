<div class="wrapper">
  <div class="pos">
    <div class="screen">
      <slot></slot>
    </div>
  </div>
</div>

<style>
  @media all and (min-width: 481px) {
    .wrapper {
      display: flex;
      height: 100vh;
      width: 100%;
      align-items: center;
      justify-content: center;
    }

    .pos {
      position: relative;
      margin: 0 auto;
      width: 261px;
      height: 572px;
      background-image: url(./assets/POS.png);
    }

    .screen {
      position: absolute;
      top: 172px;
      left: 36px;
      width: 183px;
      height: 243px;
    }
  }
</style>
