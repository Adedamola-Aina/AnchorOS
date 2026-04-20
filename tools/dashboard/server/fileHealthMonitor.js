/**
 * fileHealthMonitor.js
 * 
 * Monitors codebase health and detects files approaching the 200-line limit.
 * Provides early warnings for ARCH-001 compliance.
 */
// @ts-nocheck


const { exec } = require('child_process');
const path = require('path');
const util = require('util');

const execAsync = util.promisify(exec);
const ROOT_PATH = path.join(__dirname, '../../..');

// ─── Scan configuration ──────────────────────────────────────────────────────
// Add new source roots here as the codebase grows (iOS, Android, etc.).
// Language-specific line limits — SwiftUI views are naturally longer than TS.
const LANGUAGE_LIMITS = {
    ts:    200,  // TypeScript (ARCH-001)
    tsx:   200,  // TypeScript + JSX
    js:    200,
    jsx:   200,
    swift: 300,  // Swift / SwiftUI
    kt:    250,  // Kotlin
    kts:   250,  // Kotlin build scripts
};

// Source roots to scan — explicit allowlist is safer than relying on excludes
const SCAN_ROOTS = [
    'src',
    'functions/src',
    'packages',
    'apps/ios-native/AnchorOSNative',
    'apps/android-native/app/src',
    'android/app/src/main/java',
];

const FILE_HEALTH_EXCLUDES = [
    './node_modules/*',
    './.git/*',
    './dist/*',
    './build/*',
    './coverage/*',
    './functions/coverage/*',
    './playwright-report/*',
    './test-results/*',
    // Explicitly exclude internal tooling — these are not product code
    './tools/dashboard/*',
    './tools/mcp-server/*',
    './tools/ci/*',
    './tools/hooks/*',
    './functions/node_modules/*',
    './functions/lib/*',
    // Legacy Capacitor wrappers — not native source
    './android/*',
    './ios/*',
];

// Legacy flat list for getHealthReport().scope reporting
const FILE_HEALTH_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.swift', '.kt', '.kts'];

/**
 * Return the per-language line limit for a file path.
 */
function getLineLimit(filePath) {
    const ext = filePath.split('.').pop()?.toLowerCase();
    return LANGUAGE_LIMITS[ext] ?? 200;
}

function buildFileHealthScanCommand() {
    // Build an OR-group of scan roots. Files must be under at least one root.
    const rootExprs = SCAN_ROOTS.map(r => `-path './${r}/*'`).join(' -o ');
    // Extension filter
    const extExprs = ['.ts', '.tsx', '.js', '.jsx', '.swift', '.kt', '.kts']
        .map(e => `-name "*${e}"`)
        .join(' -o ');
    return [
        `find . -type f \\( ${rootExprs} \\)`,
        `\\( ${extExprs} \\)`,
        `! -path "*/node_modules/*" ! -path "*/dist/*" ! -path "*/lib/*"`,
        `! -path "*/tools/dashboard/*" ! -path "*/tools/mcp-server/*"`,
        `! -name "*.test.*" ! -name "*.spec.*"`,
        `-exec wc -l {} + | sort -rn`
    ].join(' \\\n    ');
}

/**
 * Find files approaching or exceeding the 200-line limit
 */
async function checkFileLineCount() {
    try {
        const { stdout } = await execAsync(buildFileHealthScanCommand(), {
            cwd: ROOT_PATH,
            timeout: 45000
        });

        const files = [];
        const lines = stdout.trim().split('\n');

        lines.forEach(line => {
            const match = line.trim().match(/^(\d+)\s+(.+)$/);
            if (match && !match[2].includes('total')) {
                const lineCount = parseInt(match[1]);
                const filePath = match[2];

                if (!filePath.includes('node_modules') && !filePath.includes('dist') &&
                    !filePath.includes('tools/dashboard') && !filePath.includes('tools/mcp-server') &&
                    !filePath.includes('.test.') && !filePath.includes('.spec.')) {
                    const limit = getLineLimit(filePath);
                    files.push({
                        path: filePath,
                        lines: lineCount,
                        limit,
                        language: filePath.split('.').pop()?.toLowerCase() || 'unknown',
                        status: getFileStatus(lineCount, limit)
                    });
                }
            }
        });

        return {
            files,
            summary: {
                exceeding: files.filter(f => f.status === 'exceeding').length,
                approaching: files.filter(f => f.status === 'warning').length,
                healthy: files.filter(f => f.status === 'healthy' || f.status === 'caution').length,
                byLanguage: FILE_HEALTH_EXTENSIONS.reduce((acc, ext) => {
                    const lang = ext.replace('.', '');
                    const langFiles = files.filter(f => f.language === lang);
                    if (langFiles.length > 0) acc[lang] = { total: langFiles.length, exceeding: langFiles.filter(f => f.status === 'exceeding').length };
                    return acc;
                }, {})
            },
            scope: {
                scannedRoots: SCAN_ROOTS,
                includeExtensions: FILE_HEALTH_EXTENSIONS,
                languageLimits: LANGUAGE_LIMITS,
                excludes: FILE_HEALTH_EXCLUDES,
                excludesTests: true,
                excludesTooling: true
            }
        };
    } catch (error) {
        return { error: error.message };
    }
}

/**
 * Determine file health status based on line count vs per-language limit.
 */
function getFileStatus(lineCount, limit = 200) {
    if (lineCount > limit) return 'exceeding';
    if (lineCount >= Math.floor(limit * 0.9)) return 'warning';   // top 10%
    if (lineCount >= Math.floor(limit * 0.75)) return 'caution';  // 75–90%
    return 'healthy';
}

/**
 * Detect anomalies in the codebase
 */
async function detectAnomalies() {
    const alerts = [];

    try {
        // Check for large files
        const fileHealth = await checkFileLineCount();
        const exceedingFiles = (fileHealth.files || []).filter(f => f.status === 'exceeding');
        const approachingFiles = (fileHealth.files || []).filter(f => f.status === 'warning');

        if (exceedingFiles.length > 0) {
            alerts.push({
                type: 'arch_001_violation',
                severity: 'critical',
                message: `${exceedingFiles.length} file${exceedingFiles.length > 1 ? 's' : ''} exceed language line limit (ARCH-001)`,
                files: exceedingFiles.slice(0, 5).map(f => ({ ...f, detail: `${f.lines}/${f.limit} lines (${f.language})` }))
            });
        }

        if (approachingFiles.length > 0) {
            alerts.push({
                type: 'arch_001_warning',
                severity: 'warning',
                message: `${approachingFiles.length} file${approachingFiles.length > 1 ? 's' : ''} approaching language line limit`,
                files: approachingFiles.slice(0, 5).map(f => ({ ...f, detail: `${f.lines}/${f.limit} lines (${f.language})` }))
            });
        }


        // Check for uncommitted changes (Anchor OS files only, not dashboard/tooling)
        const { stdout: gitStatus } = await execAsync('git status --porcelain', {
            cwd: ROOT_PATH,
            timeout: 5000
        });

        if (gitStatus.trim()) {
            // Filter out dashboard internal tooling and build artifacts
            const anchorOsFiles = gitStatus.trim().split('\n').filter(line => {
                const file = line.substring(3); // Remove git status prefix
                return !file.startsWith('tools/dashboard/') &&
                    !file.startsWith('.agent/') &&
                    !file.startsWith('scripts/') &&
                    !file.startsWith('.husky/') &&
                    !file.startsWith('.firebase/');
            });

            const changedFiles = anchorOsFiles.length;
            if (changedFiles > 10) {
                alerts.push({
                    type: 'uncommitted_changes',
                    severity: 'warning',
                    message: `${changedFiles} uncommitted Anchor OS files in working directory`
                });
            } else if (changedFiles > 0) {
                alerts.push({
                    type: 'uncommitted_changes',
                    severity: 'info',
                    message: `${changedFiles} uncommitted Anchor OS file${changedFiles > 1 ? 's' : ''}`
                });
            }
        }


        return {
            alerts,
            lastChecked: new Date().toISOString()
        };
    } catch (error) {
        return { alerts: [], error: error.message };
    }
}

/**
 * Get comprehensive health report
 */
async function getHealthReport() {
    const [fileHealth, anomalies] = await Promise.all([
        checkFileLineCount(),
        detectAnomalies()
    ]);

    return {
        fileHealth,
        anomalies,
        lastChecked: new Date().toISOString()
    };
}

module.exports = {
    checkFileLineCount,
    detectAnomalies,
    getHealthReport
};
