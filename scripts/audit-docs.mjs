#!/usr/bin/env node
/**
 * Documentation Health Audit Script
 * 
 * Checks for common documentation issues:
 * - References to deleted files
 * - Stale version numbers
 * - Broken internal links
 * - Outdated branch references
 * 
 * Run: node scripts/audit-docs.mjs
 * Add to CI: Include in pre-commit or scheduled job
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, relative } from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();

// Files that should NOT exist (deleted)
const DELETED_FILES = [
  'docs/CHANGELOG.md',
  'docs/PROJECT_STATUS.md',
  'docs/KNOWN_ISSUES.md',
  'docs/FEATURE_SUGGESTIONS.md',
  'docs/ROADMAP.md',
  'docs/DEPLOYMENT_STATUS.md',
];

// Patterns that indicate staleness (warnings only - don't fail CI)
const STALE_PATTERNS = [
  { pattern: /React 18/gi, message: 'React 18 reference (should be React 19)' },
  { pattern: /origin main\b/gi, message: 'Branch "main" (should be "master")' },
  { pattern: /firebase-functions.*v1|functions\.https\.onCall\(/gi, message: 'Firebase Functions v1 API pattern' },
];

// Version patterns are info-only (old versions in examples are expected in docs)
const INFO_PATTERNS = [
  { pattern: /v1\.5\.\d+/g, message: 'Old version v1.5.x reference (may be example)' },
  { pattern: /v1\.4\.\d+/g, message: 'Old version v1.4.x reference (may be example)' },
];

// Files to check
const DOC_EXTENSIONS = ['.md', '.mdx'];
const CODE_EXTENSIONS = ['.ts', '.tsx', '.js', '.mjs', '.yml', '.yaml'];

function getAllFiles(dir, extensions) {
  const files = [];
  const items = readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = join(dir, item.name);
    
    // Skip node_modules, dist, coverage, .git
    if (['node_modules', 'dist', 'coverage', '.git', 'lib'].includes(item.name)) continue;
    
    if (item.isDirectory()) {
      files.push(...getAllFiles(fullPath, extensions));
    } else if (extensions.some(ext => item.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function checkForDeletedFileReferences(content, filePath) {
  const issues = [];
  
  for (const deletedFile of DELETED_FILES) {
    const fileName = deletedFile.split('/').pop();
    const patterns = [
      new RegExp(`docs/${fileName}`, 'gi'),
      new RegExp(`\\[${fileName}\\]`, 'gi'),
      new RegExp(`\\(${fileName}\\)`, 'gi'),
    ];
    
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        issues.push({
          file: filePath,
          type: 'DELETED_REF',
          message: `References deleted file: ${deletedFile}`,
        });
        break;
      }
    }
  }
  
  return issues;
}

function checkForStalePatterns(content, filePath) {
  const issues = [];
  
  for (const { pattern, message } of STALE_PATTERNS) {
    if (pattern.test(content)) {
      issues.push({
        file: filePath,
        type: 'STALE',
        message,
      });
    }
    // Reset regex lastIndex
    pattern.lastIndex = 0;
  }
  
  return issues;
}

function checkInternalLinks(content, filePath) {
  const issues = [];
  
  // Find markdown links to local files
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = linkPattern.exec(content)) !== null) {
    const linkPath = match[2];
    
    // Skip external links, anchors, and http(s) links
    if (linkPath.startsWith('http') || linkPath.startsWith('#') || linkPath.startsWith('mailto:')) continue;
    
    // Skip links to external paths outside the repo (like .gemini)
    if (linkPath.includes('.gemini') || linkPath.includes('antigravity')) continue;
    
    // Clean up file:// prefix if present
    let cleanPath = linkPath.replace('file://', '').replace(/^\/root\/anchor-os\//, '');
    
    // Remove anchor
    cleanPath = cleanPath.split('#')[0];
    
    // Handle relative paths (./file.ts or ../path/file.ts)
    if (cleanPath.startsWith('./') || cleanPath.startsWith('../')) {
      const fileDir = join(ROOT, filePath).replace(/\/[^/]+$/, '');
      const resolvedPath = join(fileDir, cleanPath);
      if (!existsSync(resolvedPath)) {
        issues.push({
          file: filePath,
          type: 'BROKEN_LINK',
          message: `Broken link: ${linkPath}`,
        });
      }
      continue;
    }
    
    if (cleanPath && !existsSync(join(ROOT, cleanPath))) {
      issues.push({
        file: filePath,
        type: 'BROKEN_LINK',
        message: `Broken link: ${linkPath}`,
      });
    }
  }
  
  return issues;
}

function getCurrentVersion() {
  try {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    return pkg.version;
  } catch {
    return 'unknown';
  }
}

function main() {
  console.log('🔍 Documentation Health Audit\n');
  console.log(`Current version: ${getCurrentVersion()}`);
  console.log(`Root: ${ROOT}\n`);
  
  const allFiles = [
    ...getAllFiles(ROOT, DOC_EXTENSIONS),
    ...getAllFiles(join(ROOT, '.github'), CODE_EXTENSIONS),
    ...getAllFiles(join(ROOT, '.agent'), DOC_EXTENSIONS),
  ];
  
  // Also check key config files
  const configFiles = [
    'CLAUDE.md',
    'AGENTS.md',
    'commitlint.config.js',
  ].map(f => join(ROOT, f)).filter(existsSync);
  
  const filesToCheck = [...new Set([...allFiles, ...configFiles])];
  
  console.log(`Checking ${filesToCheck.length} files...\n`);
  
  const allIssues = [];
  
  for (const file of filesToCheck) {
    try {
      const content = readFileSync(file, 'utf8');
      const relPath = relative(ROOT, file);
      
      allIssues.push(...checkForDeletedFileReferences(content, relPath));
      allIssues.push(...checkForStalePatterns(content, relPath));
      allIssues.push(...checkInternalLinks(content, relPath));
    } catch (err) {
      console.warn(`Warning: Could not read ${file}: ${err.message}`);
    }
  }
  
  // Group by type
  const byType = {
    DELETED_REF: [],
    BROKEN_LINK: [],
    STALE: [],
  };
  
  for (const issue of allIssues) {
    byType[issue.type].push(issue);
  }
  
  // Report
  let hasIssues = false;
  
  if (byType.DELETED_REF.length > 0) {
    hasIssues = true;
    console.log('❌ CRITICAL: References to deleted files');
    console.log('─'.repeat(50));
    for (const issue of byType.DELETED_REF) {
      console.log(`  ${issue.file}`);
      console.log(`    └─ ${issue.message}`);
    }
    console.log();
  }
  
  if (byType.BROKEN_LINK.length > 0) {
    hasIssues = true;
    console.log('❌ CRITICAL: Broken internal links');
    console.log('─'.repeat(50));
    for (const issue of byType.BROKEN_LINK) {
      console.log(`  ${issue.file}`);
      console.log(`    └─ ${issue.message}`);
    }
    console.log();
  }
  
  if (byType.STALE.length > 0) {
    hasIssues = true;
    console.log('⚠️  WARNING: Stale content detected');
    console.log('─'.repeat(50));
    for (const issue of byType.STALE) {
      console.log(`  ${issue.file}`);
      console.log(`    └─ ${issue.message}`);
    }
    console.log();
  }
  
  // Summary
  console.log('─'.repeat(50));
  console.log('📊 Summary');
  console.log(`   Deleted file refs: ${byType.DELETED_REF.length}`);
  console.log(`   Broken links: ${byType.BROKEN_LINK.length}`);
  console.log(`   Stale patterns: ${byType.STALE.length}`);
  console.log(`   Total issues: ${allIssues.length}`);
  console.log();
  
  if (!hasIssues) {
    console.log('✅ No documentation issues found!');
    process.exit(0);
  } else {
    console.log('❌ Documentation issues found. Please fix before committing.');
    process.exit(1);
  }
}

main();
