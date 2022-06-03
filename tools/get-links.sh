#!/bin/bash

# This script make possible get all packages links, so you can avoid to do it manually
#
# Options:
# -m, --mode MODE
# Modes: name Or path
# name: The link are made of package name
# path: the link are made by package path
#
# You can run:
# - `yarn run link:name` or  to get the command to link all packages to another project by pakcage name.
# - `yarn run link:path` to get the command to link all packages to another project by package path (only npm +7). This is useful to install linked package dependencies.

LINK_CHAIN="yarn link "
INSTALL_CHAIN="npm link "
PATHS=$(find "$PWD"/packages -type f -name "package.json" \
  -not \( -ipath "*/node_modules/*" -prune \) \
  -not \( -ipath "*/cli/*" -prune \) \
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
    (cd $directory && yarn --silent link)
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

