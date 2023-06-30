<script lang="ts">
  import { onMount } from 'svelte';
  import { Registry } from '../../../index.js';

  let stoneCode = Registry.persistent.get().$Merchant.stoneCode;
  let adminPassword = Registry.persistent.get().$Merchant.stoneCode;
  let serialNumber = Registry.persistent.get().$System.stoneCode;
  let printerHasPaper = Registry.get().$Printer.panel.shouldFail;

  onMount(() => {
    Registry.on('persistentDataChanged', (changes) => {
      changes.forEach(({ path: [, prop], value }) => {
        if (prop === 'adminPassword') {
          this.set({ adminPassword: value });
        }
      });
    });
  });

  $: {
    Registry.set((draft) => {
      console.log(printerHasPaper);
      draft.$Printer.panel.shouldFail = printerHasPaper;
    });
  }

  $: {
    Registry.persistent.set((draft) => {
      draft.$System.serialNumber = serialNumber;
    });
  }

  $: {
    Registry.persistent.set((draft) => {
      draft.$Merchant.stoneCode = stoneCode;
    });
  }

  $: {
    Registry.persistent.set((draft) => {
      draft.$Merchant.adminPassword = adminPassword;
    });
  }
</script>

<div class="title">Geral</div>

<ul class="controllers">
  <li class="controller is-full">
    <span>Nº de série</span>
    <input type="text" bind:value={serialNumber} maxlength="20" />
  </li>
  <li class="controller is-full">
    <span>Stonecode</span>
    <input type="text" bind:value={stoneCode} maxlength="9" />
  </li>
  <li class="controller is-full">
    <span>Senha Admin</span>
    <input type="text" bind:value={adminPassword} maxlength="4" />
  </li>
</ul>
