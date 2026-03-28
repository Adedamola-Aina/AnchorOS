// @ts-nocheck
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

module.exports = {
    addToKnownIssues,
    addToFeatureSuggestions
};
