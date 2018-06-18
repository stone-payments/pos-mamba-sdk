<script>
  export default {
    /** We use onstate to fire the event before things are rendered */
    onstate({ previous }) {
      if(!previous) {
        if (!this.store) {
          throw new Error(
            '[@mamba/appbar/title] No svelte store found. Cannot change appbar title.',
          )
        }

        if (this.options.data) {
          this.store.setTitle(this.options.data.label)
        }
      }
    },
  }
</script>
