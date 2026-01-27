/**
 * fileHealthMonitor.js
 * 
 * Monitors codebase health and detects files approaching the 200-line limit.
 * Provides early warnings for ARCH-001 compliance.
 */

const { exec } = require('child_process');
const path = require('path');
const util = require('util');

const execAsync = util.promisify(exec);
const ROOT_PATH = path.join(__dirname, '../../..');

/**
 * Find files approaching or exceeding the 200-line limit
 */
async function checkFileLineCount() {
    try {
        // Find all TypeScript/JavaScript files and count lines (excluding test files)
        const { stdout } = await execAsync(
            `find src -type f \\( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \\) ! -name "*.test.*" ! -name "*.spec.*" -exec wc -l {} + | sort -rn | head -50`,
            { cwd: ROOT_PATH, timeout: 30000 }
        );

        const files = [];
        const lines = stdout.trim().split('\n');

        lines.forEach(line => {
            const match = line.trim().match(/^(\d+)\s+(.+)$/);
            if (match && !match[2].includes('total')) {
                const lineCount = parseInt(match[1]);
                const filePath = match[2];

                // Skip node_modules and build artifacts
                if (!filePath.includes('node_modules') && !filePath.includes('dist')) {
                    files.push({
                        path: filePath,
                        lines: lineCount,
                        status: getFileStatus(lineCount)
                    });
                }
            }
        });

        return {
            files,
            summary: {
                exceeding: files.filter(f => f.lines > 200).length,
                approaching: files.filter(f => f.lines >= 180 && f.lines <= 200).length,
                healthy: files.filter(f => f.lines < 180).length
            }
        };
    } catch (error) {
        return { error: error.message };
    }
}

/**
 * Determine file health status based on line count
 */
function getFileStatus(lineCount) {
    if (lineCount > 200) return 'exceeding';
    if (lineCount >= 180) return 'warning';
    if (lineCount >= 150) return 'caution';
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
        if (fileHealth.summary?.exceeding > 0) {
            alerts.push({
                type: 'arch_001_violation',
                severity: 'critical',
                message: `${fileHealth.summary.exceeding} files exceed 200-line limit (ARCH-001)`,
                files: fileHealth.files.filter(f => f.lines > 200).slice(0, 5)
            });
        }

        if (fileHealth.summary?.approaching > 0) {
            alerts.push({
                type: 'arch_001_warning',
                severity: 'warning',
                message: `${fileHealth.summary.approaching} files approaching 200-line limit (180-200 lines)`,
                files: fileHealth.files.filter(f => f.lines >= 180 && f.lines <= 200).slice(0, 5)
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
