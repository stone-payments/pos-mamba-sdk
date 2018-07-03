<div class="credit-card" style={isInserted} on:click="toggleCard()">
</div>

<script>
  export default {
    data() {
      return {
        inserted: false,
        cardInfo: {
          brand: 'Master',
          type: 'debit',
          pan: '52189300000000',
          cardholdername: 'JOHN CITIZEN',
        },
        callback: undefined,
      }
    },
    computed: {
      isInserted({ inserted }) {
        return inserted ? 'top: 640px;' : '780px'
      },
    },
    methods: {
      toggleCard() {
        this.store.fire('meta:cardInserted')
        this.set({'inserted': this.store.meta.get('cardInserted')})
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
      align-self: center;
      background-image: url('./assets/creditcard.png');
    }
  }
</style>
