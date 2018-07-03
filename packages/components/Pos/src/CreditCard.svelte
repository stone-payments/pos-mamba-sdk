<div class="credit-card {$__meta__.isCardInserted ? 'is-inserted' : ''}" on:click="toggleCard()"></div>

<script>
  export default {
    data() {
      return {
        cardInfo: {
          brand: 'Master',
          type: 'debit',
          pan: '52189300000000',
          cardholdername: 'JOHN CITIZEN',
        },
      }
    },
    methods: {
      toggleCard() {
        if (this.store) {
          const isCardInserted = this.store.meta.get('isCardInserted')
          this.store.meta.set('isCardInserted', !isCardInserted)
          this.store.meta.fire('card-toggle', !isCardInserted)
        }
      },
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
      position: absolute;
      width: 240px;
      height: 370px;
      left: 45px;
      top: 780px;
      z-index: 1;
      background-image: url(./assets/creditcard.png);
      cursor: pointer;
      transition: transform 0.3s ease, filter 0.3s ease;
      filter: drop-shadow(8px 8px 2px rgba(0, 0, 0, 0.5));

      &:not(:hover):not(.is-inserted) {
        filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5));
      }

      &:hover {
        transform: scale(1.04);
      }

      &.is-inserted {
        transform: translateY(-180px);
      }
    }
  }
</style>
