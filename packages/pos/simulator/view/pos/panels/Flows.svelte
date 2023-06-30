<script lang="ts">
  import { Switch } from '@mamba/jade';
  import { Registry } from '../../../index.js';

  let paymentWillFail = Registry.get().$Payment.panel.shouldFail;
  let printerWillFail = Registry.get().$Printer.panel.shouldFail;

  $: {
    Registry.set((draft) => {
      draft.$Printer.panel.shouldFail = printerWillFail;
    });
  }

  $: {
    Registry.set((draft) => {
      draft.$Payment.panel.shouldFail = paymentWillFail;
    });
  }
</script>

<div class="title">Fluxos</div>

<ul class="controllers">
  <li class="controller">
    <span>Impressora sem papel</span>
    <Switch bind:checked={printerWillFail} />
  </li>
  <li class="controller">
    <span>Pagamento com falha</span>
    <Switch bind:checked={paymentWillFail} />
  </li>
</ul>
