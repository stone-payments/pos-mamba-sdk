<div ref:icon class="mb-icon"></div>

<script>
  export default {
    data() {
      return {
        imageIcon: '',
        color: '',
        size: '',
        src: '',
      }
    },
    oncreate() {
      const { imageIcon, color, size, src } = this.get()
      const icon = this.refs.icon

      icon.className += ' ' + imageIcon + ' ' + size + ' ' + color
      if (src)
        icon.style.webkitMaskImage = 'url(".' + src + '")'
    },
  }
</script>

<style type="text/scss">

</style>
