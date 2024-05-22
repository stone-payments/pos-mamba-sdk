#!/bin/bash
# -------------------------------------------------------
#
# This script takes care of initializing the repository,
# copy it to your repository and run it to install
# repo_setup and the hooks common to the repositories.
#
# -------------------------------------------------------

# Log and exit with 1
#
# Usage:
#     log_fatal <string1>
#
# Args:
#     string1 - Message to be printed.
function log_fatal() {
  echo $@
  exit 1
}

# Add a file to gitignore if it not already defined
#
# Usage:
#     add_to_gitignore <string1>
#
# Args:
#     string1 - filepath to be added to .gitignore
function add_to_gitignore() {
  filename=$1

  if grep -Fxq "$filename" .gitignore; then
    echo "$filename already on .gitignore."
  else
    echo "$filename" >>.gitignore
    echo "$filename added to .gitignore."
  fi
}

# Download file from tools folder of repo stone-payments/pos-mamba-sdk/tools
#
# Usage:
#     download_from_tools_on_mamba_sdk <string1> <string2>
#
# Args:
#     string1 - Relative file path on repo to be downloaded.
#     string2 (optional) - Relative folder path on repo to be saved.
#
# Note: string2 is optional, if it is not passed then "." It will be used.
function download_from_tools_on_mamba_sdk() {
  local DOWNLOAD_BASEURL="https://raw.githubusercontent.com/stone-payments/pos-mamba-sdk/master/tools"
  local DOWNLOAD_TO="."

  if [ "$#" -eq 2 ]; then
    DOWNLOAD_TO=$2
  elif [ "$#" -lt 1 ]; then
    log_fatal "Param error: No files were provided"
  fi
  local FILE_TO_DOWNLOAD=$1

  wget -N -P $DOWNLOAD_TO $DOWNLOAD_BASEURL/$FILE_TO_DOWNLOAD
  add_to_gitignore $FILE_TO_DOWNLOAD
}

# Download and install file from tools folder of repo stone-payments/pos-mamba-sdk/tools
#
# Usage:
#     download_and_install <string1> <string2>
#
# Args:
#     string1 - Relative file path on repo to be downloaded.
#     string2 (optional) - Relative folder path on repo to be saved.
#
# Note: string2 is optional, if it is not passed then "." It will be used.
function download_and_install() {
  if [ "$#" -lt 1 ]; then
    log_fatal "Param error: No files were provided"
  fi
  download_from_tools_on_mamba_sdk $@
  chmod +x $(git rev-parse --show-toplevel)/$1
  $(git rev-parse --show-toplevel)/$1
}

download_from_tools_on_mamba_sdk _git_hooks/post-checkout _git_hooks
download_and_install _git_hooks/install-hooks.sh _git_hooks
download_and_install repo_setup.py
