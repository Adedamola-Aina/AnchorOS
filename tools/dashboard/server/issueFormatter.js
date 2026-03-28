// @ts-nocheck

/**
 * Format issue for documentation
 */
function formatIssue(issue) {
    const timestamp = new Date(issue.reportedAt).toISOString().split('T')[0];

    if (issue.type === 'FEATURE') {
        return `
### ${issue.component.toUpperCase()}-XXX: ${issue.title}
- **Category**: ${issue.component}
- **Priority**: ${issue.priority === 'P1' ? 'High' : issue.priority === 'P2' ? 'Medium' : 'Low'}
- **Effort**: TBD
- **Impact**: TBD
- **Description**: ${issue.description}
- **Requested By**: ${issue.reporter} (${timestamp})
`;
    }

    if (issue.type === 'TASK') {
        return `| **${issue.priority}** | ${issue.id}: ${issue.title} | Agent | TBD | ⬜ Not Started |`;
    }

    // BUG, REGRESSION, GAP
    return `
### [${issue.id}] ${issue.title}
- **Reported**: ${timestamp}
- **Reporter**: ${issue.reporter}
- **Component**: ${issue.component}
- **Impact**: ${issue.description}
- **Priority**: ${issue.priority}
- **Status**: Reported
`;
}

module.exports = { formatIssue };
