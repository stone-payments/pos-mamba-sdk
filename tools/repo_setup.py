#! /usr/bin/env python3
#
# Script to CLONE or UPDATE all "submodules" listed in "repo_settings.json"
#
# The repository can have target as version, a minimal version or branch.
# The priority order is "version" > "minimal_version" > "branch".
# The "minimal_version" option searches for the higher version tag available (semantic) with same major of given in "minimal_version".

import json
import shutil
import subprocess
import os
import sys
import platform
import concurrent.futures
import argparse
import requests

# ansi escape codes "color"
# https://stackoverflow.com/questions/5947742/how-to-change-the-output-color-of-echo-in-linux
BLACK = "\033[0;30m"
DGRAY = "\033[1;30m"
RED = "\033[0;31m"
LRED = "\033[1;31m"
GREEN = "\033[0;32m"
LGREEN = "\033[1;32m"
BROWN = "\033[0;33m"
YELLOW = "\033[1;33m"
BLUE = "\033[0;34m"
LBLUE = "\033[1;34m"
PURPLE = "\033[0;35m"
LPURPLE = "\033[1;35m"
CYAN = "\033[0;36m"
LCYAN = "\033[1;36m"
LGRAY = "\033[0;37m"
WHITE = "\033[1;37m"
NC = "\033[0m"


def print_color(message, color):
    print(f"{color}{message}{NC}")


def print_warning(message):
    print_color(message, YELLOW)


def print_error(message):
    print_color(message, RED)


def install_dependencies():
    def install_package(package):
        try:
            dist = distribution(package)
            # print('{} ({}) is installed'.format(dist.metadata['Name'], dist.version))
        except PackageNotFoundError:
            print("{} is NOT installed. Installing now...".format(package))
            subprocess.call([sys.executable, "-m", "pip", "install", package])

    python_version = platform.python_version()
    if python_version == "3.6.9":
        subprocess.check_call(
            [sys.executable, "-m", "pip", "install", "importlib_metadata"]
        )
        from importlib_metadata import distribution, PackageNotFoundError
    else:
        from importlib.metadata import distribution, PackageNotFoundError

    install_package("packaging")


def get_sorted_releases(path_to_run):
    from packaging import version

    command_list = ["git", "ls-remote", "--tags"]

    output = subprocess.check_output(command_list, cwd=path_to_run).decode()
    versions = [line.split("/")[-1] for line in output.split("\n") if line]
    versions = [v for v in versions if version.parse(v).is_devrelease == False]
    versions.sort(key=version.parse)

    return versions


def get_latest_same_major(versions, base_version):
    from packaging import version

    base_major = version.parse(base_version).major
    same_major_versions = [v for v in versions if version.parse(v).major == base_major]

    if not same_major_versions:
        return None

    return max(same_major_versions, key=version.parse)


class PosMambaRepoSetup:
    from enum import Enum

    class CloneType(Enum):
        SSH = "ssh"
        HTTPS = "https"

        @staticmethod
        def value_list():
            return list(map(lambda x: x.value, PosMambaRepoSetup.CloneType))

        @staticmethod
        def get_by_value(value):
            for member in PosMambaRepoSetup.CloneType:
                if member.value == value:
                    return member
            return None

    def __init__(self, clone_type: str, force: bool = False, log=False):
        self.clone_type = PosMambaRepoSetup.CloneType.get_by_value(clone_type)
        self.force = force
        self.log = log

    def run_command(self, cmd, repo=None):
        if self.log == True:
            print_color(f"{repo} | Running {cmd}", CYAN)
            return subprocess.run(cmd, stderr=subprocess.PIPE)
        else:
            return subprocess.run(
                cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
            )

    def update_repo(self, submodule):
        # Get the absolute path of the script
        script_dir = os.path.dirname(os.path.abspath(__file__))
        message_check = "Check your settings on repo_settings.json"

        def add_to_gitignore(filename):
            """
            Add a file to gitignore if it not already defined

            Usage:
                add_to_gitignore(filename)

            Args:
                filename: filepath to be added to .gitignore
            """
            with open(os.path.join(script_dir, ".gitignore"), "a+") as gitignore:
                gitignore.seek(0)
                lines = gitignore.readlines()
                if filename + "\n" not in lines:
                    gitignore.write(filename + "\n")
                    print(f"{filename} added to .gitignore.")

        def remove_repo(path):
            if self.force or self.clone_type == PosMambaRepoSetup.CloneType.HTTPS:
                os.chdir(script_dir)
                print_warning(f"Removing {path} to try again...")
                shutil.rmtree(os.path.join(script_dir, path))
            else:
                print_warning(
                    f"Re-run repo_setup.py with -f param to fix this or remove {path} submodule dir..."
                )

        _repo_url: str = submodule["url"]
        _path = submodule["path"]
        _version = submodule.get("version")
        _minimal_version = submodule.get("minimal_version")
        _branch = submodule.get("branch")
        target = None
        target_type = "tag"

        if self.clone_type == PosMambaRepoSetup.CloneType.HTTPS:
            _repo_url = _repo_url.replace("git@github.com:", "https://github.com/")

        exec_count = 0
        while exec_count < 3:
            # Change the current working directory to the script directory
            os.chdir(script_dir)

            # Checking if the repository already exists
            if not os.path.exists(_path):
                print_color(f"Initalizing submodule {_path}", BLUE)
                result = self.run_command(
                    ["git", "clone", "--no-checkout", _repo_url, _path], _path
                )
                if result.returncode != 0:
                    print_error(f"Git clone failed on {_path}")
                    return
            else:
                print_color(f"Updating submodule {_path}", BLUE)

            path_to_run = os.path.join(script_dir, _path)
            # Changing to the repository directory
            os.chdir(path_to_run)

            if not os.path.exists(os.path.join(path_to_run, ".git")):
                print_warning(f".git not found on {_path}")
                remove_repo(_path)
                exec_count += 1
                continue

            if _version:
                target = _version
            elif _minimal_version:
                target = get_latest_same_major(
                    get_sorted_releases(path_to_run), _minimal_version
                )
                if target is None:
                    print_error(
                        f"Minimal version {_minimal_version} not found on {_path}! {message_check}"
                    )
                    exit(1)
            elif _branch:
                target = _branch
                target_type = "branch"
            else:
                print_error(
                    f"ERROR: No version, minimum_version, or branch was specified for the repository: {_path}"
                )
                return

            fetch_command = ["git", "fetch", "origin"]
            #if target_type == "tag":
            #    fetch_command += ["tag"]
            #fetch_command += [target, "--force"]
            result = self.run_command(fetch_command, _path)

            if result.returncode == 0:
                if target_type == "tag":
                    result = self.run_command(["git", "checkout", target, "--force"], _path)
                elif target_type == "branch":
                    result = self.run_command(
                        [
                            "git",
                            "checkout",
                            "-B",
                            _branch,
                            f"origin/{_branch}",
                            "--force",
                        ], _path
                    )
                    if result.returncode == 0:
                        self.run_command(
                            ["git", "reset", "--hard", f"origin/{_branch}"], _path
                        )
                        result = self.run_command(
                            ["git", "pull", "--force"], _path
                        )

                if result.returncode == 0:
                    print_color(
                        f"Repo {_path} updated with {target_type} {target} successfully!",
                        GREEN,
                    )
                    add_to_gitignore(_path)
                    break
                else:
                    print_error(
                        f"Repo {_path} update attempt with {target_type} {target} FAILED!"
                    )
                    remove_repo(_path)
            else:
                print_error(
                    f"Failed to fetch {target_type} {target} on {_path}! {message_check}"
                )

            exec_count += 1


def main():
    def get_latest_sdk_commit() -> str:
        url = f"https://api.github.com/repos/stone-payments/pos-mamba-sdk/commits"
        response = requests.get(url)
        data = json.loads(response.text)
        return data[0]['sha']

    parser = argparse.ArgumentParser(description="Repo Setup Script")
    parser.add_argument(
        "--force",
        "-f",
        action="store_true",
        default=False,
        help="Force to remove submodule path if update fails",
    )

    parser.add_argument(
        "--clone_type",
        "-c",
        type=str,
        choices=["ssh", "https"],
        default="ssh",
        help="Set clone type",
    )

    parser.add_argument(
        "--log",
        "-l",
        action="store_true",
        default=False,
        help="Set log enabled/disabled",
    )

    parser.add_argument(
        "repo_list",
        help="Repositories to be updated. If nothing is provided then all repositories will be updated",
        nargs="*",
        default=[],
    )

    args = parser.parse_args()
    repo_list = args.repo_list

    install_dependencies()
    repo_setup_commit:str = "REPO_SETUP_PLACEHOLDER"
    sdk_commit = get_latest_sdk_commit()

    if sdk_commit.lower() == repo_setup_commit.lower():
        with open("repo_settings.json", "r") as f:
            repo_settings = json.load(f)

        submodules = repo_settings["submodules"]

        repo_setup = PosMambaRepoSetup(
            clone_type=args.clone_type, force=args.force, log=args.log
        )
        repo_setup.run_command(
            ["git", "config", "--global", "advice.detachedHead", "false"]
        )

        if repo_list:
            filtered_submodules = []
            for string1 in repo_list:
                for submodule in submodules:
                    if string1.lower() in submodule["path"].lower():
                        filtered_submodules.append(submodule)

            submodules = filtered_submodules

        # Create a pool of workers
        with concurrent.futures.ProcessPoolExecutor() as executor:
            # Use the executor to map the function to the inputs
            executor.map(repo_setup.update_repo, submodules)
    else:
        print_warning("repo_setup is outdated!!! Runnig repo_initialization!")
        print_warning(f"Local repo_setup hash: {repo_setup_commit}")
        print_warning(f"Remote sdk master hash: {sdk_commit}")
        subprocess.Popen(["wget -O - https://raw.githubusercontent.com/stone-payments/pos-mamba-sdk/master/tools/repo_initialization.sh | bash"], shell=True)

if __name__ == "__main__":
    main()
