<script lang="ts">
  import { Radio } from '@mamba/jade';

  import {
    MODELS,
    getSanitizedPosModel,
    hasPrinter,
    hasNoPrinter,
    hasTouch,
    hasNoTouch,
    hasOnlyTouch,
    hasKeyboard,
    hasKeyboardLight,
    hasArrowNavigation,
    hasSmallScreen,
    hasEthernet,
    hasWifi,
    hasGprs,
  } from '@mamba/device';
  import { Registry } from '../../../index.js';
  import { store } from '../store';

  const POS_MODELS = [
    MODELS.S920,
    MODELS.Q92,
    MODELS.MP35P,
    MODELS.MP35,
    MODELS.D195,
    MODELS.D199,
    MODELS.D230,
    MODELS.Q60,
  ];

  $: posHasPrinter = hasPrinter();
  $: posHasNoPrinter = hasNoPrinter();
  $: posHasTouch = hasTouch();
  $: posHasNoTouch = hasNoTouch();
  $: posHasOnlyTouch = hasOnlyTouch();
  $: posHasKeyboard = hasKeyboard();
  $: posHasKeyboardLight = hasKeyboardLight();
  $: posHasArrowNavigation = hasArrowNavigation();
  $: posHasSmallScreen = hasSmallScreen();
  $: posHasEthernet = hasEthernet();
  $: posHasWifi = hasWifi();
  $: posHasGprs = hasGprs();

  const isModelChecked = (active, model) =>
    String(active).toUpperCase() === String(model).toUpperCase();

  function changePosModel(model) {
    store.setPosModel(model);
    window.location.reload();
  }

  function updateCapabilities() {}
</script>

<div class="title">POS</div>

<ul class="controllers">
  {#each POS_MODELS as model}
    <li class="controller {getSanitizedPosModel(model)}">
      <span>{model}</span>
      <Radio
        name="model"
        checked={isModelChecked($store.ACTIVE_MODEL, model)}
        on:change={() => updateCapabilities()}
        on:click={() => changePosModel(model)}
      />
    </li>
  {/each}

  <li class="controller is-full">
    <span>Capacidades do POS selecionado</span>
    <ul>
      <li>
        <div class="box-status" class:active={posHasPrinter}>Impressora</div>
        <div class="box-status" class:active={posHasTouch}>Touch</div>
        <div class="box-status" class:active={posHasOnlyTouch}>Apenas touch</div>
        <div class="box-status" class:active={posHasKeyboard}>Teclado</div>
        <div class="box-status" class:active={posHasKeyboardLight}>Luz de teclado</div>
        <div class="box-status" class:active={posHasArrowNavigation}>Navegação por setas</div>
        <div class="box-status" class:active={posHasSmallScreen}>Tela pequena</div>
      </li>
    </ul>
  </li>
</ul>

<style>
  .box-status {
    line-height: 1;
    font-family: monospace;
    margin-bottom: 4px;
    position: relative;
    font-size: 11px;

    &::before {
      position: relative;
      margin-right: 4px;
      content: '✕';
      display: inline-block;
      border-radius: 3px;
      border: 1px solid $neutral500;
      background: silver;
      width: 13px;
      line-height: 1;
      text-align: center;
    }

    &.active {
      &::before {
        content: '✓';
        border-color: $green500;
        background: $green400;
      }
    }
  }
</style>
