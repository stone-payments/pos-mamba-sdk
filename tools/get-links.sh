#!/bin/bash

WORKING_DIR=$PWD
LINK_CHAIN="yarn link "
PATHS=$(find "$PWD"/packages -type f -name "package.json" \
  -not \( -ipath "*/node_modules/*" -prune \) \
  -not \( -ipath "*/cli/*" -prune \) \
  -not \( -ipath "*/logger/*" -prune \) \
  -not \( -ipath "*/.git/*" -prune \))

for file in $PATHS; do
  package_name=$(awk -F'\"' '/\"name\": \".+\"/{ print $4; exit; }' "$file")
  directory=${file%/*}
  echo $'\e[32m'"⛓ Linking $package_name"$'\e[0m'
  (cd $directory && yarn --silent link)
  LINK_CHAIN+="$package_name "
done

echo $'\n\e[1;37m'"Copy below to link to another project:"
echo $'\e[33m'
echo $LINK_CHAIN$'\n\e[0m'
