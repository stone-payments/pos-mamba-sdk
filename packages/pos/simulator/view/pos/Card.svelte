<script lang="ts">
  import { onMount } from 'svelte';
  import { HardwareManager } from '../../index.js';
  import { store } from './store';

  export let card = null;

  let isInserted = false;
  let isDragging = false;
  let isAboveScreen = false;

  onMount(() => {
    const cardEl = card;
    let mouseStartPos = null;
    let elPos = null;
    let nfcTimeout;

    const resetDrag = () => {
      clearTimeout(nfcTimeout);
      nfcTimeout = null;

      cardEl.style.top = '';
      cardEl.style.left = '';

      isDragging = false;
      isAboveScreen = false;

      mouseStartPos = null;
      elPos = null;
    };

    const checkAboveScreen = (x, y) =>
      Array.from(document.elementsFromPoint(x, y)).some((n) => n.classList.contains('screen'));

    const onMousedown = (e) => {
      mouseStartPos = { x: e.clientX, y: e.clientY };
      elPos = { x: cardEl.offsetLeft, y: cardEl.offsetTop };
    };

    const onMouseup = (e) => {
      if (mouseStartPos.x === e.clientX && mouseStartPos.y === e.clientY) {
        toggleCard();
      }
      resetDrag();
    };

    const onMousemove = (e) => {
      if (!mouseStartPos || isInserted) {
        return;
      }

      if (!isDragging) {
        isDragging = true;
      }

      const newPos = {
        x: elPos.x + e.clientX - mouseStartPos.x,
        y: elPos.y + e.clientY - mouseStartPos.y,
      };
      cardEl.style.left = `${newPos.x}px`;
      cardEl.style.top = `${newPos.y}px`;

      isAboveScreen = checkAboveScreen(e.clientX, e.clientY);

      if (isAboveScreen) {
        if (!nfcTimeout) {
          nfcTimeout = setTimeout(() => {
            HardwareManager.fire('nfcStart');
          }, 1000);
        }
      } else {
        clearTimeout(nfcTimeout);
        nfcTimeout = null;
      }
    };

    cardEl.addEventListener('mousedown', onMousedown);
    cardEl.addEventListener('mouseup', onMouseup);
    document.body.addEventListener('mouseout', resetDrag);
    document.body.addEventListener('mousemove', onMousemove);

    return () => {
      cardEl.removeEventListener('mousedown', onMousedown);
      cardEl.removeEventListener('mouseup', onMouseup);
      document.body.removeEventListener('mouseout', resetDrag);
      document.body.removeEventListener('mousemove', onMousemove);
    };
  });

  function toggleCard() {
    isInserted = !this.get().isInserted;

    if (isInserted) {
      setTimeout(() => {
        HardwareManager.fire('cardToggled', true);
        HardwareManager.fire('cardInserted');
      }, 500);
    } else {
      HardwareManager.fire('cardToggled', false);
      HardwareManager.fire('cardRemoved');
    }
  }

  function _onKeyup(e) {
    const keyCode = e.charCode || e.which || e.keyCode;
    /** If input is focused or a key other than 'spacebar' clicked, do nothing */
    if (document.activeElement.tagName === 'INPUT' || keyCode !== 32) {
      return;
    }
    e.stopImmediatePropagation();
    toggleCard();
  }
</script>

<svelte:window on:keyup|preventDefault={_onKeyup} />

<div
  class="credit-card {$store.ACTIVE_MODEL}"
  class:is-inserted={isInserted}
  class:is-dragging={isDragging}
  class:is-above-screen={isAboveScreen}
  bind:this={card}
/>

<style>
  .credit-card {
    @media (max-width: 400px) {
      display: none;
    }

    position: absolute;
    width: 240px;
    height: 370px;
    left: 45px;
    top: 780px;
    z-index: 1;
    background-image: url(./assets/creditcard.png);
    cursor: pointer;
    filter: drop-shadow(8px 8px 2px rgba(0, 0, 0, 50%));
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.04);

      &.MP35 {
        top: 820px;
      }
    }

    &.MP35P {
      left: 75px;
    }

    &.MP35 {
      left: 100px;
      top: 840px;
    }

    &.D195 {
      top: 850px;
      left: 130px;
    }

    &.D199 {
      top: 610px;
      left: 35px;
    }

    &.D230 {
      top: 640px;
      left: 55px;
    }

    &.Q60 {
      top: 760px;
      left: 80px;
    }

    &.Q92 {
      top: 730px;
      left: 56px;
    }

    &:not(:hover):not(.is-inserted) {
      filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 50%));
    }

    &.is-dragging {
      z-index: 999999;
      cursor: grabbing;
      transition: all 0.3s ease, top 0s, left 0s;

      &:not(.is-above-screen) {
        filter: drop-shadow(18px 18px 6px rgba(0, 0, 0, 50%));
      }
    }

    &.is-above-screen {
      opacity: 0.8;
      transform: rotateZ(-25deg);
    }

    &.is-inserted {
      transform: translateY(-180px);
    }

    &.is-inserted.MP35 {
      transform: translateY(-270px);
    }
  }
</style>
