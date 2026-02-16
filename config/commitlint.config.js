// @ts-nocheck
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allow these commit types
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation
        'style',    // Formatting (no code change)
        'refactor', // Code restructuring
        'perf',     // Performance improvement
        'test',     // Adding/fixing tests
        'build',    // Build system changes
        'ci',       // CI/CD changes
        'chore',    // Maintenance
        'revert',   // Revert commit
        'deploy',   // Deploy markers
      ],
    ],
    // Allow longer subjects for descriptive commits
    'subject-max-length': [1, 'always', 100],
    // Allow body to be empty
    'body-max-line-length': [0, 'always', Infinity],
  },
};
