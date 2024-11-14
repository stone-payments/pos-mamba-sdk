#!/bin/bash
# -------------------------------------------------------
#
# This script takes care of initializing the repository,
# copy it to your repository and run it to install
# repo_setup and the hooks common to the repositories.
#
# Optional args:
#
# --no-hooks:          Don't download and install hooks
# --no-repo-setup-run: Don't run repo_setup.py
# -------------------------------------------------------

GITHUB_REPO="stone-payments/pos-mamba-sdk"
GITHUB_BRANCH="master"

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

  if ! grep -Fxq "$filename" .gitignore; then
    echo "$filename" >> .gitignore
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
  local DOWNLOAD_BASEURL="https://raw.githubusercontent.com/$GITHUB_REPO/$GITHUB_BRANCH/tools"
  local DOWNLOAD_TO="."

  if [ "$#" -eq 2 ]; then
    DOWNLOAD_TO=$2
  elif [ "$#" -lt 1 ]; then
    log_fatal "Param error: No files were provided"
  fi
  local FILE_TO_DOWNLOAD=$1

  [ -d "$DOWNLOAD_TO" ] || mkdir -p "$DOWNLOAD_TO"

  wget -nv -P $DOWNLOAD_TO -O $FILE_TO_DOWNLOAD $DOWNLOAD_BASEURL/$FILE_TO_DOWNLOAD
  add_to_gitignore $FILE_TO_DOWNLOAD
}

# Run file from tools folder of repo stone-payments/pos-mamba-sdk/tools
#
# Usage:
#     run_file <string1>
#
# Args:
#     string1 - File path to run.
#
# Note: string2 is optional, if it is not passed then "." It will be used.
function run_file() {
  if [ "$#" -lt 1 ]; then
    log_fatal "Param error: No files were provided"
  fi
  chmod +x $(git rev-parse --show-toplevel)/$1
  $(git rev-parse --show-toplevel)/$1
}

# Download and run file from tools folder of repo stone-payments/pos-mamba-sdk/tools
#
# Usage:
#     download_and_run <string1> <string2>
#
# Args:
#     string1 - Relative file path on repo to be downloaded.
#     string2 (optional) - Relative folder path on repo to be saved.
#
# Note: string2 is optional, if it is not passed then "." It will be used.
function download_and_run() {
  if [ "$#" -lt 1 ]; then
    log_fatal "Param error: No files were provided"
  fi
  download_from_tools_on_mamba_sdk $@
  run_file $1
}

# Get commit hash by branch on sdk repo
#
# Usage:
#     get_commit_hash_from_branch
function get_commit_hash_from_branch() {
  COMMIT_INFO=$(curl -s "https://api.github.com/repos/$GITHUB_REPO/commits?sha=$GITHUB_BRANCH")
  COMMIT_HASH=$(echo $COMMIT_INFO | jq -r '.[0].sha')
  echo $COMMIT_HASH
}

# All repo_setup stuff
function repo_setup_init() {
  repo_setup_file="repo_setup.py"

  download_from_tools_on_mamba_sdk $repo_setup_file

  if [[ "$@" != *"--no-repo-setup-run"* ]]; then
    commit_hash=$(get_commit_hash_from_branch)
    echo $commit_hash
    sed -i "s/REPO_SETUP_PLACEHOLDER/$commit_hash/g" $repo_setup_file
    run_file repo_setup.py
  fi
}

if [[ "$@" != *"--no-hooks"* ]]; then
  download_from_tools_on_mamba_sdk _git_hooks/post-checkout _git_hooks
  download_and_run _git_hooks/install-hooks.sh _git_hooks
fi

repo_setup_init $@
