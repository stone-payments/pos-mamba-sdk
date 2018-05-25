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

<Collection>
  <Row label="HideYoKidsHideYoWiFi">
    <div slot="controller">
      <Icon symbol="wifi" color="green" level={2}/>
    </div>
    <p slot="description">
      Conectado
    </p>
  </Row>
  <Row label="HideYoKidsHideYoWiFi">
    <div slot="controller">
      <Icon symbol="wifi" color="green" level={0}/>
    </div>
    <p slot="description">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic maiores mollitia asperiores delectus, deleniti nobis fugiat quas eaque aspernatur atque ex voluptate modi fuga, iusto minus magni reprehenderit libero numquam.
    </p>
  </Row>
</Collection>

<Collection>
  <Row label="HideYoKidsHideYoWiFi" href="/">
    <p slot="description">
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
    </p>
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
