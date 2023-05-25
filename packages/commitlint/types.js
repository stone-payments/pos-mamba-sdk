const COMMIT_TYPES = {
  chore: {
    description: "Build process or auxiliary tool changes, that don't modify src or test files",
    value: 'chore',
    title: 'Chores',
  },
  ci: {
    description: 'Changes to our CI configuration files',
    value: 'ci',
    title: 'Continuous Integrations',
  },
  docs: {
    description: 'Documentation only changes',
    value: 'docs',
    title: 'Documentation',
  },
  feat: {
    description: 'A new feature',
    value: 'feat',
    title: 'Features',
  },
  fix: {
    description: 'A bug fix',
    value: 'fix',
    title: 'Bug Fixes',
  },
  perf: {
    description: 'A code change that improves performance',
    value: 'perf',
    title: 'Performance Improvements',
  },
  refactor: {
    description: 'A code change that neither fixes a bug or adds a feature',
    value: 'refactor',
    title: 'Code Refactoring',
  },
  revert: {
    description: 'Reverts a previous commit',
    value: 'revert',
    title: 'Reverts',
  },
  release: {
    description: 'Create a release commit',
    value: 'release',
    title: 'Style',
  },
  fire: {
    description: 'Removing code or files',
    value: 'fire',
    title: 'Fires',
  },
  style: {
    description:
      'Changes that do not affect the meaning of the code (Markup, white-space, formatting, missing semi-colons...)',
    value: 'style',
    title: 'Style',
  },
  test: {
    description: 'Adding missing tests',
    value: 'test',
    title: 'Tests',
  },
  conf: {
    description: 'A commit related to project configurations',
    value: 'conf',
    title: 'Conf',
  },
  shirt: {
    description: 'Removing linter warnings',
    value: 'shirt',
    title: 'Linter fixes',
  },
  wip: {
    description: 'A work in progress commit',
    value: 'WIP',
    title: 'WIP',
  },
};

module.exports = {
  COMMIT_TYPES,
  list: Object.keys(COMMIT_TYPES),
};
