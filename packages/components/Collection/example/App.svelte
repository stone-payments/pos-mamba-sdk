<Collection title="Rede">
  <Row label="1. Configurar" href="/network/configure"/>
</Collection>

<Collection title="Dispositivo">
  <Row label="2. Som do Teclado">
    <div slot="controller">
      <Icon symbol="account"/>
    </div>
  </Row>
  <Row label="3. Luz do Teclado">
    <div slot="controller">
      <Icon symbol="account"/>
    </div>
  </Row>
</Collection>

<script>
  import { Collection, Row } from '../src'
  import Icon from '@mamba/icon'
  export default {
    components: {
      Icon,
      Row,
      Collection,
    },
  }
</script>

<style>
  :global(body) {
    background-color: #efefef;
  }
</style>
