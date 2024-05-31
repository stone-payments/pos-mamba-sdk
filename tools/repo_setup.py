#! /usr/bin/env python3
#
# Script to CLONE or UPDATE all "submodules" listed in "repo_settings.json"
#
# The repository can have target as version, a minimal version or branch.
# The priority order is "version" > "minimal_version" > "branch".
# The "minimal_version" option searches for the higher version tag available (semantic) with same major of given in "minimal_version".

import json
import subprocess
import os
import sys
import platform
import concurrent.futures
import argparse

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


def run_command(cmd, stealth=False):
    if stealth == True:
        return subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    else:
        print(f"Running {cmd}")
        return subprocess.run(cmd, stderr=subprocess.PIPE)


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

    def __init__(self, clone_type: str):
        self.clone_type = PosMambaRepoSetup.CloneType.get_by_value(clone_type)

    def update_repo(self, submodule):
        # Get the absolute path of the script
        script_dir = os.path.dirname(os.path.abspath(__file__))

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

        _repo_url: str = submodule["url"]
        _path = submodule["path"]
        _version = submodule.get("version")
        _minimal_version = submodule.get("minimal_version")
        _branch = submodule.get("branch")
        target = None
        target_type = "tag"

        if self.clone_type == PosMambaRepoSetup.CloneType.HTTPS:
            _repo_url = _repo_url.replace("git@github.com:", "https://github.com/")

        # Change the current working directory to the script directory
        os.chdir(script_dir)

        # Checking if the repository already exists
        if not os.path.exists(_path):
            print(f"{BLUE}Initalizing submodule {_path}{NC}")
            result = run_command(["git", "clone", "--no-checkout", _repo_url, _path])
            if result.returncode != 0:
                print(f"Git clone failed on {_path}")
                return
        else:
            print(f"{BLUE}Updating submodule {_path}{NC}")

        path_to_run = os.path.join(sys.path[0], _path)
        # Changing to the repository directory
        os.chdir(path_to_run)

        if _version:
            target = _version
        elif _minimal_version:
            target = get_latest_same_major(
                get_sorted_releases(path_to_run), _minimal_version
            )
        elif _branch:
            target = _branch
            target_type = "branch"
        else:
            print(
                "ERROR: No version, minimum_version, or branch was specified for the repository"
            )
            return

        exec_count = 0
        while exec_count < 3:
            result = run_command(["git", "fetch", "origin", target, "--force"])

            local_commit = subprocess.check_output(["git", "rev-parse", "HEAD"]).strip()
            target_commit = subprocess.check_output(
                ["git", "rev-parse", target]
            ).strip()

            # Compare os commits
            if local_commit != target_commit:
                if result.returncode == 0:
                    if target_type == "tag":
                        result = run_command(["git", "checkout", target, "--force"])
                    elif target_type == "branch":
                        result = run_command(
                            [
                                "git",
                                "checkout",
                                "-B",
                                _branch,
                                f"origin/{_branch}",
                                "--force",
                            ]
                        )
                        if result.returncode == 0:
                            run_command(["git", "reset", "--hard", f"origin/{_branch}"])
                            result = run_command(
                                ["git", "pull", "--depth", "1", "--force"]
                            )

                if result.returncode == 0:
                    print(
                        f"{GREEN}Repo {_path} updated with {target_type} {target} successfully!"
                    )
                    add_to_gitignore(_path)
                    break
                else:
                    print(
                        f"{RED} Repo {_path} update attempt with {target_type} {target} FAILED!"
                    )
            else:
                print(
                    f"{GREEN}Repo {_path} is already updated with {target_type} {target}!"
                )
                break

            exec_count += 1


def main():
    parser = argparse.ArgumentParser(description="Repo Setup Script")
    parser.add_argument(
        "--clone_type",
        "-c",
        type=str,
        choices=["ssh", "https"],
        default="ssh",
        help="Set clone type",
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

    # Reading the parameters from the JSON file
    with open("repo_settings.json", "r") as f:
        repo_settings = json.load(f)

    submodules = repo_settings["submodules"]

    run_command(["git", "config", "--global", "advice.detachedHead", "false"])

    if repo_list:
        filtered_submodules = []
        for string1 in repo_list:
            for submodule in submodules:
                if string1.lower() in submodule["path"].lower():
                    filtered_submodules.append(submodule)

        submodules = filtered_submodules

    repo_setup = PosMambaRepoSetup(args.clone_type)

    max_workers = 2 if args.clone_type == "https" else None

    # Create a pool of workers
    with concurrent.futures.ProcessPoolExecutor(max_workers=max_workers) as executor:
        # Use the executor to map the function to the inputs
        executor.map(repo_setup.update_repo, submodules)


if __name__ == "__main__":
    main()
