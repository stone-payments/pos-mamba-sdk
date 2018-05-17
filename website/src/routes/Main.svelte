<section class="router-layout">
  <header class="router-header">
    <NavLink exact to="/"><img src="{LogoImg}" alt="Svelte Flat" width="60" /></NavLink>
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
  
  import NavLink from 'svelte-routing/NavLink.html'
  // import menus from './menus'
  import LogoImg from '../assets/logo.svg'

  export default {
    data () {
      return {
        LogoImg,
      }
    },
    components: {
      NavLink
    }
  }
</script>
