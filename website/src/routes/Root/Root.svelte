<section class="router-layout">
  <header class="router-header">
    <RouterLink to="/">Svelte Flat</RouterLink>

    <a href="https://github.com/jikkai/svelte-flat" target="true">
      <i class="devicon-github-plain"></i>
    </a>
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

  <footer class="router-footer">
    <img src="{{LogoImg}}" alt="Mamba" />
    <p>Mamba Web <sup>V0.0.1</sup></p>
  </footer>
</section>

<script>
  import SvelteRouter from 'svelte-routing'

  import menus from './menus'
  import LogoImg from '../../build/logo.svg'

  export default {
    data () {
      return {
        LogoImg,
        menus
      }
    },
    components: {
      RouterLink: SvelteRouter.RouterLink
    }
  }
</script>
