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
      }
    },
    computed: {
      isInserted({ inserted }) {
        return inserted ? 'top: 640px;' : '780px'
      },
    },
    methods: {
      toggleCard() {
        this.set({ inserted: !this.get().inserted })
        this.fire('oncardevent', this.get().cardInfo)
      },
    },
    oncreate() {
      this.on(
        'oncardevent',
        () =>
          this.get().inserted
            ? console.log('Cartão Inserido')
            : console.log('Cartão Removido'),
      )
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
