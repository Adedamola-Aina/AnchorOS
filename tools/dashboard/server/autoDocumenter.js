/**
 * autoDocumenter.js
 * 
 * Automatically updates documentation files when issues are detected
 */

const fs = require('fs').promises;
const path = require('path');
const { formatIssue } = require('./conversationAnalyzer');

/**
 * Add issue to KNOWN_ISSUES.md
 */
async function addToKnownIssues(issue, projectRoot) {
    const filePath = path.join(projectRoot, 'docs', 'KNOWN_ISSUES.md');

    try {
        let content = await fs.readFile(filePath, 'utf-8');

        // Determine section based on type
        let sectionMarker;
        if (issue.type === 'REGRESSION') {
            sectionMarker = '## 🔵 REGRESSIONS';
        } else if (issue.type === 'GAP') {
            sectionMarker = '## 🟡 HIGH (P1)';
        } else {
            // BUG - add to appropriate priority section
            if (issue.priority === 'P0') {
                sectionMarker = '## 🔴 CRITICAL (P0)';
            } else {
                sectionMarker = '## 🟡 HIGH (P1)';
            }
        }

        // Find section
        const sectionIndex = content.indexOf(sectionMarker);
        if (sectionIndex === -1) {
            console.error(`Section ${sectionMarker} not found in KNOWN_ISSUES.md`);
            return false;
        }

        // Find next section or end
        const nextSectionIndex = content.indexOf('\n## ', sectionIndex + sectionMarker.length);
        const insertIndex = nextSectionIndex === -1 ? content.length : nextSectionIndex;

        // Check if already exists
        if (content.includes(`[${issue.id}]`)) {
            console.log(`Issue ${issue.id} already exists in KNOWN_ISSUES.md`);
            return false;
        }

        // Insert issue
        const formattedIssue = formatIssue(issue);
        const before = content.substring(0, insertIndex);
        const after = content.substring(insertIndex);

        content = before + '\n' + formattedIssue + '\n' + after;

        // Write back
        await fs.writeFile(filePath, content, 'utf-8');
        console.log(`✅ Added ${issue.id} to KNOWN_ISSUES.md`);
        return true;
    } catch (error) {
        console.error('Error adding to KNOWN_ISSUES.md:', error.message);
        return false;
    }
}

/**
 * Add feature to FEATURE_SUGGESTIONS.md
 */
async function addToFeatureSuggestions(issue, projectRoot) {
    const filePath = path.join(projectRoot, 'docs', 'FEATURE_SUGGESTIONS.md');

    try {
        let content = await fs.readFile(filePath, 'utf-8');

        // Find component section
        const componentSections = {
            'Finance': '## 💰 FINANCE',
            'Auth': '## 🔐 AUTHENTICATION',
            'Commitments': '## ✅ COMMITMENTS',
            'Dashboard': '## 📊 DASHBOARD',
            'Family': '## 👨‍👩‍👧‍👦 FAMILY',
            'Settings': '## ⚙️ SETTINGS',
            'UI/UX': '## 🎨 UI/UX',
            'Architecture': '## 🏗️ ARCHITECTURE',
        };

        const sectionMarker = componentSections[issue.component] || '## 📋 GENERAL';

        // Find section
        const sectionIndex = content.indexOf(sectionMarker);
        if (sectionIndex === -1) {
            console.error(`Section ${sectionMarker} not found in FEATURE_SUGGESTIONS.md`);
            return false;
        }

        // Find next section
        const nextSectionIndex = content.indexOf('\n## ', sectionIndex + sectionMarker.length);
        const insertIndex = nextSectionIndex === -1 ? content.length : nextSectionIndex;

        // Check if similar feature exists
        const titleLower = issue.title.toLowerCase();
        const sectionContent = content.substring(sectionIndex, insertIndex);
        if (sectionContent.toLowerCase().includes(titleLower.substring(0, 30))) {
            console.log(`Similar feature already exists in FEATURE_SUGGESTIONS.md`);
            return false;
        }

        // Insert feature
        const formattedIssue = formatIssue(issue);
        const before = content.substring(0, insertIndex);
        const after = content.substring(insertIndex);

        content = before + '\n' + formattedIssue + '\n' + after;

        // Write back
        await fs.writeFile(filePath, content, 'utf-8');
        console.log(`✅ Added feature to FEATURE_SUGGESTIONS.md`);
        return true;
    } catch (error) {
        console.error('Error adding to FEATURE_SUGGESTIONS.md:', error.message);
        return false;
    }
}

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
