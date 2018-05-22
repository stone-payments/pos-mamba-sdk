<div class="wrapper">
  <div class="pos">
    <div class="screen">
      <slot></slot>
    </div>
    <div class="actions">
      <button class="back" on:click="goBack()"></button>
    </div>
  </div>
</div>

<script>
  export default {
    methods: {
      async goBack() {
        try {
          const { getHistory } = await import('svelte-routing')
          getHistory().goBack()
        } catch(e) {
          console.log('[@mamba/POS] Missing "svelte-routing" package. Cannot goBack(). ') // eslint-disable-line
        }
      },
    },
  }
</script>

<style>
  @media all and (max-width: 480px) {
    .actions {
      display: none;
    }
  }

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
      overflow-y: auto;
    }

    .back {
      position: absolute;
      bottom: 77px;
      right: 35px;
      width: 48px;
      height: 22px;
      border: 0;
      appearance: none;
      cursor: pointer;
      background: transparent;
    }
  }
</style>
