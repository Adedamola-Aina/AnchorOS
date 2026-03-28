/**
 * autoDocumenter.js
 *
 * Automatically updates documentation files when issues are detected
 */
// @ts-nocheck

const fs = require('fs').promises;
const path = require('path');
const { addToKnownIssues, addToFeatureSuggestions } = require('./autoDocumenterHelpers');

/**
 * Add task to PROJECT_STATUS.md
 */
async function addToProjectStatus(issue, projectRoot) {
    const filePath = path.join(projectRoot, 'docs', 'PROJECT_STATUS.md');

    try {
        let content = await fs.readFile(filePath, 'utf-8');

        // Find "THIS WEEK'S PRIORITIES" section
        const sectionMarker = "## 🎯 THIS WEEK'S PRIORITIES";
        const sectionIndex = content.indexOf(sectionMarker);

        if (sectionIndex === -1) {
            console.error('THIS WEEK\'S PRIORITIES section not found in PROJECT_STATUS.md');
            return false;
        }

        // Find table
        const tableStart = content.indexOf('| Priority |', sectionIndex);
        if (tableStart === -1) {
            console.error('Priority table not found');
            return false;
        }

        // Find end of table header
        const headerEnd = content.indexOf('\n|', tableStart + 1);
        const insertIndex = content.indexOf('\n', headerEnd + 1);

        // Check if already exists
        if (content.includes(issue.id)) {
            console.log(`Task ${issue.id} already exists in PROJECT_STATUS.md`);
            return false;
        }

        // Insert task
        const { formatIssue } = require('./conversationAnalyzer');
        const formattedIssue = formatIssue(issue);
        const before = content.substring(0, insertIndex + 1);
        const after = content.substring(insertIndex + 1);

        content = before + formattedIssue + '\n' + after;

        // Write back
        await fs.writeFile(filePath, content, 'utf-8');
        console.log(`✅ Added ${issue.id} to PROJECT_STATUS.md`);
        return true;
    } catch (error) {
        console.error('Error adding to PROJECT_STATUS.md:', error.message);
        return false;
    }
}

/**
 * Document an issue in the appropriate file
 */
async function documentIssue(issue, projectRoot) {
    let success = false;

    if (issue.type === 'FEATURE') {
        success = await addToFeatureSuggestions(issue, projectRoot);
    } else if (issue.type === 'TASK') {
        success = await addToProjectStatus(issue, projectRoot);
    } else {
        // BUG, REGRESSION, GAP
        success = await addToKnownIssues(issue, projectRoot);
    }

    return success;
}

/**
 * Auto-commit documentation changes
 */
async function autoCommit(issue, projectRoot) {
    const { execSync } = require('child_process');

    try {
        // Stage changes
        execSync('git add docs/', { cwd: projectRoot });

        // Commit
        const message = `docs: Auto-document ${issue.id} - ${issue.title}

Type: ${issue.type}
Component: ${issue.component}
Priority: ${issue.priority}
Reporter: ${issue.reporter}

[Automated by conversation analyzer]`;

        execSync('git commit -m ' + JSON.stringify(message), { cwd: projectRoot });

        console.log(`✅ Auto-committed ${issue.id}`);
        return true;
    } catch (error) {
        console.error('Error auto-committing:', error.message);
        return false;
    }
}

module.exports = {
    documentIssue,
    autoCommit,
    addToKnownIssues,
    addToFeatureSuggestions,
    addToProjectStatus
};
