<div class="card-wrapper">
  <div class="credit-card" style={isInserted} on:click="toggleCard()"/>
</div>

<script>
  export default {
    data() {
      return {
        inserted: false,
        cardEvent: undefined,
        cardInfo: {
          brand: 'Master',
          type: 'debit',
          pan: '52189300000000',
          cardholdername: 'JOHN CITIZEN',
        },
      }
    },
    computed: {
      isInserted({ inserted }) {
        return inserted ? 'top: 720px;' : 'top: 770px;'
      },
    },
    methods: {
      toggleCard() {
        this.set({ inserted: !this.get().inserted })
        document.dispatchEvent(this.get().cardEvent)
      },
    },
    oncreate() {
      const cardInfo = this.get().cardInfo
      this.set({
        cardEvent: new CustomEvent('oncardevent', { detail: cardInfo }),
      })
      document.createEvent(this.get().cardEvent)
      this.addEventListener('oncardevent', () => {
        console.log('CARD EVENT')
      })
    },
  }
</script>

<style>
  .card-wrapper,
  .credit-card {
    display: none;
  }

  @media all and (min-width: 481px) {
    .credit-card {
      display: block;
      position: relative;
      width: 240px;
      height: 370px;
      background-image: url('./assets/creditcard.png');
    }
    .card-wrapper{
      display: block;
      position: absolute;
      align-self: center;
      overflow: hidden;
      z-index: 1;
      width: 240px;
      height: 200px;
      top: 770px;
      background: none;
    }
  }
</style>
