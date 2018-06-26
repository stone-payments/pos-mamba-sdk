<div class="credit-card inserted" on:click="toggleCard()">
</div>

<script>
  export default {
    data() {
      return {
        inserted: true,
      }
    },
    methods: {
      toggleCard(){
        this.inserted = !this.inserted;
        console.log(this.inserted)
        if(this.inserted)
          this.class = 'credit-card inserted';
        else
          this.class = 'credit-card';
      },
    },
    oncreate() {
    },
  }
</script>

<style>
  .credit-card {
    display: none;
  }

  @media all and (min-width: 481px) {
    .credit-card {
      display: block;
      position: relative;
      width: 240px;
      height: 370px;
      top: 770px;
      left: 40px;
      z-index: 2;
      background-image: url('./assets/creditcard.png');
    }
    .inserted {
      display: block;
      position: relative;
      top:720px;
      z-index: 2;
    }
  }
</style>
