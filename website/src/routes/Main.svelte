<section class="router-layout">
  <header class="router-header">
    <RouterLink to="/">Mamba</RouterLink>

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
    <img src="{{LogoImg}}" alt="Svelte Flat" />
    <p>Svelte Flat <sup>V0.2.0 Sonne</sup></p>
  </footer>
</section>

<script>
  import SvelteRouter from 'svelte-router'

  import menus from './menus'
  import LogoImg from '../assets/logo.png'

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
