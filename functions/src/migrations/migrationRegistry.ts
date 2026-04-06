/**
 * Migration Registry — ENG-003
 *
 * Central registry of all known migrations. Import and register
 * each migration here. The runner is initialized with all known
 * migrations and exported for use in callable handlers.
 */

import { MigrationRunner } from './migrationRunner';
import { migration001FamilyV2 } from './migrations/001_family_v2';

const runner = new MigrationRunner();

// Register all migrations in order
runner.register(migration001FamilyV2);

export { runner };
