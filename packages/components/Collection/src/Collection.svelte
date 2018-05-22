<div class="collection">
  <div class="row">
    <div class="title">{title}</div>
  </div>
  <slot></slot>
</div>

<style type="text/scss">
  @import '@mamba/styles-utils/src/colors.scss';

  .title {
    color: $green;
    font-size: 1.2rem;
  }

  .collection {
    margin-bottom: 15px;

      & :global(.row) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      margin: 0;
      line-height: 1.5rem;
      background: $white;
      border-bottom: 1px solid $grey-lightest;
      color: $grey-dark;
    }
  }

</style>
