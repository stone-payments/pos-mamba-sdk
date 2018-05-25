<div class="collection">
  {#if title}
    <div class="row">
      <div class="title">{title}</div>
    </div>
  {/if}
  <slot></slot>
</div>

<script>
  export default {
    data() {
      return {
        title: undefined,
      }
    },
  }
</script>

<style type="text/scss">
  @import './Row.style.scss';

  .title {
    color: $green;
    font-size: 1.2rem;
  }

  .collection {
    margin-bottom: 15px;
  }
</style>
