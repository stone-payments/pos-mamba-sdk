<!-- If there's a href defined, wrap the row with a link -->
<div class="row" on:click="handleClick({ event, href })">
  <div class="main">
    <div class="label">{label}</div>
    <div ref:controller class="controller">
      {#if href && !hasCustomController}
        <Icon symbol="chevron-right"/>
      {:else}
        <slot name="controller"></slot>
      {/if}
    </div>
  </div>
  {#if description}
    <div class="extra">
      <p>{description}</p>
    </div>
  {/if}
</div>

<script>
  import { getHistory } from 'svelte-routing'

  function findClosest(el, cb) {
    if(el.nodeType !== 1) return null
    if(el && !cb(el)) return findClosest(el.parentNode, cb)
    return el;
  }

  export default {
    components: {
      Icon: '@mamba/icon',
    },
    data() {
      return {
        href: undefined,
        description: undefined,
        hasCustomController: false,
      }
    },
    oncreate() {
      this.set({
        hasCustomController: !!(this.options.slots && this.options.slots.controller),
      })
    },
    methods: {
      handleClick({ event, href }) {
        /** If clicked on a "link" row, push the page to the router */
        if(href) {
          return getHistory().push(href)
        }

        const { hasCustomController } = this.get()
        /**
         * If the row has a custom controller,
         * let's see if it has a [data-controller-triger] element.
         */
        if(hasCustomController) {
          /** Prevent firing the event twice (because of event bubbling) */
          const hasClickedOnController = !!findClosest(event.target, el => el.getAttribute('slot') === 'controller')
          if(!hasClickedOnController) {
            const triggerEl = this.refs.controller.querySelector('[data-controller-trigger]')
            if(triggerEl) {
            // ! We assume that the trigger is also the element method that triggers it (like click) */
              triggerEl[triggerEl.dataset.controllerTrigger]()
              return
            }
          }
        }

        this.fire('click')
      },
    },
  }
</script>

<style type="text/scss">
  @import '@mamba/styles-utils/src/colors.scss';
  @import './Row.style.scss';

  .main {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .extra {
    color: $grey;

    :global(p) {
      margin-top: 10px;
      font-size: 14px;
    }
  }

  .controller {
    line-height: 1
  }

  .label {
    font-weight: bold;
  }
</style>
