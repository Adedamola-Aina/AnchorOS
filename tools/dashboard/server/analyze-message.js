#!/usr/bin/env node
// @ts-nocheck
/**
 * analyze-message.js
 * 
 * CLI tool to test conversation analyzer
 * Usage: node tools/dashboard/server/analyze-message.js "your message here"
 */

const path = require('path');
const { analyzeMessage } = require('./conversationAnalyzer');
const { documentIssue, autoCommit } = require('./autoDocumenter');

const PROJECT_ROOT = path.resolve(__dirname, '../../..');

async function main() {
    const message = process.argv.slice(2).join(' ');

    if (!message) {
        console.error('Usage: node analyze-message.js "your message here"');
        process.exit(1);
    }

    console.log('📝 Analyzing message...\n');
    console.log(`Message: "${message}"\n`);

    const issue = await analyzeMessage(message, PROJECT_ROOT);

    if (!issue) {
        console.log('❌ No issue detected (not a bug/feature/task/gap/regression)');
        process.exit(0);
    }

    console.log('✅ Issue detected!\n');
    console.log('Classification:');
    console.log(`  Type:      ${issue.type}`);
    console.log(`  ID:        ${issue.id}`);
    console.log(`  Title:     ${issue.title}`);
    console.log(`  Component: ${issue.component}`);
    console.log(`  Priority:  ${issue.priority}`);
    console.log(`  Keywords:  ${issue.keywords.join(', ')}`);
    console.log(`  Reporter:  ${issue.reporter}`);
    console.log(`  Reported:  ${issue.reportedAt}`);
    console.log('');

    // Ask if should document
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.question('Document this issue? (y/n): ', async (answer) => {
        if (answer.toLowerCase() === 'y') {
            console.log('\n📄 Documenting issue...');

            const success = await documentIssue(issue, PROJECT_ROOT);

            if (success) {
                console.log('✅ Issue documented successfully');

                // Auto-commit
                await autoCommit(issue, PROJECT_ROOT);
                console.log('✅ Changes committed');
            } else {
                console.log('❌ Failed to document issue');
            }
        } else {
            console.log('Skipped documentation');
        }

        readline.close();
    });
}

main().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
});
