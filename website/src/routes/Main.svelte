<section class="router-layout" use:links>
  <header class="router-header">
    <a href="/"><img src="{LogoImg}" alt="Svelte Flat" width="60" /></a>
  </header>

  <section class="router-content">
    <section class="router-container">
      <ul class="router-menu">
      </ul>

      <main class="router-main">
        <slot></slot>
      </main>
    </section>
  </section>
</section>

<script>
  
  import links from 'svelte-routing/links'
  // import menus from './menus'
  import LogoImg from '../assets/logo.svg'

  export default {
    data () {
      return {
        LogoImg,
      }
    },
    actions: { 
      links 
    }
  }
</script>
