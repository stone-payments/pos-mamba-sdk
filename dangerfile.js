import { fail, message, danger } from 'danger';

const { pr, modified_files: modifiedFiles } = danger.github;
const { additions = 0, deletions = 0 } = pr;

message(
  `:tada: The PR added ${additions} and removed ${deletions} lines from a total of ${modifiedFiles.length +
    1} files.`,
);

// Always ensure we assign someone, so that our Slackbot can do its work correctly
if (pr.assignee === null) {
  fail(
    'Please assign someone to merge this PR, and optionally include people who should review.',
  );
}
