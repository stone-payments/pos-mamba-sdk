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
    install_package("requests")


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

    repo_settings_file_name = "repo_settings.json"
    clone_type = CloneType.SSH
    force = False
    log = False

    # Get the absolute path of the script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    message_check = "Check your settings on repo_settings.json"

    def __init__(self, clone_type: str, force: bool = False, log=False):
        self.clone_type = PosMambaRepoSetup.CloneType.get_by_value(clone_type)
        self.force = force
        self.log = log

    @classmethod
    def run_command(cls, cmd, repo="Repo not passed"):
        if cls.log == True:
            print_color(f"{repo} | Running {cmd}", CYAN)
            return subprocess.run(cmd, stderr=subprocess.PIPE)
        else:
            return subprocess.run(
                cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
            )

    @classmethod
    def remove_repo(cls, path):
        if cls.force or cls.clone_type == PosMambaRepoSetup.CloneType.HTTPS:
            os.chdir(cls.script_dir)
            print_warning(f"Removing {path} to try again...")
            shutil.rmtree(path)
        else:
            print_warning(
                f"Re-run repo_setup.py with -f param to fix this or remove {path} submodule dir..."
            )

    def checkout_and_pull(self, path, target_type, target, repo_cloned=True) -> bool:
        def add_to_gitignore(filename):
            """
            Add a file to gitignore if it not already defined

            Usage:
                add_to_gitignore(filename)

            Args:
                filename: filepath to be added to .gitignore
            """
            with open(os.path.join(self.script_dir, ".gitignore"), "a+") as gitignore:
                gitignore.seek(0)
                lines = gitignore.readlines()
                if filename + "\n" not in lines:
                    gitignore.write(filename + "\n")
                    print(f"{filename} added to .gitignore.")

        # Changing to the repository directory
        full_repo_path = os.path.join(self.script_dir, path)
        os.chdir(full_repo_path)

        stash_applied = False
        if not repo_cloned:
            status_output = subprocess.check_output(
                ["git", "status", "--porcelain"]
            ).decode("utf-8")
            if status_output:
                _result = self.run_command(
                    [
                        "git",
                        "stash",
                        "push",
                        "-m",
                        '"STASHED BY REPO_SETUP.PY"',
                        "--include-untracked",
                    ],
                    path,
                )
                if _result.returncode == 0:
                    stash_applied = True

        fetch_command = ["git", "fetch", "origin"]
        result = self.run_command(fetch_command, path)

        if result.returncode == 0:
            if target_type == "tag":
                result = self.run_command(["git", "checkout", target, "--force"], path)
            elif target_type == "branch":
                result = self.run_command(
                    [
                        "git",
                        "checkout",
                        "-B",
                        target,
                        f"origin/{target}",
                        "--force",
                    ],
                    path,
                )
                if result.returncode == 0:
                    self.run_command(
                        ["git", "reset", "--hard", f"origin/{target}"], path
                    )
                    result = self.run_command(["git", "pull", "--force"], path)

            if result.returncode == 0:
                if stash_applied:
                    _result = self.run_command(["git", "stash", "pop"], path)
                    if _result.returncode:
                        print_error("Error applying stash")

                print_color(
                    f"Repo {path} updated with {target_type} {target} successfully!",
                    GREEN,
                )
                add_to_gitignore(path)
                return True
            else:
                print_error(
                    f"Repo {path} update attempt with {target_type} {target} FAILED!"
                )
                self.remove_repo(path)
        else:
            print_error(
                f"Failed to fetch {target_type} {target} on {path}! {self.message_check}"
            )

        return False

    @classmethod
    def repo_initialized(cls, full_repo_path: str) -> bool:
        if os.path.exists(full_repo_path) and os.path.exists(
            os.path.join(full_repo_path, ".git")
        ):
            return True

        return False

    @staticmethod
    def get_target_of_submodule(submodule, full_repo_path=None) -> str:
        def get_latest_same_major(versions, base_version):
            from packaging import version

            base_major = version.parse(base_version).major
            same_major_versions = [
                v for v in versions if version.parse(v).major == base_major
            ]

            if not same_major_versions:
                return None

            return max(same_major_versions, key=version.parse)

        def get_sorted_releases(path_to_run):
            from packaging import version

            command_list = ["git", "ls-remote", "--tags"]

            output = subprocess.check_output(command_list, cwd=path_to_run).decode()
            versions = [line.split("/")[-1] for line in output.split("\n") if line]
            versions = [v for v in versions if version.parse(v).is_devrelease == False]
            versions.sort(key=version.parse)

            return versions

        version = submodule.get("version")
        minimal_version = submodule.get("minimal_version")
        branch = submodule.get("branch")
        path = submodule["path"]
        target = "none"

        if PosMambaRepoSetup.repo_initialized(full_repo_path):
            if branch:
                target = branch
            elif minimal_version:
                target = get_latest_same_major(
                    get_sorted_releases(full_repo_path), minimal_version
                )
                if target is None:
                    print_error(
                        f"Minimal version {minimal_version} not found on {path}! {PosMambaRepoSetup.message_check}"
                    )
                    exit(1)
            elif version:
                target = version
            else:
                print_error(
                    f"ERROR: No version, minimum_version, or branch was specified for the repository: {path}"
                )
                exit(1)

        return target

    @staticmethod
    def get_info_by_submodule(submodule, full_repo_path=None) -> tuple:

        repo_url: str = submodule["url"]
        path = submodule["path"]
        version = submodule.get("version")
        minimal_version = submodule.get("minimal_version")
        branch = submodule.get("branch")
        target_type = "tag"

        full_repo_path = (
            os.path.join(PosMambaRepoSetup.script_dir, path)
            if not full_repo_path
            else full_repo_path
        )

        if version or minimal_version:
            target_type = "tag"
        elif branch:
            target_type = "branch"
        else:
            print_error(
                f"ERROR: No version, minimum_version, or branch was specified for the repository: {path}"
            )
            return None

        return repo_url, path, target_type

    @classmethod
    def init_repository(cls, repo_url, full_repo_path) -> tuple:
        repo_cloned = False
        repo_error = False
        path_parts = full_repo_path.split(os.sep)
        repo_name = os.path.join(path_parts[-2], path_parts[-1])

        if cls.repo_initialized(full_repo_path):
            print_color(f"Updating submodule {repo_name}", BLUE)
        elif os.path.exists(os.path.join(full_repo_path)) and not os.path.exists(
            os.path.join(full_repo_path, ".git")
        ):
            print_warning(f".git not found on {repo_name}")
            cls.remove_repo(full_repo_path)
            repo_error = True
        else:
            print_color(f"Initalizing submodule {repo_name}", BLUE)
            result = cls.run_command(
                ["git", "clone", "--no-checkout", repo_url, full_repo_path],
                repo_name,
            )
            if result.returncode != 0:
                print_error(f"Git clone failed on {full_repo_path}")
            else:
                repo_cloned = True

        return repo_cloned, repo_error

    def update_repo(self, submodule):
        submodule_info = self.get_info_by_submodule(submodule)

        if submodule_info:
            repo_url, path, target_type = submodule_info

            if self.clone_type == self.CloneType.HTTPS:
                repo_url = repo_url.replace("git@github.com:", "https://github.com/")

            exec_count = 0
            while exec_count < 3:
                # Change the current working directory to the script directory
                os.chdir(self.script_dir)
                full_repo_path = os.path.join(self.script_dir, path)

                repo_cloned, repo_error = self.init_repository(repo_url, full_repo_path)

                if not repo_error:
                    target = self.get_target_of_submodule(submodule, full_repo_path)
                    if self.checkout_and_pull(path, target_type, target, repo_cloned):
                        break
                else:
                    break

                exec_count += 1
        else:
            print_error("Error loading submodule info")


def main():
    def get_latest_sdk_commit() -> str:
        import requests

        url = f"https://api.github.com/repos/stone-payments/pos-mamba-sdk/commits"
        response = requests.get(url)
        data = json.loads(response.text)
        if isinstance(data, list) and len(data) > 0 and "sha" in data[0]:
            return data[0]["sha"]

        return None

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

    parser.add_argument(
        "--bypass_auto_update",
        "-u",
        action="store_true",
        default=False,
        help="Bypass auto update of repo_setup.py",
    )

    args = parser.parse_args()
    repo_list = args.repo_list

    install_dependencies()
    repo_setup_commit: str = "REPO_SETUP_PLACEHOLDER"
    sdk_commit = get_latest_sdk_commit()
    bypass_auto_update = args.bypass_auto_update

    if bypass_auto_update or (
        PosMambaRepoSetup.CloneType.get_by_value(args.clone_type)
        == PosMambaRepoSetup.CloneType.HTTPS
        or not sdk_commit
        or sdk_commit.lower() == repo_setup_commit.lower()
    ):
        with open(PosMambaRepoSetup.repo_settings_file_name, "r") as f:
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
            for repo in repo_list:
                for submodule in submodules:
                    if repo.lower() in submodule["path"].lower():
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
        subprocess.run(
            "wget -O - https://raw.githubusercontent.com/stone-payments/pos-mamba-sdk/master/tools/repo_initialization.sh -q -O - | bash",
            shell=True,
        )


if __name__ == "__main__":
    main()
