<script lang="ts">
  import { onMount } from 'svelte';
  import { Registry } from '../../../index.js';

  const PERSISTENT_MERCHANT_INFO = [
    'stoneCode',
    'zipCode',
    'country',
    'city',
    'state',
    'neighborhood',
    'complement',
    'street',
    'number',
    'displayName',
    'taxationIdentificationType',
    'taxationIdentificationNumber',
  ];

  let stoneCode = Registry.persistent.get().$Merchant.stoneCode;
  let zipCode = Registry.persistent.get().$Merchant.zipCode;
  let country = Registry.persistent.get().$Merchant.country;
  let city = Registry.persistent.get().$Merchant.city;
  let state = Registry.persistent.get().$Merchant.state;
  let neighborhood = Registry.persistent.get().$Merchant.neighborhood;
  let complement = Registry.persistent.get().$Merchant.complement;
  let street = Registry.persistent.get().$Merchant.street;
  let number = Registry.persistent.get().$Merchant.number;
  let displayName = Registry.persistent.get().$Merchant.displayName;
  let taxationIdentificationType = Registry.persistent.get().$Merchant.taxationIdentificationType;
  let taxationIdentificationNumber =
    Registry.persistent.get().$Merchant.taxationIdentificationNumber;

  onMount(() => {
    Registry.on('persistentDataChanged', (changes) => {
      changes.forEach(({ path: [, prop], value }) => {
        //TODO: Corrigir função
        // if (prop in PERSISTENT_MERCHANT_INFO) {
        // }
      });
    });
  });

  $: Registry.persistent.set((draft) => {
    draft.$Merchant.stoneCode= stoneCode;
    draft.$Merchant.zipCode= zipCode;
    draft.$Merchant.country= country;
    draft.$Merchant.city= city;
    draft.$Merchant.state= state;
    draft.$Merchant.neighborhood= neighborhood;
    draft.$Merchant.complement= complement;
    draft.$Merchant.street= street;
    draft.$Merchant.number= number;
    draft.$Merchant.displayName= displayName;
    draft.$Merchant.taxationIdentificationType= taxationIdentificationType;
    draft.$Merchant.taxationIdentificationNumber= taxationIdentificationNumber;
  });
</script>

<div class="title">Lojista</div>

<ul class="controllers">
  <li class="controller is-full">
    <span>Nome de Exibição</span>
    <input type="text" bind:value={displayName} maxlength="20" />
  </li>
  <li class="controller is-full">
    <span>CEP</span>
    <input type="text" bind:value={zipCode} maxlength="8" />
  </li>
  <li class="controller is-full">
    <span>Rua</span>
    <input type="text" bind:value={street} maxlength="30" />
  </li>
  <li class="controller is-full">
    <span>Número</span>
    <input type="text" bind:value={number} maxlength="10" />
  </li>
  <li class="controller is-full">
    <span>Complemento</span>
    <input type="text" bind:value={complement} maxlength="20" />
  </li>
  <li class="controller is-full">
    <span>Bairro</span>
    <input type="text" bind:value={neighborhood} maxlength="20" />
  </li>
  <li class="controller is-full">
    <span>Cidade</span>
    <input type="text" bind:value={city} maxlength="30" />
  </li>
  <li class="controller is-full">
    <span>Estado</span>
    <input type="text" bind:value={state} maxlength="30" />
  </li>
  <li class="controller is-full">
    <span>CNPJ/CPF</span>
    <input type="text" bind:value={taxationIdentificationType} maxlength="4" />
  </li>
  <li class="controller is-full">
    <span>CPF/CNPJ</span>
    <input type="text" bind:value={taxationIdentificationNumber} maxlength="16" />
  </li>
</ul>
