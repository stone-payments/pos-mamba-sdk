<button on:click="openDialog('defaultDialog')">
  Open Default Dialog
</button>

<br>

<button on:click="openDialog('negativeDialog')">
  Open dialog with no negative action
</button>

<br>

<button on:click="openDialog('disabledNegative')">
  Open dialog with negative disabled
</button>

<br>

<button on:click="openDialog('disabledPositive')">
  Open dialog waith positive disabled
</button>

<br>

<Dialog
  isOpen={true}
  ref:defaultDialog
  title="Dialog Title"
  on:close="console.log(event)"
>
  Dialogo
</Dialog>

<Dialog
  ref:negativeDialog
  title="Dialog Title"
  on:close="console.log(event)"
  hideNegativeAction
>
  Dialogo 2
</Dialog>

<Dialog
  ref:disabledNegative
  title="Dialog Title"
  on:close="console.log(event)"
  disableNegativeAction
>
  Dialogo 3
</Dialog>

<Dialog
  ref:disabledPositive
  title="Dialog Title"
  on:close="console.log(event)"
  disablePositiveAction
>
  Dialogo 3
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
