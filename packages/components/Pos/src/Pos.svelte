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
      width: 342px;
      height: 751px;
      background-image: url(./assets/POS.png);
      background-size: cover;
    }

    .screen {
      position: absolute;
      top: 226px;
      left: 47px;
      width: 240px;
      height: 319px;
      overflow-y: auto;
    }

    .back {
      position: absolute;
      bottom: 101px;
      right: 49px;
      width: 60px;
      height: 29px;
      border: 0;
      appearance: none;
      cursor: pointer;
      background: transparent;
    }
  }
</style>
