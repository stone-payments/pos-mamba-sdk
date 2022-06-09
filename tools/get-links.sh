#!/bin/bash

# !! This script is NOT meant to be used directly !!
#
# This script is meant to make it easy to locally link any project to all SDK packages built on this repo, generating the commands automatically (so you can avoid doing it manually).
#
# USAGE:
#
# On the "pos-mamba-sdk" repo folder:
# - `yarn run link:name` outputs the command (using yarn) to link all of this repo's packages to the target project, by package name.
# - `yarn run link:path` outputs the command (only npm +7) to link all of this repo's packages to the target project, by package path.
#
# The output commands are meant to be copied and executed directly on the target project's folder.
#
#
# Script options:
# -m, --mode MODE
#
# Modes: name OR path
# name: The links are made by package name
# path: The link are made by package path
#

LINK_CHAIN="yarn link "
INSTALL_CHAIN="npm link "
PATHS=$(find "$PWD"/packages -type f -name "package.json" \
  -not \( -ipath "*/node_modules/*" -prune \) \
  -not \( -ipath "*/cli/*" -prune \) \
  -not \( -ipath "*/docs/*" -prune \) \
  -not \( -ipath "*/logger/*" -prune \) \
  -not \( -ipath "*/.git/*" -prune \))

exitError() {
  echo $'\n\e[31m'"Must need specify the mode. Should be 'name' Or 'path'"
  echo -e "-m, --mode MODE${normal}\n"
  exit 1
}

case "$1" in
  -m|--mode)
  case "$2" in
    name|path)
      export mode=$2
      ;;
    *)
      exitError
      ;;
  esac
  ;;
  *) exitError ;;
esac


if [ -z "$mode" ]; then
  exitError
fi

for file in $PATHS; do
  package_name=$(awk -F'\"' '/\"name\": \".+\"/{ print $4; exit; }' "$file")
  directory=${file%/*}
  if [[ "$mode" == "name" ]]; then
    echo $'\e[32m'"⛓ Linking $package_name"$'\e[0m'
    (cd $directory && yarn unlink && yarn --silent link)
    LINK_CHAIN+="$package_name "
  else
    INSTALL_CHAIN+="$directory "
  fi
done

echo $'\n\e[1;37m'"Copy below to link to another project:"
echo $'\e[33m'

if [[ "$mode" == "name" ]]; then
  echo $LINK_CHAIN$'\n\e[0m'
else
  echo $INSTALL_CHAIN$'\n\e[0m'
fi

