#!/bin/bash

SCRIPT_NAME="$(basename "$0")"
HOOKS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

INSTALL_DIR="$HOOKS_DIR/../.git/hooks"

for hook_file in "$HOOKS_DIR"/*; do
  hook_name=$(basename "$hook_file")

    if [ "$hook_name" != "$SCRIPT_NAME" ]; then
        install_path="$INSTALL_DIR/$hook_name"

        cp "$hook_file" "$install_path"

        chmod +x "$install_path"
        echo "Hook '$hook_name' instalado com sucesso!"
    fi
done
