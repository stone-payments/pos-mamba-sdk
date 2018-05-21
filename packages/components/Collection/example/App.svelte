<Collection title="Rede">
  <CollectionRow label="1. Configurar" href="/network/configure"/>
</Collection>

<Collection title="Dispositivo">
  <CollectionRow label="2. Som do Teclado">
    <div slot="controller">
      <Icon symbol="account"/>
    </div>
  </CollectionRow>
  <CollectionRow label="3. Luz do Teclado">
    <div slot="controller">
      <Icon symbol="account"/>
    </div>
  </CollectionRow>
</Collection>

<script>
  import { Collection, CollectionRow } from '../src'
  import Icon from '@mamba/icon'
  export default {
    components: {
      Icon,
      CollectionRow,
      Collection,
    },
  }
</script>

<style>
  :global(body) {
    background-color: #efefef;
  }
</style>
