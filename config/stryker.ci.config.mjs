/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
// @ts-nocheck
import base from './stryker.config.mjs';

export default {
  ...base,
  mutate: [
    'src/utils/{moneyUtils,finance,format,validation,errorUtils}.ts',
    'src/utils/secureDb.ts',
    'src/services/TransferOperations.ts',
    'src/services/TransactionService.ts',
    'src/services/AccountService.ts',
  ],
  incremental: true,
  thresholds: {
    high: 85,
    low: 70,
    break: 70,
  },
  concurrency: 2,
};
