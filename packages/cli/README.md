# @mamba/cli

> A CLI to help developing Mamba Applications

## Requirements

* [Node.js](http://nodejs.org/) >= 8.11.3
* POSTools

  > You must have the `.postools` installed and in your shell's `$PATH`

## Recommended

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
  * `mamba app start`
    Starts the development server at `localhost:8080`.

  * `mamba app build`
    Builds the app for the POS.

* `mamba pos <command>`
  * `mamba pos ssh-init [--tty Pos0]` - Initializes the POS SSH server
  * `mamba pos start` - Starts the Mamba System
  * `mamba pos stop` - Kills the Mamba System
  * `mamba pos restart` - Restarts the Mamba System