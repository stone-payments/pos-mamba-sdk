<script lang="ts">
  import { Radio } from '@mamba/jade';

  import { Registry } from '../../../index.js';

  const System = () => Registry.persistent.get().$System;
  const Organizations = System().Organizations;
  const orgs = System().Organizations.options;

  function setOrg(org) {
    Registry.persistent.set((draft) => {
      draft.$System.Organizations.current = System().Organizations[org];
    });
  }
  $: current = System().Organizations.current;
</script>

<div class="title">Organização</div>

<ul class="controllers">
  <div class="notice">
    <small>Precisa recarregar a página</small>
  </div>
  {#each orgs as org}
    <li class="controller">
      <span>{org}</span>
      <Radio name="orgs" checked={current === Organizations[org]} on:click={() => setOrg(org)} />
    </li>
  {/each}
</ul>

<style>
  .notice {
    display: none;
    margin-top: 10px;
    color: $neutral400;
  }

  :global(.section.is-active .notice) {
    display: block;
  }
</style>
