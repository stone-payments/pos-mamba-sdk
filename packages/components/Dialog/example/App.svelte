<button on:click="openDialog('defaultDialog')">
  Open Default Dialog
</button>

<br>

<button on:click="openDialog('negativeDialog')">
  Open dialog with no negative action
</button>

<br>

<Dialog
  ref:defaultDialog
  title="Dialog Title"
  on:close="console.log(event)"
>
  Dialogo
</Dialog>

<Dialog
  ref:negativeDialog
  title="Dialog Title"
  hideNegativeAction
  on:close="console.log(event)"
>
  Dialogo 2
</Dialog>

<script>
  export default {
    components: {
      Dialog: '../src',
    },
    methods: {
      openDialog(dialog) {
        this.refs[dialog].open()
      },
    },
  }
</script>
