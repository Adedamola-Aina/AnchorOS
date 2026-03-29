// @ts-nocheck
// Ticket-ID pattern: BUG-123, FEAT-123, AUTH-123, ARCH-123, etc.
const TICKET_RE = /[A-Z]+-\d+/;

export default {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'anchor-ticket-ref': ({ subject, body, footer }) => {
          const text = [subject, body, footer].filter(Boolean).join('\n');
          const hasTicket = TICKET_RE.test(text);
          return [
            hasTicket,
            'No ticket ID found (e.g. BUG-123, FEAT-123). Add one or this is a deliberate un-ticketed commit.',
          ];
        },
      },
    },
  ],
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
    // Warn (level 1) if no ticket ID in subject/body/footer
    'anchor-ticket-ref': [1, 'always'],
  },
};
