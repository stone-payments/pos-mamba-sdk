<!-- If there's a href defined, wrap the row with a link -->
<div ref:row class="row" on:click="handleClick({ event, href })">
  <div class="main" {shortcut}>
    <div class="label">{label}</div>
    <div ref:controller class="controller">
      {#if href}
        <Icon symbol="chevron-right"/>
      {:elseif hasCustomController}
        <slot name="controller"></slot>
      {/if}
    </div>
  </div>

  {#if description}
    <div class="description">
      <p>{description}</p>
    </div>
  {/if}

  {#if hasExtraContent}
    <slot name="extra"></slot>
  {/if}
</div>

<script>
  import { getHistory } from 'svelte-routing'

  function findClosest(el, cb) {
    if (el.nodeType !== 1) return null
    if (el && !cb(el)) return findClosest(el.parentNode, cb)
    return el
  }

  export default {
    components: {
      Icon: '@mamba/icon',
    },
    data() {
      return {
        shortcut: undefined,
        href: undefined,
        description: undefined,
        hasCustomController: false,
        hasExtraContent: false,
      }
    },
    oncreate() {
      const hasSlots = !!this.options.slots
      if(hasSlots) {
        this.set({
          hasCustomController: !!this.options.slots.controller,
          hasExtraContent: !!this.options.slots.extra,
        })
      }
    },
    methods: {
      handleClick({ event, href }) {
        /** If clicked on a "link" row, push the page to the router */
        if (href) {
          return getHistory().push(href)
        }

        const { hasCustomController } = this.get()
        /**
         * If the row has a custom controller,
         * let's see if it has a [data-controller-triger] element.
         */
        if (hasCustomController) {
          /** Prevent firing the event twice (because of event bubbling) */
          const hasClickedSlot = !!findClosest(
            event.target,
            el => !!el.getAttribute('slot'),
          )
          if (!hasClickedSlot) {
            const triggerEl = this.refs.controller.querySelector(
              '[data-controller-trigger]',
            )
            if (triggerEl) {
              // ! We assume that the trigger is also the element method that triggers it (like click) */
              triggerEl[triggerEl.dataset.controllerTrigger]()
              return
            }
          }
        }

        /** Fire the row's click event for listening parent components */
        this.fire('click')
      },
    },
  }
</script>

<style>
  .row {
    display: block;
    margin: 0;
    line-height: 1.5rem;
    background: #fff;
    color: #494949;
    border-bottom: 1px solid #f4f4f4;
  }

  .row ref:row {
    padding-left: 0;
    padding-right: 0;
  }

  .row ref:row:last-child {
    border-bottom: none;
  }

  .main {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
  }

  .description {
    color: #8c8c8c;
    padding: 0 20px;
    margin-top: -5px;
    margin-bottom: 10px;
  }

  .description p {
    font-size: 14px;
  }

  .controller {
    line-height: 1;
  }

  .label {
    font-weight: bold;
  }
</style>
