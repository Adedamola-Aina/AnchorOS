/**
 * dependencyChecker.js
 * 
 * Checks for outdated npm dependencies and security vulnerabilities.
 */
// @ts-nocheck


const { exec } = require('child_process');
const path = require('path');
const util = require('util');

const execAsync = util.promisify(exec);
const ROOT_PATH = path.join(__dirname, '../../..');

/**
 * Check for outdated dependencies
 */
async function checkOutdatedDeps() {
    try {
        const { stdout } = await execAsync('npm outdated --json', {
            cwd: ROOT_PATH,
            timeout: 30000
        });

        const outdated = JSON.parse(stdout || '{}');
        const deps = Object.entries(outdated).map(([name, info]) => ({
            name,
            current: info.current,
            wanted: info.wanted,
            latest: info.latest,
            type: info.type,
            severity: getSeverity(info.current, info.latest)
        }));

        return {
            total: deps.length,
            critical: deps.filter(d => d.severity === 'major').length,
            minor: deps.filter(d => d.severity === 'minor').length,
            patch: deps.filter(d => d.severity === 'patch').length,
            dependencies: deps.slice(0, 10) // Limit to top 10
        };
    } catch (error) {
        // npm outdated returns exit code 1 if there are outdated deps
        if (error.stdout) {
            try {
                const outdated = JSON.parse(error.stdout);
                const deps = Object.entries(outdated).map(([name, info]) => ({
                    name,
                    current: info.current,
                    wanted: info.wanted,
                    latest: info.latest,
                    type: info.type,
                    severity: getSeverity(info.current, info.latest)
                }));

                return {
                    total: deps.length,
                    critical: deps.filter(d => d.severity === 'major').length,
                    minor: deps.filter(d => d.severity === 'minor').length,
                    patch: deps.filter(d => d.severity === 'patch').length,
                    dependencies: deps.slice(0, 10)
                };
            } catch {
                return { total: 0, error: 'Parse error' };
            }
        }
        return { total: 0, upToDate: true };
    }
}

/**
 * Check for security vulnerabilities
 */
async function checkSecurityAudit() {
    try {
        const { stdout } = await execAsync('npm audit --json', {
            cwd: ROOT_PATH,
            timeout: 60000
        });

        const audit = JSON.parse(stdout || '{}');
        return {
            vulnerabilities: audit.metadata?.vulnerabilities || { total: 0 },
            advisories: Object.values(audit.advisories || {}).slice(0, 5).map(a => ({
                title: a.title,
                severity: a.severity,
                module: a.module_name,
                recommendation: a.recommendation
            }))
        };
    } catch (error) {
        if (error.stdout) {
            try {
                const audit = JSON.parse(error.stdout);
                return {
                    vulnerabilities: audit.metadata?.vulnerabilities || { total: 0 },
                    advisories: Object.values(audit.advisories || {}).slice(0, 5).map(a => ({
                        title: a.title,
                        severity: a.severity,
                        module: a.module_name
                    }))
                };
            } catch {
                return { vulnerabilities: { total: 0 }, error: 'Parse error' };
            }
        }
        return { vulnerabilities: { total: 0 }, error: error.message };
    }
}

/**
 * Determine severity based on version difference
 */
function getSeverity(current, latest) {
    if (!current || !latest) return 'unknown';

    const [currMajor] = current.split('.').map(Number);
    const [latestMajor] = latest.split('.').map(Number);

    if (latestMajor > currMajor) return 'major';

    const [, currMinor] = current.split('.').map(Number);
    const [, latestMinor] = latest.split('.').map(Number);

    if (latestMinor > currMinor) return 'minor';
    return 'patch';
}

/**
 * Get combined dependency health report
 */
async function getDependencyHealth() {
    const [outdated, security] = await Promise.all([
        checkOutdatedDeps(),
        checkSecurityAudit()
    ]);

    return {
        outdated,
        security,
        status: getHealthStatus(outdated, security),
        lastChecked: new Date().toISOString()
    };
}

function getHealthStatus(outdated, security) {
    const vulns = security.vulnerabilities?.total || 0;
    const criticalDeps = outdated.critical || 0;

    if (vulns > 0 || criticalDeps > 3) return 'critical';
    if (outdated.total > 10) return 'warning';
    return 'healthy';
}

module.exports = { getDependencyHealth, checkOutdatedDeps, checkSecurityAudit };
