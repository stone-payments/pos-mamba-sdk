<div class="SideBar Flex--flex Flex--grow Flex-direction--column Flex-alignItems--flexEnd">
  
  <div class="SideBar-logo">
    <a href="/" title="Mamba"><span>WEB DOCS</span></a>
  </div>
  <div class="SideBar-border"></div>
  <nav>
    {#each $guide_contents as section}
    <h1 class="section">
      <a class='{section.slug === $activeGuideSection ? "active": ""}' href='guide#{section.slug}'>{section.metadata.title}</a>
    </h1>
    <ul class='guide-toc'>
      {#each section.subsections as subsection}
        <li>
          <a class='subsection {subsection.slug === $activeGuideSection ? "active": ""}' href='guide#{subsection.slug}'>{subsection.title}</a>
        </li>
      {/each}
    </ul>
    {/each}
    {#each navigation as [idx, item]}
      <h1>
        <a href={item.to} class="">
          {item.title}
        </a>
      </h1>
      {#if item.submenu}
        <ul>
          {#each item.submenu as sub}
          <li class='{path === sub.to ? "active": ""}'>
            <a href='{sub.to !== item.to ? item.to : ""}{sub.to}'>{sub.title}</a>
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
        contents: [],
        navigation: Object.entries(navigation),
      }
    },

    oncreate () {
      const onhashchange = () => {
        this.store.set({ activeGuideSection: window.location.hash.slice( 1 ) });
      };

      window.addEventListener( 'hashchange', onhashchange, false );
      this.on( 'destroy', () => {
        window.removeEventListener( 'hashchange', onhashchange, false );
      });

      onhashchange();
    },
  }
</script>
