#! /usr/bin/env python3
"""Repo setup script for cloning/updating submodules and archives."""

import json
import shutil
import subprocess
import os
import sys
import platform
import concurrent.futures
import argparse
import tarfile
import configparser
import tempfile
import re
from typing import Optional

# ---- Configuration constants ----
GITHUB_TOKEN_ENV = "GITHUB_TOKEN"
GITHUB_TOKEN_FILE = ".github_token.json"
GITHUB_API_BASE = "https://api.github.com"
GITHUB_RAW_BASE = "https://raw.githubusercontent.com"
# Network request timeout in seconds
DEFAULT_NETWORK_TIMEOUT = 30

# Auto-update configuration constants - DO NOT MODIFY THESE LINES
REPO_SETUP_HASH_PLACEHOLDER: str = "REPO_SETUP_PLACEHOLDER"
REPO_SETUP_SOURCE_REPO: str = "stone-payments/pos-mamba-sdk"
REPO_SETUP_SOURCE_BRANCH: str = "master"

# Current commit hash - this value gets replaced during auto-update
repo_setup_commit: str = REPO_SETUP_HASH_PLACEHOLDER

# ---- Console colors ----
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


def get_github_token(prompt_if_missing: bool = True) -> Optional[str]:
    """Get GitHub token from environment variable or token file.

    Args:
        prompt_if_missing: If True and no token is found, prompts user for input.
                          If False, returns None silently when token is not found.

    Returns:
        GitHub token string if found, None otherwise.

    Note:
        When prompt_if_missing=True and no token is found in environment or file,
        prompts user for input and saves it to ~/.github_token.json for future use.
    """
    token = os.getenv(GITHUB_TOKEN_ENV)
    if token:
        return token

    token_file = os.path.join(os.path.expanduser("~"), GITHUB_TOKEN_FILE)
    token = None
    if os.path.exists(token_file):
        try:
            with open(token_file, "r") as f:
                data = json.load(f)
                token = data.get("github_token", None)
        except Exception:
            pass  # Silently ignore file read errors

    if not token and prompt_if_missing:
        import getpass

        print_warning(
            "GitHub token not found. Create or insert your Classic Token below."
        )
        token = getpass.getpass("GitHub Token: ").strip()
        if token:
            try:
                with open(token_file, "w") as f:
                    json.dump({"github_token": token}, f)
            except Exception as e:
                print_error(f"Error saving token to file: {e}")
        else:
            token = None

    return token


def parse_semantic_version(version_str: str) -> tuple:
    """Parse semantic version string (e.g., '1.2.3-rc1') into comparable tuple.

    Returns a tuple: (major, minor, patch, is_final, prerelease_parts)
    - is_final: True if no prerelease (1.2.3), False if prerelease (1.2.3-rc1)
    - prerelease_parts: list of (prefix, number) tuples parsed from prerelease

    This ensures correct SemVer precedence:
    - 1.2.3 > 1.2.3-rc1 (stable > prerelease)
    - 1.2.3-rc10 > 1.2.3-rc2 (numeric ordering in prerelease)
    """
    # Remove 'v' or 'V' prefix if present
    version_str = version_str.lstrip("vV")

    # Split by dash to separate version from prerelease
    parts = version_str.split("-")
    version_part = parts[0]
    prerelease_str = parts[1] if len(parts) > 1 else ""

    # Parse main version
    try:
        version_numbers = version_part.split(".")
        major = int(version_numbers[0]) if len(version_numbers) > 0 else 0
        minor = int(version_numbers[1]) if len(version_numbers) > 1 else 0
        patch = int(version_numbers[2]) if len(version_numbers) > 2 else 0
    except (ValueError, IndexError):
        # If parsing fails, return high values so invalid versions sort last
        return (999, 999, 999, False, [("zzz", 999)])

    # is_final=True means it's a final release (no prerelease)
    # is_final=False means it's a prerelease
    is_final = not prerelease_str

    # Parse prerelease components (e.g., "rc1.beta2" -> [("rc", 1), ("beta", 2)])
    prerelease_parts = []
    if prerelease_str:
        components = prerelease_str.split(".")
        for component in components:
            # Extract prefix (letters) and suffix (numbers)
            i = 0
            while i < len(component) and not component[i].isdigit():
                i += 1

            if i == 0:
                # Starts with digit
                try:
                    num = int(component)
                    prerelease_parts.append(("", num))
                except ValueError:
                    prerelease_parts.append((component, 0))
            elif i == len(component):
                # Only letters (no numbers)
                prerelease_parts.append((component, 0))
            else:
                # Mixed (e.g., "rc1")
                prefix = component[:i]
                suffix = component[i:]
                try:
                    num = int(suffix)
                    prerelease_parts.append((prefix, num))
                except ValueError:
                    prerelease_parts.append((component, 0))

    return (major, minor, patch, is_final, prerelease_parts)


def install_dependencies(has_github_assets: bool = False):
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

    # Only install PyGithub if github_assets are needed
    if has_github_assets:
        install_package("PyGithub")


def urlopen_with_timeout(url_or_request, timeout: int = DEFAULT_NETWORK_TIMEOUT):
    """Wrapper for urllib.request.urlopen with standardized timeout.

    Args:
        url_or_request: URL string or urllib.request.Request object
        timeout: Timeout in seconds (default: DEFAULT_NETWORK_TIMEOUT)

    Returns:
        Response object from urlopen

    Raises:
        urllib.error.URLError: If the URL cannot be opened
        socket.timeout: If the request times out
    """
    import urllib.request

    return urllib.request.urlopen(url_or_request, timeout=timeout)


class RepoSetup:
    from enum import Enum

    class CloneType(Enum):
        SSH = "ssh"
        HTTPS = "https"

        @staticmethod
        def value_list():
            return list(map(lambda x: x.value, RepoSetup.CloneType))

        @staticmethod
        def get_by_value(value):
            for member in RepoSetup.CloneType:
                if member.value == value:
                    return member
            return None

    repo_settings_file_name = "repo_settings.json"
    clone_type = CloneType.SSH

    # Get the absolute path of the script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    download_dir = os.path.join(script_dir, "output/downloads/artifacts")
    message_check = "Check your settings on repo_settings.json"

    def __init__(self, clone_type: str, force: bool = False, log=False):
        self.clone_type = RepoSetup.CloneType.get_by_value(clone_type)
        self.force = force
        self.log = log

    def run_command(self, cmd, repo="Repo not passed"):
        if self.log == True:
            print_color(f"{repo} | Running {cmd}", CYAN)
            return subprocess.run(cmd, stderr=subprocess.PIPE)
        else:
            return subprocess.run(
                cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
            )

    def remove_repo(self, path):
        if self.force or self.clone_type == RepoSetup.CloneType.HTTPS:
            os.chdir(RepoSetup.script_dir)
            print_warning(f"Removing {path} to try again...")
            shutil.rmtree(path)
        else:
            print_warning(
                f"Re-run repo_setup.py with -f param to fix this or remove {path} submodule dir..."
            )

    def checkout_and_pull(self, path, target_type, target, repo_cloned=True) -> bool:
        def add_to_gitignore(directory_name):
            """
            Add a directory to gitignore if it not already defined

            Usage:
                add_to_gitignore(directory_name)

            Args:
                directory_name: name of the directory to be added to .gitignore
            """
            # Normalize to directory format for root-level paths (e.g., config -> /config/)
            normalized_pattern = f"/{directory_name}/"

            with open(os.path.join(self.script_dir, ".gitignore"), "a+") as gitignore:
                gitignore.seek(0)
                lines = gitignore.readlines()

                # Check for various equivalent patterns that would already ignore this path
                equivalent_patterns = [
                    normalized_pattern + "\n",  # /config/
                    directory_name + "\n",  # config
                    directory_name + "/\n",  # config/
                    "/" + directory_name + "\n",  # /config
                ]

                if not any(pattern in lines for pattern in equivalent_patterns):
                    gitignore.write(normalized_pattern + "\n")
                    print(f"{normalized_pattern} added to .gitignore.")

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

    @staticmethod
    def repo_initialized(full_repo_path: str) -> bool:
        if (
            full_repo_path
            and os.path.exists(full_repo_path)
            and os.path.exists(os.path.join(full_repo_path, ".git"))
        ):
            return True

        return False

    @staticmethod
    def get_target_of_submodule(submodule, full_repo_path: str = None) -> str:
        def get_latest_same_major(versions, base_version):
            base_ver = parse_semantic_version(base_version)
            base_major = base_ver[0]

            same_major_versions = [
                v for v in versions if parse_semantic_version(v)[0] == base_major
            ]

            if not same_major_versions:
                return None

            return max(same_major_versions, key=parse_semantic_version)

        def get_sorted_releases(path_to_run):
            command_list = ["git", "ls-remote", "--tags"]

            output = subprocess.check_output(command_list, cwd=path_to_run).decode()
            versions = [line.split("/")[-1] for line in output.split("\n") if line]
            # Filter out dev releases (simple heuristic: no '-dev' or '.dev')
            versions = [
                v
                for v in versions
                if "-dev" not in v.lower() and ".dev" not in v.lower()
            ]
            versions.sort(key=parse_semantic_version)

            return versions

        version = submodule.get("version")
        minimal_version = submodule.get("minimal_version")
        branch = submodule.get("branch")
        path = submodule["path"]
        target = "none"

        if RepoSetup.repo_initialized(full_repo_path):
            if branch:
                target = branch
            elif minimal_version:
                target = get_latest_same_major(
                    get_sorted_releases(full_repo_path), minimal_version
                )
                if target is None:
                    print_error(
                        f"Minimal version {minimal_version} not found on {path}! {RepoSetup.message_check}"
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
            os.path.join(RepoSetup.script_dir, path)
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

    @staticmethod
    def get_info_by_archive(archive) -> tuple:

        organization = archive.get("organization", None)
        project = archive.get("project", None)
        release = archive.get("release", None)
        artifact = archive.get("name", None)
        version = archive.get("version", None)
        path = archive.get("path", None)

        return organization, project, release, artifact, version, path

    @staticmethod
    def init_repository(
        repo_url,
        full_repo_path,
        clone_type=CloneType.SSH.value,
        force_remove_repo=False,
        log=False,
    ) -> tuple:
        repo_cloned = False
        repo_error = False
        path_parts = full_repo_path.split(os.sep)
        repo_name = os.path.join(path_parts[-2], path_parts[-1])

        repo_setup = RepoSetup(clone_type, force_remove_repo, log)

        if repo_setup.repo_initialized(full_repo_path):
            print_color(f"Updating submodule {repo_name}", BLUE)
        elif os.path.exists(os.path.join(full_repo_path)) and not os.path.exists(
            os.path.join(full_repo_path, ".git")
        ):
            print_warning(f".git not found on {repo_name}")
            repo_setup.remove_repo(full_repo_path)
            repo_error = True
        else:
            print_color(f"Initalizing submodule {repo_name}", BLUE)
            result = repo_setup.run_command(
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

                repo_cloned, repo_error = self.init_repository(
                    repo_url, full_repo_path, self.clone_type, self.force, self.log
                )

                if not repo_error:
                    target = self.get_target_of_submodule(submodule, full_repo_path)
                    if self.checkout_and_pull(path, target_type, target, repo_cloned):
                        break
                else:
                    break

                exec_count += 1
        else:
            print_error("Error loading submodule info")

    def get_archives(self, archive):
        type = archive["type"]

        if type == "az_artifacts":
            self.get_archives_az_artifacts(archive)
        elif type == "github_assets":
            self.get_archives_github_assets(archive)

    def get_archives_az_artifacts(self, archive):

        def azure_login():
            azure_token = os.getenv("AZURE_TOKEN")
            if azure_token is not None:
                print_color("Using Azure Token from pipeline", BLUE)
                command = f"echo {azure_token} | az devops login"
                subprocess.run([command], shell=True)
                subprocess.run(
                    ["az config set extension.use_dynamic_install=yes_without_prompt"],
                    shell=True,
                )

        archive_info = self.get_info_by_archive(archive)

        if not os.path.exists(self.download_dir):
            os.makedirs(self.download_dir)

        if not archive_info:
            print_error("Error loading archive info")
            return

        organization, project, release, artifact, version, path = archive_info

        artifact_version_file_path = os.path.join(path, ".package.ini")
        full_repo_path = os.path.join(self.script_dir, path)
        file_name = f"{artifact}-{version}.tar.xz"

        command = [
            "az artifacts universal download "
            + f'--organization "{organization}" '
            + f'--feed "{project}" '
            + f'--name "{artifact}" '
            + f'--version "{version}" '
            + f"--path {self.download_dir}"
        ]

        if os.path.isfile(artifact_version_file_path):
            config = configparser.ConfigParser()
            config.read(artifact_version_file_path)
            current_version = config.get(artifact, "version")
            if current_version == version:
                print_color(
                    f"Artifact {artifact} already exists and is updated. Skipping download.",
                    GREEN,
                )
                return
            else:
                print_color(
                    f"Current {artifact} version: {current_version}. Will update to {version}.",
                    BLUE,
                )
        else:
            print_color(
                f"Version file '.package.ini' not found. Will download {version}.",
                YELLOW,
            )

        try:
            tar_file_path = os.path.join(self.download_dir, file_name)

            azure_login()
            print(f"Downloading {file_name} to {full_repo_path}...")
            result = subprocess.run(command, check=True, shell=True)
            if result.returncode != 0:
                print_error(f"Failed to download archive {file_name}!")
            else:
                print_color(f"Downloaded {file_name} successfully!", GREEN)

            # Unzip the downloaded file
            with tarfile.open(tar_file_path) as tar:
                for entry in tar.getmembers():
                    if os.path.isabs(entry.name) or ".." in entry.name:
                        raise ValueError(f"Illegal tar archive entry: {entry.name}")
                print_color(f"Extracting {file_name}", GREEN)
                tar.extractall(path=full_repo_path)

        except subprocess.CalledProcessError as e:
            print_error(
                f"Failed to download archive {file_name} to {full_repo_path}! Error: {e.stderr}"
            )

    def get_archives_github_assets(self, archive):
        import getpass
        import urllib.request

        # Import PyGithub only when needed
        try:
            from github import Auth, Github, BadCredentialsException
        except ImportError:
            print_error("PyGithub is required for github_assets. Installing now...")
            subprocess.call([sys.executable, "-m", "pip", "install", "PyGithub"])
            from github import Auth, Github, BadCredentialsException

        def download_release(
            self, repo_name, version, asset_filter: bool, package_check: bool
        ) -> bool:
            try:

                def check_if_exist(package_check) -> bool:
                    if os.path.exists(self.download_dir):
                        files = os.listdir(self.download_dir)
                        for file in files:
                            if package_check(file):
                                return True

                    return False

                if not check_if_exist(package_check):
                    if not os.path.exists(self.download_dir):
                        os.makedirs(self.download_dir)

                    token = get_github_token()
                    if not token:
                        print_error(
                            "GitHub token is required to download release assets. "
                            "Please configure a valid token in ~/.github_token.json."
                        )
                        return False
                    github = Github(auth=Auth.Token(token))
                    repo = github.get_repo(f"stone-payments/{repo_name}")
                    release = repo.get_release(version)
                    headers = {
                        "Authorization": f"Bearer {token}",
                        "X-GitHub-Api-Version": "2022-11-28",
                        "Accept": "application/octet-stream",
                    }

                    for asset in release.get_assets():
                        if asset_filter(asset):
                            filename = os.path.join(self.download_dir, asset.name)
                            print_color(
                                f"Downloading {asset.name} into {self.download_dir}...",
                                GREEN,
                            )
                            if os.path.exists(filename):
                                print_error(f"The file {asset.name} already exists!")
                                break

                            # Create request with auth header
                            req = urllib.request.Request(asset.url, headers=headers)
                            with urlopen_with_timeout(req) as response:
                                with open(filename, "wb") as f:
                                    f.write(response.read())
                                    print_color(
                                        f"{asset.name} downloaded successfully.", GREEN
                                    )
                                    return True

                return True
            except BadCredentialsException:
                print_error(
                    f"Invalid GitHub credentials. Please check your token at ~/.github_token.json"
                )
                return False
            except Exception as e:
                print_error(f"Release {version} not found in {repo_name}")
                return False

        archive_info = self.get_info_by_archive(archive)

        if not os.path.exists(self.download_dir):
            os.makedirs(self.download_dir)

        if not archive_info:
            print_error("Error loading archive info")
            return

        organization, repo, release, asset_name, version, path = archive_info

        asset_version_file_path = os.path.join(path, ".package.ini")
        extraction_path = os.path.join(self.script_dir, path)

        if os.path.isfile(asset_version_file_path):
            config = configparser.ConfigParser()
            config.read(asset_version_file_path)
            sections = config.sections()
            current_version = None
            if sections:
                section = sections[0]
                if config.has_option(section, "version"):
                    current_version = config.get(section, "version")
            if current_version == version:
                print_color(
                    f"Asset {asset_name} already exists. Skipping download", GREEN
                )
                return

        downloaded = download_release(
            self,
            repo_name=repo,
            version=release,
            asset_filter=lambda asset: asset.name == asset_name,
            package_check=lambda filename: filename == asset_name,
        )

        if downloaded:
            file_path = os.path.join(self.download_dir, asset_name)
            with tarfile.open(file_path) as tar:
                for entry in tar.getmembers():
                    if os.path.isabs(entry.name) or ".." in entry.name:
                        raise ValueError(f"Illegal tar archive entry: {entry.name}")
                print_color(f"Extracting {asset_name}", GREEN)
                tar.extractall(path=extraction_path)

    @staticmethod
    def filter_submodules(submodules: list, repo_list: list = None) -> list:
        filtered_submodules = []
        if repo_list:
            for repo in repo_list:
                for submodule in submodules:
                    if repo.lower() in submodule["path"].lower():
                        filtered_submodules.append(submodule)
        else:
            for submodule in submodules:
                required = submodule.get("required", True)
                if required:
                    filtered_submodules.append(submodule)

        return filtered_submodules

    @staticmethod
    def filter_archives(archives: list, artifacts_list: list = None) -> list:
        if archives == None:
            return None

        is_pipeline = (
            os.getenv("AZURE_TOKEN") is not None
            or os.getenv("GITHUB_TOKEN") is not None
        )
        if is_pipeline and not artifacts_list:
            return []
        elif artifacts_list:
            return [a for a in archives if a["name"] in artifacts_list]
        else:
            return archives


def main():
    def get_latest_sdk_commit() -> Optional[str]:
        import urllib.request
        import urllib.error

        # Try to get GitHub token for authenticated requests (5000/hour limit vs 60/hour)
        # Use prompt_if_missing=False to avoid prompting user during auto-update check
        token = get_github_token(prompt_if_missing=False)

        url = f"{GITHUB_API_BASE}/repos/{REPO_SETUP_SOURCE_REPO}/commits?sha={REPO_SETUP_SOURCE_BRANCH}"
        try:
            if token:
                # Use authenticated request (5000 requests/hour limit)
                headers = {
                    "Authorization": f"Bearer {token}",
                    "X-GitHub-Api-Version": "2022-11-28",
                    "Accept": "application/vnd.github+json",
                }
                req = urllib.request.Request(url, headers=headers)
                with urlopen_with_timeout(req) as response:
                    data = json.loads(response.read().decode("utf-8"))
            else:
                # Use unauthenticated request (60 requests/hour limit)
                with urlopen_with_timeout(url) as response:
                    data = json.loads(response.read().decode("utf-8"))

            if isinstance(data, list) and len(data) > 0 and "sha" in data[0]:
                return data[0]["sha"]
        except urllib.error.HTTPError as e:
            # Handle HTTP errors with proper status code checking
            if e.code == 429:
                print_warning(
                    "Warning: GitHub API rate limit exceeded (429). Use --bypass_auto_update to skip this check."
                )
            elif e.code == 403:
                print_warning(
                    f"Warning: GitHub API access forbidden (403). Consider using --bypass_auto_update or setting GITHUB_TOKEN."
                )
            else:
                print_warning(f"Warning: GitHub API error ({e.code}): {e.reason}")
        except Exception as e:
            # Silently ignore other network errors; if we can't fetch the commit,
            # we just skip the auto-update check and proceed normally
            print_warning(
                f"Warning: Could not fetch latest SDK commit from remote: {e}"
            )

        return None

    def auto_update_repo_setup(original_args, latest_commit_hash: str):
        """Download and replace the current repo_setup.py, then execute it.

        If successful, executes the updated script and terminates.
        If it fails, logs the error and returns to allow the current script to run.

        Args:
            original_args: Original command-line arguments to pass to updated script
            latest_commit_hash: Latest SDK commit hash to replace placeholder with
        """
        import urllib.request

        # Try to get token for authenticated requests (higher rate limit)
        token = get_github_token(prompt_if_missing=False)

        # Prefer GitHub API when token is available; fallback to raw URL when unauthenticated
        api_url = f"{GITHUB_API_BASE}/repos/{REPO_SETUP_SOURCE_REPO}/contents/tools/repo_setup.py?ref={REPO_SETUP_SOURCE_BRANCH}"
        raw_url = f"{GITHUB_RAW_BASE}/{REPO_SETUP_SOURCE_REPO}/{REPO_SETUP_SOURCE_BRANCH}/tools/repo_setup.py"
        tmp_path = None
        current_script_path = os.path.abspath(__file__)
        current_script_dir = os.path.dirname(current_script_path)
        current_mode = None
        try:
            current_mode = os.stat(current_script_path).st_mode
        except OSError:
            current_mode = None

        try:
            print_warning("Downloading latest repo_setup.py...")

            if token:
                # Use authenticated API request (5000 requests/hour limit)
                headers = {
                    "Authorization": f"Bearer {token}",
                    "X-GitHub-Api-Version": "2022-11-28",
                    "Accept": "application/vnd.github.raw+json",
                }
                req = urllib.request.Request(api_url, headers=headers)
                with urlopen_with_timeout(req) as response:
                    content = response.read().decode("utf-8")
            else:
                # No token: use raw content endpoint to avoid low unauthenticated API limit
                with urlopen_with_timeout(raw_url) as response:
                    content = response.read().decode("utf-8")

            # Replace only the repo_setup_commit value, preserving the placeholder constant
            # Matches either placeholder or a quoted hash.
            content = re.sub(
                r"(repo_setup_commit: str = )(REPO_SETUP_HASH_PLACEHOLDER|\"[^\"]*\")",
                rf'\g<1>"{latest_commit_hash}"',
                content,
            )

            with tempfile.NamedTemporaryFile(
                "w", suffix=".py", delete=False, dir=current_script_dir
            ) as tmp_file:
                tmp_file.write(content)
                tmp_path = tmp_file.name

            os.replace(tmp_path, current_script_path)
            if current_mode is not None:
                os.chmod(current_script_path, current_mode)
            tmp_path = None

            print_warning("Executing updated repo_setup.py...")
            # Execute the updated version with original arguments
            subprocess.run(
                [sys.executable, current_script_path] + original_args, check=True
            )
            sys.exit(0)
        except Exception as exc:
            print_error(f"Error during auto-update: {exc}")
            print_warning("Falling back to current repo_setup version")
            # Return to allow current script to continue execution
            return
        finally:
            if tmp_path and os.path.exists(tmp_path):
                try:
                    os.remove(tmp_path)
                except Exception:
                    # Best-effort cleanup; ignore errors if temp file can't be removed
                    print_warning(
                        "Warning: Could not remove temporary file during cleanup"
                    )
                    pass

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
        "--archive_list",
        "-a",
        help="Archives to be updated. If nothing provided in pipeline nothing is updated, locally all will be updated",
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

    # Check if there are github_assets before installing dependencies
    has_github_assets = False
    try:
        with open(RepoSetup.repo_settings_file_name, "r") as f:
            repo_settings = json.load(f)
            archives = repo_settings.get("archives", [])
            if archives:
                has_github_assets = any(
                    a.get("type") == "github_assets" for a in archives
                )
    except Exception:
        # Silently handle missing or invalid repo_settings.json;
        # will proceed with default behavior (no github_assets)
        print_warning(
            f"Warning: Could not load {RepoSetup.repo_settings_file_name} for dependency check"
        )

    install_dependencies(has_github_assets)
    sdk_commit: Optional[str] = get_latest_sdk_commit()
    bypass_auto_update = args.bypass_auto_update
    is_https_clone = (
        RepoSetup.CloneType.get_by_value(args.clone_type) == RepoSetup.CloneType.HTTPS
    )

    # Check if update is needed and not bypassed
    # Update is needed if commit is placeholder or differs from remote
    needs_update = repo_setup_commit == REPO_SETUP_HASH_PLACEHOLDER or (
        sdk_commit and sdk_commit.lower() != repo_setup_commit.lower()
    )

    should_auto_update = (
        not bypass_auto_update and not is_https_clone and sdk_commit and needs_update
    )

    if should_auto_update:
        print_warning("repo_setup is outdated!!! Auto-updating...")
        print_warning(f"Local repo_setup hash: {repo_setup_commit}")
        print_warning(f"Remote sdk {REPO_SETUP_SOURCE_BRANCH} hash: {sdk_commit}")
        auto_update_repo_setup(sys.argv[1:], sdk_commit)
        # If auto_update succeeds, sys.exit(0) is called and execution ends
        # If auto_update fails, it returns here and we proceed with current version

    print_color("\nLoading repository settings...", BLUE)
    with open(RepoSetup.repo_settings_file_name, "r") as f:
        repo_settings = json.load(f)

    submodules = repo_settings["submodules"]
    archives = repo_settings["archives"] if "archives" in repo_settings else None

    repo_setup = RepoSetup(clone_type=args.clone_type, force=args.force, log=args.log)
    repo_setup.run_command(
        ["git", "config", "--global", "advice.detachedHead", "false"]
    )

    filtered_submodules = RepoSetup.filter_submodules(submodules, repo_list)
    filtered_archives = RepoSetup.filter_archives(archives, args.archive_list)

    print_color(f"\n📦 Processing {len(filtered_submodules)} submodule(s)...", BLUE)
    if filtered_archives:
        print_color(f"📦 Processing {len(filtered_archives)} archive(s)...", BLUE)

    # Create a pool of workers
    with concurrent.futures.ProcessPoolExecutor() as executor:
        # Use the executor to map the function to the inputs
        executor.map(repo_setup.update_repo, filtered_submodules)

        # Wait for submodules to be updated
        print_color("⏳ Waiting for submodules update to complete...", CYAN)
        executor.shutdown(wait=True)
        print_color("✓ All submodules updated successfully", GREEN)

        if filtered_archives is not None:
            print_color("\n📦 Processing archives...", CYAN)
            # Create a new executor after submodules are updated for the archive function
            with concurrent.futures.ProcessPoolExecutor() as executor:
                executor.map(repo_setup.get_archives, filtered_archives)
            print_color("✓ All archives processed successfully", GREEN)

    print_color("\n✅ Repository Setup Completed ✅\n", CYAN)


if __name__ == "__main__":
    main()
