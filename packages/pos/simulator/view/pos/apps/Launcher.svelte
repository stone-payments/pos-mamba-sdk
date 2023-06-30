<script>
  import { onMount } from 'svelte';
  import { AppManager, System, HardwareManager, Registry } from '../../../index';
  import { warn } from '../../../libs/utils';

  const STATES = {
    LOCKSCREEN: 0,
    HOME: 1,
    LOADING: 2,
    APP: 3,
  };

  const { hours: initHours, minutes: initMinutes } = System.getCurrentTime();
  const { displayName } = Registry.persistent.get().$Merchant;

  let STATE = STATES.LOCKSCREEN;
  let time = `${initHours}:${initMinutes}`;
  let apps = { ...AppManager.getInstalledApps() };

  const APP_INDEXES = [
    'payment',
    'cancellation',
    'calculator',
    'reprint',
    'reports',
    'closing',
    'settings',
    'help',
  ].reduce((acc, name, index) => {
    acc[name] = index;
    return acc;
  }, {});

  function openApp(appMeta, options) {
    STATE = STATES.APP;
    AppManager.open(appMeta.manifest.slug, options);
  }

  function openPaymentApp() {
    if (apps['1-payment']) {
      openApp(apps['1-payment'], { openMode: 'detection' });
    } else {
      // TODO: fake payment app
      warn("Should open payment app but it's not installed\nTODO: placeholder payment app.");
    }
  }
  function gotoLockscreen() {
    STATE = STATES.LOCKSCREEN;
    document.title = 'MambaWeb - Lockscreen';
  }
  function gotoHome() {
    STATE = STATES.HOME;
    document.title = 'MambaWeb - Home';
  }

  onMount(() => {
    /** Update the clock after each second */
    System.on('clock', (newHours, newMinutes) => {
      time = `${newHours}:${newMinutes}`;
    });

    /** Listen to an app being opened and guarantee the Launcher is ready to open it */
    AppManager.on('loading', () => {
      // TODO: ADD Dialog ref
      // this.refs.loadingDialog.open();
    });

    AppManager.on('opening', () => {
      if (STATE !== STATES.APP) {
        STATE = STATES.APP;
      }

      // TODO: ADD Dialog ref
      // this.refs.loadingDialog.close(100);
    });

    AppManager.on('closed', () => {
      if (AppManager.getOpenedApps().length === 0) {
        window.history.pushState('', document.title, window.location.pathname);
        gotoHome();
      }
    });

    AppManager.on('appInstalled', () => {
      apps = { ...AppManager.getInstalledApps() };
    });

    HardwareManager.on('cardInserted', () => {
      if (STATE !== STATES.APP) {
        openPaymentApp();
      }
    });
  });

  $: appsList = Object.values(apps).reduce((acc, app) => {
    const { name } = app.manifest;
    if (typeof APP_INDEXES[name] !== 'undefined') {
      acc.splice(APP_INDEXES[name], 0, app);
    } else {
      acc.push(app);
    }
    return acc;
  }, []);
</script>

<!-- TODO: add Dialog from @mamba/jade -->
<!-- <Dialog ref:loadingDialog fullscreen>
TODO: add LoadingSprite from @mamba/jade
  <LoadingSprite />
</Dialog> -->

{#if STATE === STATES.APP}
  <div id="apps-container" class="hide-scrollbars" />
{:else}
  <div class="launcher hide-scrollbars">
    {#if STATE === STATES.LOCKSCREEN}
      <div class="lockscreen">
        <time>{time}</time>
        <div class="merchant">{displayName}</div>
        <div class="actions" />

        <button class="full" on:click={() => gotoHome()} shortcut="enter"> HOME </button>
        <!-- TODO: add button from @mamba/jade -->
        <!-- <Button size="full" bottom on:click={() => gotoHome()} shortcut="enter">
          <Icon symbol="home" color="#fff" />
        </Button> -->
      </div>

      <!-- TODO: add Keystroke from @mamba/jade -->
      <!-- <Keystroke key="enter" on:keystroke={() => gotoHome()} /> -->
    {/if}

    {#if STATE === STATES.HOME}
      <div class="home">
        {#each appsList as app}
          <div class="app-item" on:click={() => openApp(app)}>
            <div class="content">
              <div class="icon">
                <img src={app.manifest.icon} alt={app.manifest.name} />
              </div>
              <div class="title">
                {app.manifest.appName}
              </div>
            </div>
          </div>
        {/each}
      </div>

      <!-- TODO: add Keystroke from @mamba/jade -->
      <!-- <Keystroke key="back" on:keystroke="gotoLockscreen()" /> -->
      <!-- TODO: add Keystroke from @mamba/jade -->
      <!-- <Keystroke key="close" on:keystroke="gotoLockscreen()" /> -->
      <!-- TODO: add Keystroke from @mamba/jade -->
      <!-- <Keystroke key="enter" on:keystroke="gotoLockscreen()" /> -->
    {/if}
  </div>
{/if}

<style>
  :global(#apps-container) {
    height: 100%;
    position: relative;
  }

  :global(.mamba-app-container) {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    &.is-suspended {
      display: none;
    }

    @media (min-width: 401px) {
      overflow: auto;
    }
  }

  :global(.force-remove-simulator-pos .mamba-app-container) {
    overflow: auto;
  }

  .launcher {
    height: 100%;
    overflow: auto;
  }

  .lockscreen,
  .home {
    min-height: 100%;
    background-color: #fff;
  }

  .lockscreen {
    text-align: center;
    overflow: hidden;
    padding: 0 10px;
  }

  time {
    color: $neutral500;
    display: block;
    margin-top: 35px;
    font-size: 64px;
  }

  .merchant {
    color: black;
    line-height: 1.2;
    font-size: 22px;
    margin: 8px 0 20px;
  }

  .home {
    padding: 5px;
    background-color: $neutral300;
    font-size: 0;
  }

  .app-item {
    cursor: pointer;
    position: relative;
    width: 50%;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    padding: 5px;
    background-color: white;
    background-clip: content-box;

    &::before {
      content: '';
      display: block;
      width: 100%;
      padding-bottom: 100%;
    }

    .content {
      position: absolute;
      width: 100%;
      padding: 0 5px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 12px;
      font-weight: bold;

      .icon {
        width: 50px;
        height: 50px;
        margin: 0 auto;

        img {
          width: 100%;
          height: auto;
        }
      }
    }

    .title {
      margin-top: 5px;
    }
  }
</style>
