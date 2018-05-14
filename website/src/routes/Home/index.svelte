<main class="router-home">
  <img src="{{LogoImg}}" alt="Mamba" draggable="false" />
  <h1>Mamba Web</h1>
  <p>UI components built with Svelte.</p>
  <NavLink to="/guide/intro">Intro</NavLink>
</main>

<script>
  import NavLink from 'svelte-routing/NavLink.html'
  import LogoImg from '../../assets/logo.svg'

  export default {
    data () {
      return {
        LogoImg,
      }
    },
    components: { NavLink },
  }
</script>
