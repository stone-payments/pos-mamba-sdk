<script lang="ts">
  import { onMount } from 'svelte';
  import { Switch, Radio } from '@mamba/jade';
  import { Registry } from '../../../index.js';

  let appKey = Registry.persistent.get().$App.appKey;
  let timeout = 0;
  let proxyEnvs = {
    Produção: 'poiproxy',
    Stage: 'poiproxy-stg',
    Development: 'poiproxy-dev',
  };
  let requestMsg = Registry.get().$Http.panel.requestMsg;
  let requestPayload = Registry.get().$Http.panel.requestPayload;
  let simulateRequest = Registry.get().$Http.panel.simulateRequest;
  let activeProxy = Registry.persistent.get().$Http.panel.activeProxy;
  let proxyEnvironment = Registry.persistent.get().$Http.panel.proxyEnvironment;

  function setEnv(env) {
    Registry.persistent.set((draft) => {
      draft.$Http.panel.proxyEnvironment = env;
    });
  }

  onMount(() => {
    requestMsg = `{"status":200, "msg": "OK"}`;
  });

  $: {
    Registry.set((draft) => {
      draft.$Http.panel = {
        simulateRequest,
        requestMsg,
        requestPayload,
        activeProxy,
        proxyEnvironment,
        appKey,
        timeout,
        proxyEnvs,
      };
    });
  }

  $: {
    Registry.persistent.set((draft) => {
      draft.$App.appKey = appKey;
    });
  }

  $: {
    Registry.persistent.set((draft) => {
      draft.$Http.panel.activeProxy = activeProxy;
    });
  }
  $: {
    Registry.persistent.set((draft) => {
      draft.$Http.panel.proxyEnvironment = proxyEnvironment;
    });
  }
</script>

<div class="title">Requests</div>

<ul class="controllers">
  <li class="controller">
    <span>Simular requisição?</span>
    <Switch bind:checked={simulateRequest} />
  </li>
  {#if simulateRequest}
    <li class="controller">
      <span>Código</span>
      <select on:change={(e) => (requestMsg = e.target.value)}>
        <option value={`{"status":200, "msg": "OK"}`}>200</option>
        <option value={`{"status":201, "msg": "Created"}`}>201</option>
        <option value={`{"status":202, "msg": "Accepted"}`}>202</option>
        <option value={`{"status":203, "msg": "Non-authoritative Information"}`}>203</option>
        <option value={`{"status":204, "msg": "No Content"}`}>204</option>
        <option value={`{"status":400, "msg": "Bad Request"}`}>400</option>
        <option value={`{"status":401, "msg": "Unauthorized"}`}>401</option>
        <option value={`{"status":403, "msg": "Forbidden"}`}>403</option>
        <option value={`{"status":404, "msg": "Not Found"}`}>404</option>
        <option value={`{"status":408, "msg": "Request Timeout"}`}>408</option>
        <option value={`{"status":500, "msg": "Internal Server Error"}`}>500</option>
        <option value={`{"status":504, "msg": "Gateway Time-Out"}`}>504</option>
      </select>
    </li>

    <li class="controller is-full">
      <span>Timeout</span>
      <input type="text" bind:value={timeout} />
    </li>
    <li class="controller is-full">
      <span>Payload</span>
      <textarea rows="4" style="resize:none;" bind:value={requestPayload} />
    </li>
  {/if}

  <li class="controller">
    <span>Ativar proxy</span>
    <Switch bind:checked={activeProxy} />
  </li>

  {#if activeProxy}
    <li class="controller is-full">
      <span>AppKey</span>
      <input type="text" bind:value={appKey} />
    </li>
    {#each Object.keys(proxyEnvs) as env}
      <li class="controller">
        <span>{env}</span>
        <Radio
          name="proxyEnvs"
          checked={proxyEnvironment === proxyEnvs[env]}
          on:click={() => setEnv(proxyEnvs[env])}
        />
      </li>
    {/each}
  {/if}
</ul>
