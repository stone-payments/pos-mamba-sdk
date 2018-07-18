<div class="SideBar Flex--flex Flex--grow Flex-direction--column Flex-alignItems--flexEnd">
  
  <div class="SideBar-logo">
    <a href="/" title="Mamba"><span>WEB DOCS</span></a>
  </div>
  <div class="SideBar-border"></div>
  <nav>
    {#each navigation as [idx, item]}
      <h1 class="home">
        <a href={item.to} class="">
          {item.title}
        </a>
      </h1>
      {#if item.submenu}
        <ul>
          {#each item.submenu as sub}
          <li>
            <a href={item.to}{sub.to}>{sub.title}</a>
          </li>
          {/each}
        </ul>
      {/if}
    {/each}
  </nav>
</div>

<script>
  import navigation from '../../routes/navigation.js';
  export default {
    data() {
      return {
        navigation: Object.entries(navigation)
      }
    }
  }
</script>
