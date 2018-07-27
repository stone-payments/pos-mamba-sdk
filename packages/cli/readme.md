# @mambasdk/cli

> A CLI to help developing Mamba Applications

## Requirements

* [Node.js](http://nodejs.org/) >= 6.9.x
* POSTools

  > You must have the `.postools` installed and in your shell's `$PATH`

* ssh `config` (`$HOME/.ssh/config`) file with a `POS` host

  ```text
    Host POS
      HostName 127.0.0.1
      Port 51000
      User MAINAPP
      IdentityFile ~/.ssh/id_rsa_pax
   ```

## Commands

* `mamba app <command>`
  * `mamba app deploy`

    Deploys the current app to the POS. It uses the `manifest.xml` **ID** and **displayedName** to create the app directory.

* `mamba pos <command>`
  * `mamba pos ssh-init [--tty Pos0]` - Initializes the POS SSH server
  * `mamba pos start` - Starts the Mamba System
  * `mamba pos stop` - Kills the Mamba System
  * `mamba pos restart` - Restarts the Mamba System