# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.15.0-rc.4](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.4) (2026-03-22)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))

## [1.15.0-rc.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.3) (2026-03-20)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))

## [1.15.0-rc.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.2) (2026-03-20)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))

## [1.15.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.1) (2026-03-20)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))

## [1.15.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.0) (2026-03-20)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))

## [1.15.0-dev.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-dev.1) (2026-03-20)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))

## [1.15.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-dev.0) (2026-03-20)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))

## [1.15.0-rc.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.2) (2026-03-20)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))

## [1.15.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.1) (2026-03-19)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))

## [1.15.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.0) (2026-03-19)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))

## [1.15.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-dev.0) (2026-03-19)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))

## [1.15.0-rc.4](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.4) (2026-03-19)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))

## [1.15.0-rc.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.3) (2026-03-19)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))

## [1.15.0-rc.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.2) (2026-03-19)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))

## [1.15.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.1) (2026-03-19)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))

## [1.15.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.0) (2026-03-19)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))

## [1.15.0-dev.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-dev.2) (2026-03-19)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))

## [1.15.0-dev.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-dev.1) (2026-03-19)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))

## [1.15.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-dev.0) (2026-03-19)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))

## [1.14.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.2...v1.14.3) (2026-03-17)


### Bug Fixes

* **deploy:** add --yes flag for non-interactive CI deploys ([ab1b372](https://github.com/Adedamola-Aina/AnchorOS/commit/ab1b372d39d98af6bd01ff37c008dda80d8fb97e))

## [1.14.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.1...v1.14.2) (2026-03-17)

## [1.14.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.0...v1.14.1) (2026-03-17)

## [1.14.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.12.0...v1.14.0) (2026-03-17)


### Features

* **dashboard:** enterprise kanban, archive viewer, intelligence panels ([455724c](https://github.com/Adedamola-Aina/AnchorOS/commit/455724ce8cce0b052130da5b52ce5de7986818fd))
* **fabric:** day-of-week intelligence (session 1) ([d9d2167](https://github.com/Adedamola-Aina/AnchorOS/commit/d9d21671cd987ad0c0dd0cfa703bcf787335996a))
* **fabric:** session 0a foundation fixes ([09658e6](https://github.com/Adedamola-Aina/AnchorOS/commit/09658e6379ca411932b01fff8d84891a001eddc9))
* **fabric:** session 0b analytics + observability ([191c88a](https://github.com/Adedamola-Aina/AnchorOS/commit/191c88a6f01b41dab901a24f0c90560aa3e51635))
* **fabric:** session 2 finance x commitment correlation ([f805aa9](https://github.com/Adedamola-Aina/AnchorOS/commit/f805aa9fbb43624aa3222048824dc16f3ceb9319))
* **fabric:** session 3 nlp improvements + new query handlers ([cdfb54d](https://github.com/Adedamola-Aina/AnchorOS/commit/cdfb54d110e85c08a919a036b73c2b3a90166d69))
* **fabric:** session 4 behavioral engine informs predictions ([dbadf19](https://github.com/Adedamola-Aina/AnchorOS/commit/dbadf19645cfb1c83723cf7561d5835883052efe))
* **fabric:** session 5 - ai asks questions back ([4f3a674](https://github.com/Adedamola-Aina/AnchorOS/commit/4f3a674e2c8c225ca8581f8ee22cf7b8062dd834))
* **fabric:** session 6 - proactive push nudges ([1a4fe3f](https://github.com/Adedamola-Aina/AnchorOS/commit/1a4fe3f19d8b23023e9887291017b39eb8934ab2))


### Bug Fixes

* **fabric:** add data-testid to FabricView root for test selector ([ef2eec0](https://github.com/Adedamola-Aina/AnchorOS/commit/ef2eec0d60ba3c3f4be27d144c2a4623ee072e24))
* **fabric:** resolve typescript errors from arch-001 splits ([54e165c](https://github.com/Adedamola-Aina/AnchorOS/commit/54e165c3cecde267703bb64f446c47b173d2a94a))
* **functions:** harden fabric nudge timezone and rules coverage ([0c62bba](https://github.com/Adedamola-Aina/AnchorOS/commit/0c62bbacaf4c95860b8903d4f1ec7c1a01cc1733))


### Performance

* **app:** gate ReactQueryDevtools behind import.meta.env.DEV ([3016a28](https://github.com/Adedamola-Aina/AnchorOS/commit/3016a2881b1e93c7c49d082fa2f24ec6722fee81))
* **components:** React.memo on AccountCard — renders in account list ([5cdd5f6](https://github.com/Adedamola-Aina/AnchorOS/commit/5cdd5f6d694c0521962e9cdcb0580472f3356934))
* **components:** React.memo on CategoryIcon — renders in every transaction row ([c4e589c](https://github.com/Adedamola-Aina/AnchorOS/commit/c4e589c26947fc325e488e318afe9f7b68ff313d))
* **components:** React.memo on TransactionItem — renders in transaction lists ([fa47384](https://github.com/Adedamola-Aina/AnchorOS/commit/fa47384cdc03eb47f7603701d846d3670cadf173))
* **html:** add preconnect and dns-prefetch hints for Firebase domains ([9d39a87](https://github.com/Adedamola-Aina/AnchorOS/commit/9d39a871dbc04d81cb559d5336b7f301eebaf330))
* **sentry:** reduce production tracesSampleRate from 1.0 to 0.1 ([6e0b0c0](https://github.com/Adedamola-Aina/AnchorOS/commit/6e0b0c02b9e647eab4b0ddf8052b335a6567305d))
* **sw:** auto-patch service worker cache version from package.json at build time ([59cc19d](https://github.com/Adedamola-Aina/AnchorOS/commit/59cc19d8f855cae1422a28353d97c71d66f6e611))

## [1.13.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.12.0...v1.13.0-rc.0) (2026-03-17)


### Features

* **dashboard:** enterprise kanban, archive viewer, intelligence panels ([455724c](https://github.com/Adedamola-Aina/AnchorOS/commit/455724ce8cce0b052130da5b52ce5de7986818fd))
* **fabric:** day-of-week intelligence (session 1) ([d9d2167](https://github.com/Adedamola-Aina/AnchorOS/commit/d9d21671cd987ad0c0dd0cfa703bcf787335996a))
* **fabric:** session 0a foundation fixes ([09658e6](https://github.com/Adedamola-Aina/AnchorOS/commit/09658e6379ca411932b01fff8d84891a001eddc9))
* **fabric:** session 0b analytics + observability ([191c88a](https://github.com/Adedamola-Aina/AnchorOS/commit/191c88a6f01b41dab901a24f0c90560aa3e51635))
* **fabric:** session 2 finance x commitment correlation ([f805aa9](https://github.com/Adedamola-Aina/AnchorOS/commit/f805aa9fbb43624aa3222048824dc16f3ceb9319))
* **fabric:** session 3 nlp improvements + new query handlers ([cdfb54d](https://github.com/Adedamola-Aina/AnchorOS/commit/cdfb54d110e85c08a919a036b73c2b3a90166d69))
* **fabric:** session 4 behavioral engine informs predictions ([dbadf19](https://github.com/Adedamola-Aina/AnchorOS/commit/dbadf19645cfb1c83723cf7561d5835883052efe))
* **fabric:** session 5 - ai asks questions back ([4f3a674](https://github.com/Adedamola-Aina/AnchorOS/commit/4f3a674e2c8c225ca8581f8ee22cf7b8062dd834))
* **fabric:** session 6 - proactive push nudges ([1a4fe3f](https://github.com/Adedamola-Aina/AnchorOS/commit/1a4fe3f19d8b23023e9887291017b39eb8934ab2))


### Bug Fixes

* **fabric:** resolve typescript errors from arch-001 splits ([54e165c](https://github.com/Adedamola-Aina/AnchorOS/commit/54e165c3cecde267703bb64f446c47b173d2a94a))
* **functions:** harden fabric nudge timezone and rules coverage ([0c62bba](https://github.com/Adedamola-Aina/AnchorOS/commit/0c62bbacaf4c95860b8903d4f1ec7c1a01cc1733))

## [1.13.0-dev.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.12.0...v1.13.0-dev.1) (2026-03-17)


### Features

* **dashboard:** enterprise kanban, archive viewer, intelligence panels ([455724c](https://github.com/Adedamola-Aina/AnchorOS/commit/455724ce8cce0b052130da5b52ce5de7986818fd))
* **fabric:** day-of-week intelligence (session 1) ([d9d2167](https://github.com/Adedamola-Aina/AnchorOS/commit/d9d21671cd987ad0c0dd0cfa703bcf787335996a))
* **fabric:** session 0a foundation fixes ([09658e6](https://github.com/Adedamola-Aina/AnchorOS/commit/09658e6379ca411932b01fff8d84891a001eddc9))
* **fabric:** session 0b analytics + observability ([191c88a](https://github.com/Adedamola-Aina/AnchorOS/commit/191c88a6f01b41dab901a24f0c90560aa3e51635))
* **fabric:** session 2 finance x commitment correlation ([f805aa9](https://github.com/Adedamola-Aina/AnchorOS/commit/f805aa9fbb43624aa3222048824dc16f3ceb9319))
* **fabric:** session 3 nlp improvements + new query handlers ([cdfb54d](https://github.com/Adedamola-Aina/AnchorOS/commit/cdfb54d110e85c08a919a036b73c2b3a90166d69))
* **fabric:** session 4 behavioral engine informs predictions ([dbadf19](https://github.com/Adedamola-Aina/AnchorOS/commit/dbadf19645cfb1c83723cf7561d5835883052efe))
* **fabric:** session 5 - ai asks questions back ([4f3a674](https://github.com/Adedamola-Aina/AnchorOS/commit/4f3a674e2c8c225ca8581f8ee22cf7b8062dd834))
* **fabric:** session 6 - proactive push nudges ([1a4fe3f](https://github.com/Adedamola-Aina/AnchorOS/commit/1a4fe3f19d8b23023e9887291017b39eb8934ab2))


### Bug Fixes

* **fabric:** resolve typescript errors from arch-001 splits ([54e165c](https://github.com/Adedamola-Aina/AnchorOS/commit/54e165c3cecde267703bb64f446c47b173d2a94a))
* **functions:** harden fabric nudge timezone and rules coverage ([0c62bba](https://github.com/Adedamola-Aina/AnchorOS/commit/0c62bbacaf4c95860b8903d4f1ec7c1a01cc1733))

## [1.13.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.12.0...v1.13.0-dev.0) (2026-03-17)


### Features

* **dashboard:** enterprise kanban, archive viewer, intelligence panels ([455724c](https://github.com/Adedamola-Aina/AnchorOS/commit/455724ce8cce0b052130da5b52ce5de7986818fd))
* **fabric:** day-of-week intelligence (session 1) ([d9d2167](https://github.com/Adedamola-Aina/AnchorOS/commit/d9d21671cd987ad0c0dd0cfa703bcf787335996a))
* **fabric:** session 0a foundation fixes ([09658e6](https://github.com/Adedamola-Aina/AnchorOS/commit/09658e6379ca411932b01fff8d84891a001eddc9))
* **fabric:** session 0b analytics + observability ([191c88a](https://github.com/Adedamola-Aina/AnchorOS/commit/191c88a6f01b41dab901a24f0c90560aa3e51635))
* **fabric:** session 2 finance x commitment correlation ([f805aa9](https://github.com/Adedamola-Aina/AnchorOS/commit/f805aa9fbb43624aa3222048824dc16f3ceb9319))
* **fabric:** session 3 nlp improvements + new query handlers ([cdfb54d](https://github.com/Adedamola-Aina/AnchorOS/commit/cdfb54d110e85c08a919a036b73c2b3a90166d69))
* **fabric:** session 4 behavioral engine informs predictions ([dbadf19](https://github.com/Adedamola-Aina/AnchorOS/commit/dbadf19645cfb1c83723cf7561d5835883052efe))
* **fabric:** session 5 - ai asks questions back ([4f3a674](https://github.com/Adedamola-Aina/AnchorOS/commit/4f3a674e2c8c225ca8581f8ee22cf7b8062dd834))
* **fabric:** session 6 - proactive push nudges ([1a4fe3f](https://github.com/Adedamola-Aina/AnchorOS/commit/1a4fe3f19d8b23023e9887291017b39eb8934ab2))


### Bug Fixes

* **functions:** harden fabric nudge timezone and rules coverage ([0c62bba](https://github.com/Adedamola-Aina/AnchorOS/commit/0c62bbacaf4c95860b8903d4f1ec7c1a01cc1733))

## [1.13.0-rc.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.12.0...v1.13.0-rc.2) (2026-03-15)


### Features

* **fabric:** day-of-week intelligence (session 1) ([d9d2167](https://github.com/Adedamola-Aina/AnchorOS/commit/d9d21671cd987ad0c0dd0cfa703bcf787335996a))
* **fabric:** session 0a foundation fixes ([09658e6](https://github.com/Adedamola-Aina/AnchorOS/commit/09658e6379ca411932b01fff8d84891a001eddc9))
* **fabric:** session 0b analytics + observability ([191c88a](https://github.com/Adedamola-Aina/AnchorOS/commit/191c88a6f01b41dab901a24f0c90560aa3e51635))
* **fabric:** session 2 finance x commitment correlation ([f805aa9](https://github.com/Adedamola-Aina/AnchorOS/commit/f805aa9fbb43624aa3222048824dc16f3ceb9319))
* **fabric:** session 3 nlp improvements + new query handlers ([cdfb54d](https://github.com/Adedamola-Aina/AnchorOS/commit/cdfb54d110e85c08a919a036b73c2b3a90166d69))
* **fabric:** session 4 behavioral engine informs predictions ([dbadf19](https://github.com/Adedamola-Aina/AnchorOS/commit/dbadf19645cfb1c83723cf7561d5835883052efe))
* **fabric:** session 5 - ai asks questions back ([4f3a674](https://github.com/Adedamola-Aina/AnchorOS/commit/4f3a674e2c8c225ca8581f8ee22cf7b8062dd834))
* **fabric:** session 6 - proactive push nudges ([1a4fe3f](https://github.com/Adedamola-Aina/AnchorOS/commit/1a4fe3f19d8b23023e9887291017b39eb8934ab2))


### Bug Fixes

* **functions:** harden fabric nudge timezone and rules coverage ([0c62bba](https://github.com/Adedamola-Aina/AnchorOS/commit/0c62bbacaf4c95860b8903d4f1ec7c1a01cc1733))

## [1.13.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.12.0...v1.13.0-rc.1) (2026-03-15)


### Features

* **fabric:** day-of-week intelligence (session 1) ([d9d2167](https://github.com/Adedamola-Aina/AnchorOS/commit/d9d21671cd987ad0c0dd0cfa703bcf787335996a))
* **fabric:** session 0a foundation fixes ([09658e6](https://github.com/Adedamola-Aina/AnchorOS/commit/09658e6379ca411932b01fff8d84891a001eddc9))
* **fabric:** session 0b analytics + observability ([191c88a](https://github.com/Adedamola-Aina/AnchorOS/commit/191c88a6f01b41dab901a24f0c90560aa3e51635))
* **fabric:** session 2 finance x commitment correlation ([f805aa9](https://github.com/Adedamola-Aina/AnchorOS/commit/f805aa9fbb43624aa3222048824dc16f3ceb9319))
* **fabric:** session 3 nlp improvements + new query handlers ([cdfb54d](https://github.com/Adedamola-Aina/AnchorOS/commit/cdfb54d110e85c08a919a036b73c2b3a90166d69))
* **fabric:** session 4 behavioral engine informs predictions ([dbadf19](https://github.com/Adedamola-Aina/AnchorOS/commit/dbadf19645cfb1c83723cf7561d5835883052efe))
* **fabric:** session 5 - ai asks questions back ([4f3a674](https://github.com/Adedamola-Aina/AnchorOS/commit/4f3a674e2c8c225ca8581f8ee22cf7b8062dd834))
* **fabric:** session 6 - proactive push nudges ([1a4fe3f](https://github.com/Adedamola-Aina/AnchorOS/commit/1a4fe3f19d8b23023e9887291017b39eb8934ab2))


### Bug Fixes

* **functions:** harden fabric nudge timezone and rules coverage ([0c62bba](https://github.com/Adedamola-Aina/AnchorOS/commit/0c62bbacaf4c95860b8903d4f1ec7c1a01cc1733))

## [1.13.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.12.0...v1.13.0-rc.0) (2026-03-15)


### Features

* **fabric:** day-of-week intelligence (session 1) ([d9d2167](https://github.com/Adedamola-Aina/AnchorOS/commit/d9d21671cd987ad0c0dd0cfa703bcf787335996a))
* **fabric:** session 0a foundation fixes ([09658e6](https://github.com/Adedamola-Aina/AnchorOS/commit/09658e6379ca411932b01fff8d84891a001eddc9))
* **fabric:** session 0b analytics + observability ([191c88a](https://github.com/Adedamola-Aina/AnchorOS/commit/191c88a6f01b41dab901a24f0c90560aa3e51635))
* **fabric:** session 2 finance x commitment correlation ([f805aa9](https://github.com/Adedamola-Aina/AnchorOS/commit/f805aa9fbb43624aa3222048824dc16f3ceb9319))
* **fabric:** session 3 nlp improvements + new query handlers ([cdfb54d](https://github.com/Adedamola-Aina/AnchorOS/commit/cdfb54d110e85c08a919a036b73c2b3a90166d69))
* **fabric:** session 4 behavioral engine informs predictions ([dbadf19](https://github.com/Adedamola-Aina/AnchorOS/commit/dbadf19645cfb1c83723cf7561d5835883052efe))
* **fabric:** session 5 - ai asks questions back ([4f3a674](https://github.com/Adedamola-Aina/AnchorOS/commit/4f3a674e2c8c225ca8581f8ee22cf7b8062dd834))
* **fabric:** session 6 - proactive push nudges ([1a4fe3f](https://github.com/Adedamola-Aina/AnchorOS/commit/1a4fe3f19d8b23023e9887291017b39eb8934ab2))


### Bug Fixes

* **functions:** harden fabric nudge timezone and rules coverage ([0c62bba](https://github.com/Adedamola-Aina/AnchorOS/commit/0c62bbacaf4c95860b8903d4f1ec7c1a01cc1733))

## [1.13.0-dev.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.12.0...v1.13.0-dev.1) (2026-03-15)


### Features

* **fabric:** day-of-week intelligence (session 1) ([d9d2167](https://github.com/Adedamola-Aina/AnchorOS/commit/d9d21671cd987ad0c0dd0cfa703bcf787335996a))
* **fabric:** session 0a foundation fixes ([09658e6](https://github.com/Adedamola-Aina/AnchorOS/commit/09658e6379ca411932b01fff8d84891a001eddc9))
* **fabric:** session 0b analytics + observability ([191c88a](https://github.com/Adedamola-Aina/AnchorOS/commit/191c88a6f01b41dab901a24f0c90560aa3e51635))
* **fabric:** session 2 finance x commitment correlation ([f805aa9](https://github.com/Adedamola-Aina/AnchorOS/commit/f805aa9fbb43624aa3222048824dc16f3ceb9319))
* **fabric:** session 3 nlp improvements + new query handlers ([cdfb54d](https://github.com/Adedamola-Aina/AnchorOS/commit/cdfb54d110e85c08a919a036b73c2b3a90166d69))
* **fabric:** session 4 behavioral engine informs predictions ([dbadf19](https://github.com/Adedamola-Aina/AnchorOS/commit/dbadf19645cfb1c83723cf7561d5835883052efe))
* **fabric:** session 5 - ai asks questions back ([4f3a674](https://github.com/Adedamola-Aina/AnchorOS/commit/4f3a674e2c8c225ca8581f8ee22cf7b8062dd834))
* **fabric:** session 6 - proactive push nudges ([1a4fe3f](https://github.com/Adedamola-Aina/AnchorOS/commit/1a4fe3f19d8b23023e9887291017b39eb8934ab2))


### Bug Fixes

* **functions:** harden fabric nudge timezone and rules coverage ([0c62bba](https://github.com/Adedamola-Aina/AnchorOS/commit/0c62bbacaf4c95860b8903d4f1ec7c1a01cc1733))

## [1.13.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.12.0...v1.13.0-dev.0) (2026-03-15)


### Features

* **fabric:** day-of-week intelligence (session 1) ([d9d2167](https://github.com/Adedamola-Aina/AnchorOS/commit/d9d21671cd987ad0c0dd0cfa703bcf787335996a))
* **fabric:** session 0a foundation fixes ([09658e6](https://github.com/Adedamola-Aina/AnchorOS/commit/09658e6379ca411932b01fff8d84891a001eddc9))
* **fabric:** session 0b analytics + observability ([191c88a](https://github.com/Adedamola-Aina/AnchorOS/commit/191c88a6f01b41dab901a24f0c90560aa3e51635))
* **fabric:** session 2 finance x commitment correlation ([f805aa9](https://github.com/Adedamola-Aina/AnchorOS/commit/f805aa9fbb43624aa3222048824dc16f3ceb9319))
* **fabric:** session 3 nlp improvements + new query handlers ([cdfb54d](https://github.com/Adedamola-Aina/AnchorOS/commit/cdfb54d110e85c08a919a036b73c2b3a90166d69))
* **fabric:** session 4 behavioral engine informs predictions ([dbadf19](https://github.com/Adedamola-Aina/AnchorOS/commit/dbadf19645cfb1c83723cf7561d5835883052efe))
* **fabric:** session 5 - ai asks questions back ([4f3a674](https://github.com/Adedamola-Aina/AnchorOS/commit/4f3a674e2c8c225ca8581f8ee22cf7b8062dd834))
* **fabric:** session 6 - proactive push nudges ([1a4fe3f](https://github.com/Adedamola-Aina/AnchorOS/commit/1a4fe3f19d8b23023e9887291017b39eb8934ab2))


### Bug Fixes

* **functions:** harden fabric nudge timezone and rules coverage ([0c62bba](https://github.com/Adedamola-Aina/AnchorOS/commit/0c62bbacaf4c95860b8903d4f1ec7c1a01cc1733))

## [1.13.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.12.0...v1.13.0-rc.0) (2026-03-15)


### Features

* **fabric:** session 0a foundation fixes ([09658e6](https://github.com/Adedamola-Aina/AnchorOS/commit/09658e6379ca411932b01fff8d84891a001eddc9))
* **fabric:** session 0b analytics + observability ([191c88a](https://github.com/Adedamola-Aina/AnchorOS/commit/191c88a6f01b41dab901a24f0c90560aa3e51635))

## [1.13.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.12.0...v1.13.0-dev.0) (2026-03-15)


### Features

* **fabric:** session 0a foundation fixes ([09658e6](https://github.com/Adedamola-Aina/AnchorOS/commit/09658e6379ca411932b01fff8d84891a001eddc9))
* **fabric:** session 0b analytics + observability ([191c88a](https://github.com/Adedamola-Aina/AnchorOS/commit/191c88a6f01b41dab901a24f0c90560aa3e51635))

## [1.12.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.11.2...v1.12.0) (2026-03-15)


### Features

* **fabric:** enable Anchor AI feature flag in production (100% rollout) ([09a2085](https://github.com/Adedamola-Aina/AnchorOS/commit/09a208549a421283f1800417f9f91427086ff5b2))

## [1.11.3-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.11.2...v1.11.3-rc.1) (2026-03-15)

## [1.11.3-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.11.2...v1.11.3-rc.0) (2026-03-15)

## [1.11.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.11.1...v1.11.2) (2026-03-15)

## [1.11.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.11.0...v1.11.1) (2026-03-13)

## [1.11.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.10.6...v1.11.0) (2026-03-13)


### Features

* **deploy:** add --skip-mutation flag to deploy pipeline ([8ae254a](https://github.com/Adedamola-Aina/AnchorOS/commit/8ae254ac4fdab5dc5bbe5e9f4100bb5e974ed43f))

## [1.10.6](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.10.5...v1.10.6) (2026-03-13)

## [1.10.5](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.10.4...v1.10.5) (2026-03-13)

## [1.10.4](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.10.3...v1.10.4) (2026-03-13)

## [1.10.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.10.2...v1.10.3) (2026-03-13)

## [1.10.3-rc.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.10.2...v1.10.3-rc.3) (2026-03-13)

## [1.10.3-rc.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.10.2...v1.10.3-rc.2) (2026-03-12)

## [1.10.3-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.10.2...v1.10.3-rc.1) (2026-03-12)

## [1.10.3-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.10.2...v1.10.3-rc.0) (2026-03-12)

## [1.10.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.10.1...v1.10.2) (2026-03-12)

## [1.10.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.10.0...v1.10.1) (2026-03-11)

## [1.10.1-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.10.0...v1.10.1-dev.0) (2026-03-11)

## [1.10.1-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.10.0...v1.10.1-rc.0) (2026-03-11)

## [1.10.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0) (2026-03-11)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))
* **fabric:** proactive daily companion — briefing, mood, today + upcoming cards ([c819c89](https://github.com/Adedamola-Aina/AnchorOS/commit/c819c893356eb66e57a80ca911d1515d258d06c9))


### Bug Fixes

* **csp:** add gstatic.com to connect-src for reCAPTCHA/App Check ([df7d975](https://github.com/Adedamola-Aina/AnchorOS/commit/df7d975d69bc30affc6c9b5eef97453902b780b2))
* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** route mood Firestore ops through secureDb [anti-pattern [#8](https://github.com/Adedamola-Aina/AnchorOS/issues/8)] ([5ba26da](https://github.com/Adedamola-Aina/AnchorOS/commit/5ba26da0336b29eb3a0d3501c1f987e8adc548b6))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **mobile:** replace native <select> with touch-friendly button pickers [BUG-107] ([7ea5a14](https://github.com/Adedamola-Aina/AnchorOS/commit/7ea5a14a059057ee5fb8c213bbbfcc4bcd0cfb09))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.3) (2026-03-11)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))
* **fabric:** proactive daily companion — briefing, mood, today + upcoming cards ([c819c89](https://github.com/Adedamola-Aina/AnchorOS/commit/c819c893356eb66e57a80ca911d1515d258d06c9))


### Bug Fixes

* **csp:** add gstatic.com to connect-src for reCAPTCHA/App Check ([df7d975](https://github.com/Adedamola-Aina/AnchorOS/commit/df7d975d69bc30affc6c9b5eef97453902b780b2))
* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** route mood Firestore ops through secureDb [anti-pattern [#8](https://github.com/Adedamola-Aina/AnchorOS/issues/8)] ([5ba26da](https://github.com/Adedamola-Aina/AnchorOS/commit/5ba26da0336b29eb3a0d3501c1f987e8adc548b6))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **mobile:** replace native <select> with touch-friendly button pickers [BUG-107] ([7ea5a14](https://github.com/Adedamola-Aina/AnchorOS/commit/7ea5a14a059057ee5fb8c213bbbfcc4bcd0cfb09))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.2) (2026-03-11)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))
* **fabric:** proactive daily companion — briefing, mood, today + upcoming cards ([c819c89](https://github.com/Adedamola-Aina/AnchorOS/commit/c819c893356eb66e57a80ca911d1515d258d06c9))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** route mood Firestore ops through secureDb [anti-pattern [#8](https://github.com/Adedamola-Aina/AnchorOS/issues/8)] ([5ba26da](https://github.com/Adedamola-Aina/AnchorOS/commit/5ba26da0336b29eb3a0d3501c1f987e8adc548b6))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **mobile:** replace native <select> with touch-friendly button pickers [BUG-107] ([7ea5a14](https://github.com/Adedamola-Aina/AnchorOS/commit/7ea5a14a059057ee5fb8c213bbbfcc4bcd0cfb09))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.1) (2026-03-11)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))
* **fabric:** proactive daily companion — briefing, mood, today + upcoming cards ([c819c89](https://github.com/Adedamola-Aina/AnchorOS/commit/c819c893356eb66e57a80ca911d1515d258d06c9))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** route mood Firestore ops through secureDb [anti-pattern [#8](https://github.com/Adedamola-Aina/AnchorOS/issues/8)] ([5ba26da](https://github.com/Adedamola-Aina/AnchorOS/commit/5ba26da0336b29eb3a0d3501c1f987e8adc548b6))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **mobile:** replace native <select> with touch-friendly button pickers [BUG-107] ([7ea5a14](https://github.com/Adedamola-Aina/AnchorOS/commit/7ea5a14a059057ee5fb8c213bbbfcc4bcd0cfb09))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.0) (2026-03-11)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))
* **fabric:** proactive daily companion — briefing, mood, today + upcoming cards ([c819c89](https://github.com/Adedamola-Aina/AnchorOS/commit/c819c893356eb66e57a80ca911d1515d258d06c9))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** route mood Firestore ops through secureDb [anti-pattern [#8](https://github.com/Adedamola-Aina/AnchorOS/issues/8)] ([5ba26da](https://github.com/Adedamola-Aina/AnchorOS/commit/5ba26da0336b29eb3a0d3501c1f987e8adc548b6))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **mobile:** replace native <select> with touch-friendly button pickers [BUG-107] ([7ea5a14](https://github.com/Adedamola-Aina/AnchorOS/commit/7ea5a14a059057ee5fb8c213bbbfcc4bcd0cfb09))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-dev.0) (2026-03-11)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))
* **fabric:** proactive daily companion — briefing, mood, today + upcoming cards ([c819c89](https://github.com/Adedamola-Aina/AnchorOS/commit/c819c893356eb66e57a80ca911d1515d258d06c9))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** route mood Firestore ops through secureDb [anti-pattern [#8](https://github.com/Adedamola-Aina/AnchorOS/issues/8)] ([5ba26da](https://github.com/Adedamola-Aina/AnchorOS/commit/5ba26da0336b29eb3a0d3501c1f987e8adc548b6))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **mobile:** replace native <select> with touch-friendly button pickers [BUG-107] ([7ea5a14](https://github.com/Adedamola-Aina/AnchorOS/commit/7ea5a14a059057ee5fb8c213bbbfcc4bcd0cfb09))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.0) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))
* **fabric:** proactive daily companion — briefing, mood, today + upcoming cards ([c819c89](https://github.com/Adedamola-Aina/AnchorOS/commit/c819c893356eb66e57a80ca911d1515d258d06c9))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** route mood Firestore ops through secureDb [anti-pattern [#8](https://github.com/Adedamola-Aina/AnchorOS/issues/8)] ([5ba26da](https://github.com/Adedamola-Aina/AnchorOS/commit/5ba26da0336b29eb3a0d3501c1f987e8adc548b6))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **mobile:** replace native <select> with touch-friendly button pickers [BUG-107] ([7ea5a14](https://github.com/Adedamola-Aina/AnchorOS/commit/7ea5a14a059057ee5fb8c213bbbfcc4bcd0cfb09))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-dev.0) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))
* **fabric:** proactive daily companion — briefing, mood, today + upcoming cards ([c819c89](https://github.com/Adedamola-Aina/AnchorOS/commit/c819c893356eb66e57a80ca911d1515d258d06c9))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** route mood Firestore ops through secureDb [anti-pattern [#8](https://github.com/Adedamola-Aina/AnchorOS/issues/8)] ([5ba26da](https://github.com/Adedamola-Aina/AnchorOS/commit/5ba26da0336b29eb3a0d3501c1f987e8adc548b6))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **mobile:** replace native <select> with touch-friendly button pickers [BUG-107] ([7ea5a14](https://github.com/Adedamola-Aina/AnchorOS/commit/7ea5a14a059057ee5fb8c213bbbfcc4bcd0cfb09))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.0) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))
* **fabric:** proactive daily companion — briefing, mood, today + upcoming cards ([c819c89](https://github.com/Adedamola-Aina/AnchorOS/commit/c819c893356eb66e57a80ca911d1515d258d06c9))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** route mood Firestore ops through secureDb [anti-pattern [#8](https://github.com/Adedamola-Aina/AnchorOS/issues/8)] ([5ba26da](https://github.com/Adedamola-Aina/AnchorOS/commit/5ba26da0336b29eb3a0d3501c1f987e8adc548b6))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **mobile:** replace native <select> with touch-friendly button pickers [BUG-107] ([7ea5a14](https://github.com/Adedamola-Aina/AnchorOS/commit/7ea5a14a059057ee5fb8c213bbbfcc4bcd0cfb09))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-dev.0) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.3) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.2) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.1) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.0) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-dev.0) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.0) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-dev.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-dev.1) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-dev.0) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.0) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-dev.0) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.2) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.1) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.0) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-dev.0) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.0) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-dev.0) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** display query results in FabricView + upgrade functions to Node 22 ([9dded3f](https://github.com/Adedamola-Aina/AnchorOS/commit/9dded3f47f2e9502c544099b7f894527280d6de8))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.0) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-dev.0) (2026-03-10)


### Features

* **fabric:** complete Anchor AI audit — security, deduplication, and CRUD ([be57860](https://github.com/Adedamola-Aina/AnchorOS/commit/be57860406f3705470ec35938948100f17d8b4b1))
* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.0) (2026-03-10)


### Features

* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-dev.0) (2026-03-10)


### Features

* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.2) (2026-03-10)


### Features

* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.1) (2026-03-10)


### Features

* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.0) (2026-03-10)


### Features

* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-dev.0) (2026-03-10)


### Features

* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **deploy:** include functions in deploy pipeline targets ([6f29616](https://github.com/Adedamola-Aina/AnchorOS/commit/6f296168d6557086bb5ca23ac960629a43d9806a))
* **fabric:** show category in AI pattern descriptions [BUG-106] ([798c7f7](https://github.com/Adedamola-Aina/AnchorOS/commit/798c7f7af2885f70148f02d95b34b0b665e844bc))
* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))
* **types:** resolve toBeInTheDocument TS errors in test files ([77b33cc](https://github.com/Adedamola-Aina/AnchorOS/commit/77b33cc88684dac745a9d319d6f8a4b74148fb3e))

## [1.10.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-rc.0) (2026-03-09)


### Features

* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))

## [1.10.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.1...v1.10.0-dev.0) (2026-03-09)


### Features

* **fabric:** fin-012 anchor ai fabric foundation rollout ([4e0cb7a](https://github.com/Adedamola-Aina/AnchorOS/commit/4e0cb7a0b8b6a212f7df9e48d4ab80223fa64b6e))
* **fabric:** fin-013 complete anchor ai remaining phases ([84bed6d](https://github.com/Adedamola-Aina/AnchorOS/commit/84bed6d4641bf998102b3c2585232eed961e999b))


### Bug Fixes

* **fabric:** stabilize deploy type-safety gates ([5a10f15](https://github.com/Adedamola-Aina/AnchorOS/commit/5a10f158ee53acc70fc4fb20755cbcae63541e6e))

## [1.9.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.9.0...v1.9.1) (2026-03-06)

## [1.9.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.17...v1.9.0) (2026-03-06)


### Features

* **finance:** add filter persistence, csv export, and web vitals monitoring ([da46283](https://github.com/Adedamola-Aina/AnchorOS/commit/da46283b68665b9c2c92c93567373d2fe4577fe7))
* **finance:** add offline queue, bill reminders, and transaction insights ([f7106c8](https://github.com/Adedamola-Aina/AnchorOS/commit/f7106c8221005d967f6e1bd924cb17a7ebc9c6a2))
* **finance:** mono bank integration and blind spot fixes ([9d70758](https://github.com/Adedamola-Aina/AnchorOS/commit/9d707580cf99a2ecf2c59aabab7e1577902f35d7))
* **notifications:** improve push reminder reliability ([4d20428](https://github.com/Adedamola-Aina/AnchorOS/commit/4d204285f38738dc41f3f0e70281ccd223343a67))


### Bug Fixes

* **auth:** harden mfa recovery and auth/finance guards ([e265916](https://github.com/Adedamola-Aina/AnchorOS/commit/e2659163a97a552f053cd5b19bc1768d8aa0f8f2))
* **build:** remove deprecated onFID, fix useRef initial value ([1c01c7e](https://github.com/Adedamola-Aina/AnchorOS/commit/1c01c7e28de49b4f875ae4240f816857bcb461af))
* **email:** prefix unused recipient with underscore ([81dea0a](https://github.com/Adedamola-Aina/AnchorOS/commit/81dea0ac4c916c68768fd603db8a9a8da97ad46c))
* **security:** harden auth, secrets, CSP, HSTS, and data exposure ([50d3451](https://github.com/Adedamola-Aina/AnchorOS/commit/50d345169d930850a9290fbc3efee0158c6b1807))
* **security:** harden rate limits and immutable audit trail ([8e95d8f](https://github.com/Adedamola-Aina/AnchorOS/commit/8e95d8f158b51be3bb39bc6487100f02bdd482f4))
* **security:** remediate advisories and trusted iframe sources ([eae3144](https://github.com/Adedamola-Aina/AnchorOS/commit/eae31445b2d4011ee3d524a9244017245e9e478c))
* **settings:** remove ts-nocheck, verify external connection prop ([be7f4ae](https://github.com/Adedamola-Aina/AnchorOS/commit/be7f4ae7dfa05788ee7a0120672f37fc12353926))

## [1.9.0-rc.5](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.17...v1.9.0-rc.5) (2026-03-06)


### Features

* **finance:** add filter persistence, csv export, and web vitals monitoring ([da46283](https://github.com/Adedamola-Aina/AnchorOS/commit/da46283b68665b9c2c92c93567373d2fe4577fe7))
* **finance:** add offline queue, bill reminders, and transaction insights ([f7106c8](https://github.com/Adedamola-Aina/AnchorOS/commit/f7106c8221005d967f6e1bd924cb17a7ebc9c6a2))
* **finance:** mono bank integration and blind spot fixes ([9d70758](https://github.com/Adedamola-Aina/AnchorOS/commit/9d707580cf99a2ecf2c59aabab7e1577902f35d7))
* **notifications:** improve push reminder reliability ([4d20428](https://github.com/Adedamola-Aina/AnchorOS/commit/4d204285f38738dc41f3f0e70281ccd223343a67))


### Bug Fixes

* **auth:** harden mfa recovery and auth/finance guards ([e265916](https://github.com/Adedamola-Aina/AnchorOS/commit/e2659163a97a552f053cd5b19bc1768d8aa0f8f2))
* **build:** remove deprecated onFID, fix useRef initial value ([1c01c7e](https://github.com/Adedamola-Aina/AnchorOS/commit/1c01c7e28de49b4f875ae4240f816857bcb461af))
* **email:** prefix unused recipient with underscore ([81dea0a](https://github.com/Adedamola-Aina/AnchorOS/commit/81dea0ac4c916c68768fd603db8a9a8da97ad46c))
* **security:** harden auth, secrets, CSP, HSTS, and data exposure ([50d3451](https://github.com/Adedamola-Aina/AnchorOS/commit/50d345169d930850a9290fbc3efee0158c6b1807))
* **security:** harden rate limits and immutable audit trail ([8e95d8f](https://github.com/Adedamola-Aina/AnchorOS/commit/8e95d8f158b51be3bb39bc6487100f02bdd482f4))
* **security:** remediate advisories and trusted iframe sources ([eae3144](https://github.com/Adedamola-Aina/AnchorOS/commit/eae31445b2d4011ee3d524a9244017245e9e478c))
* **settings:** remove ts-nocheck, verify external connection prop ([be7f4ae](https://github.com/Adedamola-Aina/AnchorOS/commit/be7f4ae7dfa05788ee7a0120672f37fc12353926))

## [1.9.0-rc.4](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.17...v1.9.0-rc.4) (2026-03-06)


### Features

* **finance:** add filter persistence, csv export, and web vitals monitoring ([da46283](https://github.com/Adedamola-Aina/AnchorOS/commit/da46283b68665b9c2c92c93567373d2fe4577fe7))
* **finance:** add offline queue, bill reminders, and transaction insights ([f7106c8](https://github.com/Adedamola-Aina/AnchorOS/commit/f7106c8221005d967f6e1bd924cb17a7ebc9c6a2))
* **notifications:** improve push reminder reliability ([4d20428](https://github.com/Adedamola-Aina/AnchorOS/commit/4d204285f38738dc41f3f0e70281ccd223343a67))


### Bug Fixes

* **auth:** harden mfa recovery and auth/finance guards ([e265916](https://github.com/Adedamola-Aina/AnchorOS/commit/e2659163a97a552f053cd5b19bc1768d8aa0f8f2))
* **build:** remove deprecated onFID, fix useRef initial value ([1c01c7e](https://github.com/Adedamola-Aina/AnchorOS/commit/1c01c7e28de49b4f875ae4240f816857bcb461af))
* **security:** harden rate limits and immutable audit trail ([8e95d8f](https://github.com/Adedamola-Aina/AnchorOS/commit/8e95d8f158b51be3bb39bc6487100f02bdd482f4))
* **security:** remediate advisories and trusted iframe sources ([eae3144](https://github.com/Adedamola-Aina/AnchorOS/commit/eae31445b2d4011ee3d524a9244017245e9e478c))
* **settings:** remove ts-nocheck, verify external connection prop ([be7f4ae](https://github.com/Adedamola-Aina/AnchorOS/commit/be7f4ae7dfa05788ee7a0120672f37fc12353926))

## [1.9.0-rc.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.17...v1.9.0-rc.3) (2026-03-05)


### Features

* **finance:** add filter persistence, csv export, and web vitals monitoring ([da46283](https://github.com/Adedamola-Aina/AnchorOS/commit/da46283b68665b9c2c92c93567373d2fe4577fe7))
* **finance:** add offline queue, bill reminders, and transaction insights ([f7106c8](https://github.com/Adedamola-Aina/AnchorOS/commit/f7106c8221005d967f6e1bd924cb17a7ebc9c6a2))
* **notifications:** improve push reminder reliability ([4d20428](https://github.com/Adedamola-Aina/AnchorOS/commit/4d204285f38738dc41f3f0e70281ccd223343a67))


### Bug Fixes

* **auth:** harden mfa recovery and auth/finance guards ([e265916](https://github.com/Adedamola-Aina/AnchorOS/commit/e2659163a97a552f053cd5b19bc1768d8aa0f8f2))
* **build:** remove deprecated onFID, fix useRef initial value ([1c01c7e](https://github.com/Adedamola-Aina/AnchorOS/commit/1c01c7e28de49b4f875ae4240f816857bcb461af))
* **security:** harden rate limits and immutable audit trail ([8e95d8f](https://github.com/Adedamola-Aina/AnchorOS/commit/8e95d8f158b51be3bb39bc6487100f02bdd482f4))
* **security:** remediate advisories and trusted iframe sources ([eae3144](https://github.com/Adedamola-Aina/AnchorOS/commit/eae31445b2d4011ee3d524a9244017245e9e478c))
* **settings:** remove ts-nocheck, verify external connection prop ([be7f4ae](https://github.com/Adedamola-Aina/AnchorOS/commit/be7f4ae7dfa05788ee7a0120672f37fc12353926))

## [1.9.0-rc.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.17...v1.9.0-rc.2) (2026-03-05)


### Features

* **finance:** add filter persistence, csv export, and web vitals monitoring ([da46283](https://github.com/Adedamola-Aina/AnchorOS/commit/da46283b68665b9c2c92c93567373d2fe4577fe7))
* **finance:** add offline queue, bill reminders, and transaction insights ([f7106c8](https://github.com/Adedamola-Aina/AnchorOS/commit/f7106c8221005d967f6e1bd924cb17a7ebc9c6a2))
* **notifications:** improve push reminder reliability ([4d20428](https://github.com/Adedamola-Aina/AnchorOS/commit/4d204285f38738dc41f3f0e70281ccd223343a67))


### Bug Fixes

* **auth:** harden mfa recovery and auth/finance guards ([e265916](https://github.com/Adedamola-Aina/AnchorOS/commit/e2659163a97a552f053cd5b19bc1768d8aa0f8f2))
* **build:** remove deprecated onFID, fix useRef initial value ([1c01c7e](https://github.com/Adedamola-Aina/AnchorOS/commit/1c01c7e28de49b4f875ae4240f816857bcb461af))
* **security:** harden rate limits and immutable audit trail ([8e95d8f](https://github.com/Adedamola-Aina/AnchorOS/commit/8e95d8f158b51be3bb39bc6487100f02bdd482f4))
* **security:** remediate advisories and trusted iframe sources ([eae3144](https://github.com/Adedamola-Aina/AnchorOS/commit/eae31445b2d4011ee3d524a9244017245e9e478c))
* **settings:** remove ts-nocheck, verify external connection prop ([be7f4ae](https://github.com/Adedamola-Aina/AnchorOS/commit/be7f4ae7dfa05788ee7a0120672f37fc12353926))

## [1.9.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.17...v1.9.0-rc.1) (2026-03-05)


### Features

* **finance:** add filter persistence, csv export, and web vitals monitoring ([da46283](https://github.com/Adedamola-Aina/AnchorOS/commit/da46283b68665b9c2c92c93567373d2fe4577fe7))
* **finance:** add offline queue, bill reminders, and transaction insights ([f7106c8](https://github.com/Adedamola-Aina/AnchorOS/commit/f7106c8221005d967f6e1bd924cb17a7ebc9c6a2))
* **notifications:** improve push reminder reliability ([4d20428](https://github.com/Adedamola-Aina/AnchorOS/commit/4d204285f38738dc41f3f0e70281ccd223343a67))


### Bug Fixes

* **auth:** harden mfa recovery and auth/finance guards ([e265916](https://github.com/Adedamola-Aina/AnchorOS/commit/e2659163a97a552f053cd5b19bc1768d8aa0f8f2))
* **build:** remove deprecated onFID, fix useRef initial value ([1c01c7e](https://github.com/Adedamola-Aina/AnchorOS/commit/1c01c7e28de49b4f875ae4240f816857bcb461af))
* **security:** harden rate limits and immutable audit trail ([8e95d8f](https://github.com/Adedamola-Aina/AnchorOS/commit/8e95d8f158b51be3bb39bc6487100f02bdd482f4))
* **security:** remediate advisories and trusted iframe sources ([eae3144](https://github.com/Adedamola-Aina/AnchorOS/commit/eae31445b2d4011ee3d524a9244017245e9e478c))
* **settings:** remove ts-nocheck, verify external connection prop ([be7f4ae](https://github.com/Adedamola-Aina/AnchorOS/commit/be7f4ae7dfa05788ee7a0120672f37fc12353926))

## [1.9.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.17...v1.9.0-rc.0) (2026-03-05)


### Features

* **finance:** add filter persistence, csv export, and web vitals monitoring ([da46283](https://github.com/Adedamola-Aina/AnchorOS/commit/da46283b68665b9c2c92c93567373d2fe4577fe7))
* **finance:** add offline queue, bill reminders, and transaction insights ([f7106c8](https://github.com/Adedamola-Aina/AnchorOS/commit/f7106c8221005d967f6e1bd924cb17a7ebc9c6a2))
* **notifications:** improve push reminder reliability ([4d20428](https://github.com/Adedamola-Aina/AnchorOS/commit/4d204285f38738dc41f3f0e70281ccd223343a67))


### Bug Fixes

* **auth:** harden mfa recovery and auth/finance guards ([e265916](https://github.com/Adedamola-Aina/AnchorOS/commit/e2659163a97a552f053cd5b19bc1768d8aa0f8f2))
* **build:** remove deprecated onFID, fix useRef initial value ([1c01c7e](https://github.com/Adedamola-Aina/AnchorOS/commit/1c01c7e28de49b4f875ae4240f816857bcb461af))
* **security:** harden rate limits and immutable audit trail ([8e95d8f](https://github.com/Adedamola-Aina/AnchorOS/commit/8e95d8f158b51be3bb39bc6487100f02bdd482f4))
* **security:** remediate advisories and trusted iframe sources ([eae3144](https://github.com/Adedamola-Aina/AnchorOS/commit/eae31445b2d4011ee3d524a9244017245e9e478c))
* **settings:** remove ts-nocheck, verify external connection prop ([be7f4ae](https://github.com/Adedamola-Aina/AnchorOS/commit/be7f4ae7dfa05788ee7a0120672f37fc12353926))

## [1.9.0-dev.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.17...v1.9.0-dev.1) (2026-03-05)


### Features

* **finance:** add filter persistence, csv export, and web vitals monitoring ([da46283](https://github.com/Adedamola-Aina/AnchorOS/commit/da46283b68665b9c2c92c93567373d2fe4577fe7))
* **finance:** add offline queue, bill reminders, and transaction insights ([f7106c8](https://github.com/Adedamola-Aina/AnchorOS/commit/f7106c8221005d967f6e1bd924cb17a7ebc9c6a2))
* **notifications:** improve push reminder reliability ([4d20428](https://github.com/Adedamola-Aina/AnchorOS/commit/4d204285f38738dc41f3f0e70281ccd223343a67))


### Bug Fixes

* **auth:** harden mfa recovery and auth/finance guards ([e265916](https://github.com/Adedamola-Aina/AnchorOS/commit/e2659163a97a552f053cd5b19bc1768d8aa0f8f2))
* **build:** remove deprecated onFID, fix useRef initial value ([1c01c7e](https://github.com/Adedamola-Aina/AnchorOS/commit/1c01c7e28de49b4f875ae4240f816857bcb461af))
* **security:** harden rate limits and immutable audit trail ([8e95d8f](https://github.com/Adedamola-Aina/AnchorOS/commit/8e95d8f158b51be3bb39bc6487100f02bdd482f4))
* **security:** remediate advisories and trusted iframe sources ([eae3144](https://github.com/Adedamola-Aina/AnchorOS/commit/eae31445b2d4011ee3d524a9244017245e9e478c))
* **settings:** remove ts-nocheck, verify external connection prop ([be7f4ae](https://github.com/Adedamola-Aina/AnchorOS/commit/be7f4ae7dfa05788ee7a0120672f37fc12353926))

## [1.9.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.17...v1.9.0-dev.0) (2026-03-05)


### Features

* **finance:** add filter persistence, csv export, and web vitals monitoring ([da46283](https://github.com/Adedamola-Aina/AnchorOS/commit/da46283b68665b9c2c92c93567373d2fe4577fe7))
* **finance:** add offline queue, bill reminders, and transaction insights ([f7106c8](https://github.com/Adedamola-Aina/AnchorOS/commit/f7106c8221005d967f6e1bd924cb17a7ebc9c6a2))
* **notifications:** improve push reminder reliability ([4d20428](https://github.com/Adedamola-Aina/AnchorOS/commit/4d204285f38738dc41f3f0e70281ccd223343a67))


### Bug Fixes

* **auth:** harden mfa recovery and auth/finance guards ([e265916](https://github.com/Adedamola-Aina/AnchorOS/commit/e2659163a97a552f053cd5b19bc1768d8aa0f8f2))
* **security:** harden rate limits and immutable audit trail ([8e95d8f](https://github.com/Adedamola-Aina/AnchorOS/commit/8e95d8f158b51be3bb39bc6487100f02bdd482f4))
* **security:** remediate advisories and trusted iframe sources ([eae3144](https://github.com/Adedamola-Aina/AnchorOS/commit/eae31445b2d4011ee3d524a9244017245e9e478c))
* **settings:** remove ts-nocheck, verify external connection prop ([be7f4ae](https://github.com/Adedamola-Aina/AnchorOS/commit/be7f4ae7dfa05788ee7a0120672f37fc12353926))

## [1.9.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.17...v1.9.0-rc.1) (2026-03-05)


### Features

* **notifications:** improve push reminder reliability ([4d20428](https://github.com/Adedamola-Aina/AnchorOS/commit/4d204285f38738dc41f3f0e70281ccd223343a67))


### Bug Fixes

* **auth:** harden mfa recovery and auth/finance guards ([e265916](https://github.com/Adedamola-Aina/AnchorOS/commit/e2659163a97a552f053cd5b19bc1768d8aa0f8f2))
* **security:** harden rate limits and immutable audit trail ([8e95d8f](https://github.com/Adedamola-Aina/AnchorOS/commit/8e95d8f158b51be3bb39bc6487100f02bdd482f4))
* **security:** remediate advisories and trusted iframe sources ([eae3144](https://github.com/Adedamola-Aina/AnchorOS/commit/eae31445b2d4011ee3d524a9244017245e9e478c))

## [1.9.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.17...v1.9.0-rc.0) (2026-03-05)


### Features

* **notifications:** improve push reminder reliability ([4d20428](https://github.com/Adedamola-Aina/AnchorOS/commit/4d204285f38738dc41f3f0e70281ccd223343a67))


### Bug Fixes

* **auth:** harden mfa recovery and auth/finance guards ([e265916](https://github.com/Adedamola-Aina/AnchorOS/commit/e2659163a97a552f053cd5b19bc1768d8aa0f8f2))
* **security:** harden rate limits and immutable audit trail ([8e95d8f](https://github.com/Adedamola-Aina/AnchorOS/commit/8e95d8f158b51be3bb39bc6487100f02bdd482f4))
* **security:** remediate advisories and trusted iframe sources ([eae3144](https://github.com/Adedamola-Aina/AnchorOS/commit/eae31445b2d4011ee3d524a9244017245e9e478c))

## [1.8.18-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.17...v1.8.18-dev.0) (2026-03-04)

## [1.8.17](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.16...v1.8.17) (2026-03-04)

## [1.8.17-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.16...v1.8.17-rc.0) (2026-03-04)

## [1.8.16](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.15...v1.8.16) (2026-03-04)


### Bug Fixes

* **debug:** add staging browser console capture ([a4fd9b4](https://github.com/Adedamola-Aina/AnchorOS/commit/a4fd9b4b0486d483971c24fa1e1c435e7a0ade85))

## [1.8.16-rc.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.15...v1.8.16-rc.3) (2026-03-03)


### Bug Fixes

* **debug:** add staging browser console capture ([a4fd9b4](https://github.com/Adedamola-Aina/AnchorOS/commit/a4fd9b4b0486d483971c24fa1e1c435e7a0ade85))

## [1.8.16-rc.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.15...v1.8.16-rc.2) (2026-03-03)


### Bug Fixes

* **debug:** add staging browser console capture ([a4fd9b4](https://github.com/Adedamola-Aina/AnchorOS/commit/a4fd9b4b0486d483971c24fa1e1c435e7a0ade85))

## [1.8.16-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.15...v1.8.16-rc.1) (2026-03-03)


### Bug Fixes

* **debug:** add staging browser console capture ([a4fd9b4](https://github.com/Adedamola-Aina/AnchorOS/commit/a4fd9b4b0486d483971c24fa1e1c435e7a0ade85))

## [1.8.16-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.15...v1.8.16-rc.0) (2026-03-03)


### Bug Fixes

* **debug:** add staging browser console capture ([a4fd9b4](https://github.com/Adedamola-Aina/AnchorOS/commit/a4fd9b4b0486d483971c24fa1e1c435e7a0ade85))

## [1.8.16-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.15...v1.8.16-dev.0) (2026-03-03)


### Bug Fixes

* **debug:** add staging browser console capture ([a4fd9b4](https://github.com/Adedamola-Aina/AnchorOS/commit/a4fd9b4b0486d483971c24fa1e1c435e7a0ade85))

## [1.8.16-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.15...v1.8.16-rc.0) (2026-02-28)


### Bug Fixes

* **debug:** add staging browser console capture ([a4fd9b4](https://github.com/Adedamola-Aina/AnchorOS/commit/a4fd9b4b0486d483971c24fa1e1c435e7a0ade85))

## [1.8.15](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.14...v1.8.15) (2026-02-28)


### Bug Fixes

* **security:** remove inline scripts and improve mfa setup errors ([c2f9dc2](https://github.com/Adedamola-Aina/AnchorOS/commit/c2f9dc23bfc7e15f6c1096c1aae46f95bea1548c))

## [1.8.15-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.14...v1.8.15-rc.1) (2026-02-28)


### Bug Fixes

* **security:** remove inline scripts and improve mfa setup errors ([c2f9dc2](https://github.com/Adedamola-Aina/AnchorOS/commit/c2f9dc23bfc7e15f6c1096c1aae46f95bea1548c))

## [1.8.15-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.14...v1.8.15-rc.0) (2026-02-28)


### Bug Fixes

* **security:** remove inline scripts and improve mfa setup errors ([c2f9dc2](https://github.com/Adedamola-Aina/AnchorOS/commit/c2f9dc23bfc7e15f6c1096c1aae46f95bea1548c))

## [1.8.15-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.14...v1.8.15-dev.0) (2026-02-28)


### Bug Fixes

* **security:** remove inline scripts and improve mfa setup errors ([c2f9dc2](https://github.com/Adedamola-Aina/AnchorOS/commit/c2f9dc23bfc7e15f6c1096c1aae46f95bea1548c))

## [1.8.14](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.13...v1.8.14) (2026-02-27)


### Bug Fixes

* **nav:** restore 56px mobile touch target ([e3d1b72](https://github.com/Adedamola-Aina/AnchorOS/commit/e3d1b72860b0f8954e88fc334ebb4f208b6499af))
* **ux:** fix mfa qr fallback and commitments default view ([80e9cd2](https://github.com/Adedamola-Aina/AnchorOS/commit/80e9cd2dfbec4e15f2d58070006b8f1e1a53f718))

## [1.8.14-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.13...v1.8.14-rc.1) (2026-02-27)


### Bug Fixes

* **nav:** restore 56px mobile touch target ([e3d1b72](https://github.com/Adedamola-Aina/AnchorOS/commit/e3d1b72860b0f8954e88fc334ebb4f208b6499af))
* **ux:** fix mfa qr fallback and commitments default view ([80e9cd2](https://github.com/Adedamola-Aina/AnchorOS/commit/80e9cd2dfbec4e15f2d58070006b8f1e1a53f718))

## [1.8.14-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.13...v1.8.14-rc.0) (2026-02-27)


### Bug Fixes

* **nav:** restore 56px mobile touch target ([e3d1b72](https://github.com/Adedamola-Aina/AnchorOS/commit/e3d1b72860b0f8954e88fc334ebb4f208b6499af))
* **ux:** fix mfa qr fallback and commitments default view ([80e9cd2](https://github.com/Adedamola-Aina/AnchorOS/commit/80e9cd2dfbec4e15f2d58070006b8f1e1a53f718))

## [1.8.14-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.13...v1.8.14-dev.0) (2026-02-27)


### Bug Fixes

* **nav:** restore 56px mobile touch target ([e3d1b72](https://github.com/Adedamola-Aina/AnchorOS/commit/e3d1b72860b0f8954e88fc334ebb4f208b6499af))
* **ux:** fix mfa qr fallback and commitments default view ([80e9cd2](https://github.com/Adedamola-Aina/AnchorOS/commit/80e9cd2dfbec4e15f2d58070006b8f1e1a53f718))

## [1.8.14-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.13...v1.8.14-rc.0) (2026-02-25)

## [1.8.14-dev.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.13...v1.8.14-dev.1) (2026-02-25)

## [1.8.14-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.13...v1.8.14-dev.0) (2026-02-25)

## [1.8.13](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.12...v1.8.13) (2026-02-24)

## [1.8.13-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.12...v1.8.13-rc.0) (2026-02-24)

## [1.8.13-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.12...v1.8.13-dev.0) (2026-02-24)

## [1.8.12](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.11...v1.8.12) (2026-02-24)

## [1.8.12-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.11...v1.8.12-rc.0) (2026-02-24)

## [1.8.12-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.11...v1.8.12-dev.0) (2026-02-24)

## [1.8.11](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.10...v1.8.11) (2026-02-24)

## [1.8.11-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.10...v1.8.11-rc.0) (2026-02-24)

## [1.8.11-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.10...v1.8.11-dev.0) (2026-02-24)

## [1.8.10](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.9...v1.8.10) (2026-02-23)

## [1.8.10-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.9...v1.8.10-rc.0) (2026-02-23)

## [1.8.10-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.9...v1.8.10-dev.0) (2026-02-23)

## [1.8.9](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.8...v1.8.9) (2026-02-23)

## [1.8.8](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.7...v1.8.8) (2026-02-23)

## [1.8.8-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.7...v1.8.8-rc.0) (2026-02-23)

## [1.8.8-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.7...v1.8.8-dev.0) (2026-02-23)

## [1.8.7](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.6...v1.8.7) (2026-02-23)

## [1.8.7-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.6...v1.8.7-rc.0) (2026-02-23)

## [1.8.7-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.6...v1.8.7-dev.0) (2026-02-23)

## [1.8.6](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.5...v1.8.6) (2026-02-23)

## [1.8.5](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.4...v1.8.5) (2026-02-23)

## [1.8.4](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.3...v1.8.4) (2026-02-23)

## [1.8.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.2...v1.8.3) (2026-02-23)

## [1.8.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.1...v1.8.2) (2026-02-23)

## [1.8.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.8.0...v1.8.1) (2026-02-23)

## [1.8.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0) (2026-02-23)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ui:** redesign commitments with tiimo-inspired timeline view ([7292fc7](https://github.com/Adedamola-Aina/AnchorOS/commit/7292fc7dda9351c6f8c8ed59e16d054680d37f8a))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** adjust mobile bottom navigation height to match native ios tab bar ([4e32a55](https://github.com/Adedamola-Aina/AnchorOS/commit/4e32a5536854b59d1b7be82498c3f9f21eb44376))
* **ui:** apply native iOS PWA spacing to bottom navigation ([9dca855](https://github.com/Adedamola-Aina/AnchorOS/commit/9dca85554c12a5a380d1c5359f67d26ef33d780c))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** patch flex bounded min-h-0 container overflow on layout shells ([e9df1f9](https://github.com/Adedamola-Aina/AnchorOS/commit/e9df1f9a471455dea5e63f9adce1373acaa34171))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* **ui:** restore flex-1 stretch on app routes to fix broken scrolling ([3d9d9f8](https://github.com/Adedamola-Aina/AnchorOS/commit/3d9d9f8d0f7a1b1e54f69dd01292c1f77d6a954f))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.0) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ui:** redesign commitments with tiimo-inspired timeline view ([7292fc7](https://github.com/Adedamola-Aina/AnchorOS/commit/7292fc7dda9351c6f8c8ed59e16d054680d37f8a))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** adjust mobile bottom navigation height to match native ios tab bar ([4e32a55](https://github.com/Adedamola-Aina/AnchorOS/commit/4e32a5536854b59d1b7be82498c3f9f21eb44376))
* **ui:** apply native iOS PWA spacing to bottom navigation ([9dca855](https://github.com/Adedamola-Aina/AnchorOS/commit/9dca85554c12a5a380d1c5359f67d26ef33d780c))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** patch flex bounded min-h-0 container overflow on layout shells ([e9df1f9](https://github.com/Adedamola-Aina/AnchorOS/commit/e9df1f9a471455dea5e63f9adce1373acaa34171))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* **ui:** restore flex-1 stretch on app routes to fix broken scrolling ([3d9d9f8](https://github.com/Adedamola-Aina/AnchorOS/commit/3d9d9f8d0f7a1b1e54f69dd01292c1f77d6a954f))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-dev.0) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ui:** redesign commitments with tiimo-inspired timeline view ([7292fc7](https://github.com/Adedamola-Aina/AnchorOS/commit/7292fc7dda9351c6f8c8ed59e16d054680d37f8a))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** adjust mobile bottom navigation height to match native ios tab bar ([4e32a55](https://github.com/Adedamola-Aina/AnchorOS/commit/4e32a5536854b59d1b7be82498c3f9f21eb44376))
* **ui:** apply native iOS PWA spacing to bottom navigation ([9dca855](https://github.com/Adedamola-Aina/AnchorOS/commit/9dca85554c12a5a380d1c5359f67d26ef33d780c))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** patch flex bounded min-h-0 container overflow on layout shells ([e9df1f9](https://github.com/Adedamola-Aina/AnchorOS/commit/e9df1f9a471455dea5e63f9adce1373acaa34171))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* **ui:** restore flex-1 stretch on app routes to fix broken scrolling ([3d9d9f8](https://github.com/Adedamola-Aina/AnchorOS/commit/3d9d9f8d0f7a1b1e54f69dd01292c1f77d6a954f))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.1) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ui:** redesign commitments with tiimo-inspired timeline view ([7292fc7](https://github.com/Adedamola-Aina/AnchorOS/commit/7292fc7dda9351c6f8c8ed59e16d054680d37f8a))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** adjust mobile bottom navigation height to match native ios tab bar ([4e32a55](https://github.com/Adedamola-Aina/AnchorOS/commit/4e32a5536854b59d1b7be82498c3f9f21eb44376))
* **ui:** apply native iOS PWA spacing to bottom navigation ([9dca855](https://github.com/Adedamola-Aina/AnchorOS/commit/9dca85554c12a5a380d1c5359f67d26ef33d780c))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** patch flex bounded min-h-0 container overflow on layout shells ([e9df1f9](https://github.com/Adedamola-Aina/AnchorOS/commit/e9df1f9a471455dea5e63f9adce1373acaa34171))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* **ui:** restore flex-1 stretch on app routes to fix broken scrolling ([3d9d9f8](https://github.com/Adedamola-Aina/AnchorOS/commit/3d9d9f8d0f7a1b1e54f69dd01292c1f77d6a954f))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.0) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ui:** redesign commitments with tiimo-inspired timeline view ([7292fc7](https://github.com/Adedamola-Aina/AnchorOS/commit/7292fc7dda9351c6f8c8ed59e16d054680d37f8a))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** adjust mobile bottom navigation height to match native ios tab bar ([4e32a55](https://github.com/Adedamola-Aina/AnchorOS/commit/4e32a5536854b59d1b7be82498c3f9f21eb44376))
* **ui:** apply native iOS PWA spacing to bottom navigation ([9dca855](https://github.com/Adedamola-Aina/AnchorOS/commit/9dca85554c12a5a380d1c5359f67d26ef33d780c))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** patch flex bounded min-h-0 container overflow on layout shells ([e9df1f9](https://github.com/Adedamola-Aina/AnchorOS/commit/e9df1f9a471455dea5e63f9adce1373acaa34171))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* **ui:** restore flex-1 stretch on app routes to fix broken scrolling ([3d9d9f8](https://github.com/Adedamola-Aina/AnchorOS/commit/3d9d9f8d0f7a1b1e54f69dd01292c1f77d6a954f))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-dev.0) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ui:** redesign commitments with tiimo-inspired timeline view ([7292fc7](https://github.com/Adedamola-Aina/AnchorOS/commit/7292fc7dda9351c6f8c8ed59e16d054680d37f8a))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** adjust mobile bottom navigation height to match native ios tab bar ([4e32a55](https://github.com/Adedamola-Aina/AnchorOS/commit/4e32a5536854b59d1b7be82498c3f9f21eb44376))
* **ui:** apply native iOS PWA spacing to bottom navigation ([9dca855](https://github.com/Adedamola-Aina/AnchorOS/commit/9dca85554c12a5a380d1c5359f67d26ef33d780c))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** patch flex bounded min-h-0 container overflow on layout shells ([e9df1f9](https://github.com/Adedamola-Aina/AnchorOS/commit/e9df1f9a471455dea5e63f9adce1373acaa34171))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* **ui:** restore flex-1 stretch on app routes to fix broken scrolling ([3d9d9f8](https://github.com/Adedamola-Aina/AnchorOS/commit/3d9d9f8d0f7a1b1e54f69dd01292c1f77d6a954f))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.3) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ui:** redesign commitments with tiimo-inspired timeline view ([7292fc7](https://github.com/Adedamola-Aina/AnchorOS/commit/7292fc7dda9351c6f8c8ed59e16d054680d37f8a))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** patch flex bounded min-h-0 container overflow on layout shells ([e9df1f9](https://github.com/Adedamola-Aina/AnchorOS/commit/e9df1f9a471455dea5e63f9adce1373acaa34171))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* **ui:** restore flex-1 stretch on app routes to fix broken scrolling ([3d9d9f8](https://github.com/Adedamola-Aina/AnchorOS/commit/3d9d9f8d0f7a1b1e54f69dd01292c1f77d6a954f))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.2) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ui:** redesign commitments with tiimo-inspired timeline view ([7292fc7](https://github.com/Adedamola-Aina/AnchorOS/commit/7292fc7dda9351c6f8c8ed59e16d054680d37f8a))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** patch flex bounded min-h-0 container overflow on layout shells ([e9df1f9](https://github.com/Adedamola-Aina/AnchorOS/commit/e9df1f9a471455dea5e63f9adce1373acaa34171))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* **ui:** restore flex-1 stretch on app routes to fix broken scrolling ([3d9d9f8](https://github.com/Adedamola-Aina/AnchorOS/commit/3d9d9f8d0f7a1b1e54f69dd01292c1f77d6a954f))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.1) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ui:** redesign commitments with tiimo-inspired timeline view ([7292fc7](https://github.com/Adedamola-Aina/AnchorOS/commit/7292fc7dda9351c6f8c8ed59e16d054680d37f8a))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** patch flex bounded min-h-0 container overflow on layout shells ([e9df1f9](https://github.com/Adedamola-Aina/AnchorOS/commit/e9df1f9a471455dea5e63f9adce1373acaa34171))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* **ui:** restore flex-1 stretch on app routes to fix broken scrolling ([3d9d9f8](https://github.com/Adedamola-Aina/AnchorOS/commit/3d9d9f8d0f7a1b1e54f69dd01292c1f77d6a954f))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.0) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ui:** redesign commitments with tiimo-inspired timeline view ([7292fc7](https://github.com/Adedamola-Aina/AnchorOS/commit/7292fc7dda9351c6f8c8ed59e16d054680d37f8a))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** patch flex bounded min-h-0 container overflow on layout shells ([e9df1f9](https://github.com/Adedamola-Aina/AnchorOS/commit/e9df1f9a471455dea5e63f9adce1373acaa34171))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* **ui:** restore flex-1 stretch on app routes to fix broken scrolling ([3d9d9f8](https://github.com/Adedamola-Aina/AnchorOS/commit/3d9d9f8d0f7a1b1e54f69dd01292c1f77d6a954f))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-dev.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-dev.3) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ui:** redesign commitments with tiimo-inspired timeline view ([7292fc7](https://github.com/Adedamola-Aina/AnchorOS/commit/7292fc7dda9351c6f8c8ed59e16d054680d37f8a))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** patch flex bounded min-h-0 container overflow on layout shells ([e9df1f9](https://github.com/Adedamola-Aina/AnchorOS/commit/e9df1f9a471455dea5e63f9adce1373acaa34171))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* **ui:** restore flex-1 stretch on app routes to fix broken scrolling ([3d9d9f8](https://github.com/Adedamola-Aina/AnchorOS/commit/3d9d9f8d0f7a1b1e54f69dd01292c1f77d6a954f))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-dev.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-dev.2) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ui:** redesign commitments with tiimo-inspired timeline view ([7292fc7](https://github.com/Adedamola-Aina/AnchorOS/commit/7292fc7dda9351c6f8c8ed59e16d054680d37f8a))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** patch flex bounded min-h-0 container overflow on layout shells ([e9df1f9](https://github.com/Adedamola-Aina/AnchorOS/commit/e9df1f9a471455dea5e63f9adce1373acaa34171))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* **ui:** restore flex-1 stretch on app routes to fix broken scrolling ([3d9d9f8](https://github.com/Adedamola-Aina/AnchorOS/commit/3d9d9f8d0f7a1b1e54f69dd01292c1f77d6a954f))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-dev.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-dev.1) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ui:** redesign commitments with tiimo-inspired timeline view ([7292fc7](https://github.com/Adedamola-Aina/AnchorOS/commit/7292fc7dda9351c6f8c8ed59e16d054680d37f8a))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** patch flex bounded min-h-0 container overflow on layout shells ([e9df1f9](https://github.com/Adedamola-Aina/AnchorOS/commit/e9df1f9a471455dea5e63f9adce1373acaa34171))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* **ui:** restore flex-1 stretch on app routes to fix broken scrolling ([3d9d9f8](https://github.com/Adedamola-Aina/AnchorOS/commit/3d9d9f8d0f7a1b1e54f69dd01292c1f77d6a954f))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.1) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** patch flex bounded min-h-0 container overflow on layout shells ([e9df1f9](https://github.com/Adedamola-Aina/AnchorOS/commit/e9df1f9a471455dea5e63f9adce1373acaa34171))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* **ui:** restore flex-1 stretch on app routes to fix broken scrolling ([3d9d9f8](https://github.com/Adedamola-Aina/AnchorOS/commit/3d9d9f8d0f7a1b1e54f69dd01292c1f77d6a954f))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.0) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** patch flex bounded min-h-0 container overflow on layout shells ([e9df1f9](https://github.com/Adedamola-Aina/AnchorOS/commit/e9df1f9a471455dea5e63f9adce1373acaa34171))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* **ui:** restore flex-1 stretch on app routes to fix broken scrolling ([3d9d9f8](https://github.com/Adedamola-Aina/AnchorOS/commit/3d9d9f8d0f7a1b1e54f69dd01292c1f77d6a954f))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-dev.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-dev.1) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** patch flex bounded min-h-0 container overflow on layout shells ([e9df1f9](https://github.com/Adedamola-Aina/AnchorOS/commit/e9df1f9a471455dea5e63f9adce1373acaa34171))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* **ui:** restore flex-1 stretch on app routes to fix broken scrolling ([3d9d9f8](https://github.com/Adedamola-Aina/AnchorOS/commit/3d9d9f8d0f7a1b1e54f69dd01292c1f77d6a954f))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.1) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* **ui:** restore flex-1 stretch on app routes to fix broken scrolling ([3d9d9f8](https://github.com/Adedamola-Aina/AnchorOS/commit/3d9d9f8d0f7a1b1e54f69dd01292c1f77d6a954f))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.0) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* **ui:** restore flex-1 stretch on app routes to fix broken scrolling ([3d9d9f8](https://github.com/Adedamola-Aina/AnchorOS/commit/3d9d9f8d0f7a1b1e54f69dd01292c1f77d6a954f))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-dev.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-dev.1) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* **ui:** restore flex-1 stretch on app routes to fix broken scrolling ([3d9d9f8](https://github.com/Adedamola-Aina/AnchorOS/commit/3d9d9f8d0f7a1b1e54f69dd01292c1f77d6a954f))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.1) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.0) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-dev.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-dev.1) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix ios safe-area layout shift bug over app banner ([df906bb](https://github.com/Adedamola-Aina/AnchorOS/commit/df906bb9ed6cd330bd6420f366aec5477fd3b710))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.6](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.6) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.5](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.5) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.4](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.4) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.3) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.2) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* added missing Context Providers to AuthGateParts ([3de36b0](https://github.com/Adedamola-Aina/AnchorOS/commit/3de36b0955e7671b47b920c32eb71174fe33d1f5))
* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.1) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* updated e2e tests with correct input names ([ae41455](https://github.com/Adedamola-Aina/AnchorOS/commit/ae414550fbe986c9edc655f1a0f5b04e9222cfba))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.0) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-dev.0) (2026-02-22)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* safe area gap on auth and standalone pages ([399568d](https://github.com/Adedamola-Aina/AnchorOS/commit/399568dce7dac88631f88fd2dbf84bed0f6a2ab4))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.1) (2026-02-21)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-rc.0) (2026-02-21)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **api:** implement sentry webhook bug creation pipeline ([612fa82](https://github.com/Adedamola-Aina/AnchorOS/commit/612fa82bc29489403ce30c7580361b1c4274bee0))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* **audit:** implement phase 2 and 3 tooling audit recommendations ([8dcc1a6](https://github.com/Adedamola-Aina/AnchorOS/commit/8dcc1a6d59d56f7c8b18f2adde3a54b7b5fc0890))
* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **ecosystem:** strict sentry tags and dangerous env defaults ([02dd1e1](https://github.com/Adedamola-Aina/AnchorOS/commit/02dd1e1d57c7420c5b6aff9217a2004eb36ab5d5))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

## [1.8.0-dev.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.7.1...v1.8.0-dev.2) (2026-02-20)


### Features

* **analytics:** REM-008 analytics contract with validation tests ([818e718](https://github.com/Adedamola-Aina/AnchorOS/commit/818e718947daef25c000ecba677de1438666bb53))
* **dashboard:** add category filters + coverage metrics ([a41c8a8](https://github.com/Adedamola-Aina/AnchorOS/commit/a41c8a89120c648d6e9771f2725d2ed669cf8c8e))
* **deploy:** automated versioning with commit-and-tag-version ([ec80497](https://github.com/Adedamola-Aina/AnchorOS/commit/ec80497e267fd966b941644259a606f16f0a0c7a))
* **errors:** REM-009 add 404/500 route views + AuthenticatedAppShell extraction ([d411c5a](https://github.com/Adedamola-Aina/AnchorOS/commit/d411c5a2d1323fea7ed78b9b89b2ae6680d84ba7))
* **finance:** add recurring badge pill to transaction history ([bca1f67](https://github.com/Adedamola-Aina/AnchorOS/commit/bca1f672ad19ba936b945f03f61270a3b7aa8816))
* **flags:** REM-007 feature flag system with progressive rollout ([ca712cc](https://github.com/Adedamola-Aina/AnchorOS/commit/ca712cc1ef254bf64656e1a9e8ea4b04cc3093b3))
* **mobile:** add Android platform with Capacitor ([8b75c66](https://github.com/Adedamola-Aina/AnchorOS/commit/8b75c66c57caf6e2949de90e1b666c624d72e429))
* **mobile:** add Capacitor for iOS/Android native apps ([8b2f941](https://github.com/Adedamola-Aina/AnchorOS/commit/8b2f9419d4e52c838542fb6eaf3b6ee119c24179))
* **mobile:** add iOS platform with Capacitor ([2d81142](https://github.com/Adedamola-Aina/AnchorOS/commit/2d8114206f06ad028e8a9c69d9d071eb68b190ea))
* **pwa:** REM-004 PNG icons + manifest hardening ([a4a86d5](https://github.com/Adedamola-Aina/AnchorOS/commit/a4a86d51f329188422ddfa6f28cf1b0b98a118b9))
* **ux:** UX-037 add Record button to account header for expense/income entry ([caa8a6b](https://github.com/Adedamola-Aina/AnchorOS/commit/caa8a6b3950b5943ac98116ebbe8c6d1691c7a42))


### Bug Fixes

* **auth:** BUG-103 fix password manager autofill on login and signup forms ([56ba407](https://github.com/Adedamola-Aina/AnchorOS/commit/56ba4072fc81d0b8ba7ba28f2624b98e87616f72))
* **auth:** clear expired login lockout on app startup ([c99f360](https://github.com/Adedamola-Aina/AnchorOS/commit/c99f360a7cbab94f3078cb275011a4c962ba9e17))
* **auth:** handle requires-recent-login error when disabling 2FA ([cb060a5](https://github.com/Adedamola-Aina/AnchorOS/commit/cb060a5e46ca55b56916aea6aeb819fda08cfb8a))
* **auth:** PLT-001 add 5s auth state timeout for Capacitor WebView ([4310b4b](https://github.com/Adedamola-Aina/AnchorOS/commit/4310b4bc1a1b142ad537de599f9d94b3f675ac47))
* **auth:** PLT-001 always use browserLocalPersistence for Firebase Auth ([c221cfc](https://github.com/Adedamola-Aina/AnchorOS/commit/c221cfc28a49e76043fc186e7d3675593136804b))
* **auth:** PLT-001 use localStorage persistence for Capacitor WebView ([c1a5a31](https://github.com/Adedamola-Aina/AnchorOS/commit/c1a5a31c1cb32eed8d25f9a27aa9565bf275f9e3))
* BUG-078 exclude archived accounts from asset distribution chart ([c37c8f1](https://github.com/Adedamola-Aina/AnchorOS/commit/c37c8f1b452173ae1b8aa418cfd48f881b67c088))
* BUG-079 filter archived accounts from transfer/pay bill selectors ([8db314d](https://github.com/Adedamola-Aina/AnchorOS/commit/8db314da45e863da702b77d064055ee5aa4dd340))
* BUG-080 update SW cache v1.7.7, network-first strategy for HTML/JS ([5f29787](https://github.com/Adedamola-Aina/AnchorOS/commit/5f29787678050ac9947f4997f79eff0a39fdc4ba))
* BUG-081 add useUnsavedChanges hook with beforeunload guard and provider ([554c32c](https://github.com/Adedamola-Aina/AnchorOS/commit/554c32c86971c68790d6093d7b059724ff41e517))
* BUG-082 prevent onboarding flash with profileLoaded gate ([c4010fa](https://github.com/Adedamola-Aina/AnchorOS/commit/c4010fa0e56a534ea0f6499acf9bcb2b58b8b464))
* BUG-083 show notifications only for owned accounts, not shared ([7d1f0f9](https://github.com/Adedamola-Aina/AnchorOS/commit/7d1f0f90eb6a0aaf7d3d67bb1ffaa4aca493f1b7))
* BUG-084 make RecentActivity scrollable, 8 items, compact layout ([f80687d](https://github.com/Adedamola-Aina/AnchorOS/commit/f80687d0b976ab095a7a1d2c81404aee24f88ce1))
* BUG-085 show per-week In/Out/Net totals when week filter selected ([ff71c4e](https://github.com/Adedamola-Aina/AnchorOS/commit/ff71c4e00084f9dbf6eee74f00f514e1375f46c9))
* BUG-086 fix reminder field overflow with min-w-0 and overflow-hidden ([d8c86e7](https://github.com/Adedamola-Aina/AnchorOS/commit/d8c86e729a5c45ecd5295b239511460e142e15eb))
* BUG-087 add name-typing confirmation step to account deletion ([5eb8b4d](https://github.com/Adedamola-Aina/AnchorOS/commit/5eb8b4d395037697b8b633df3faff31642fecd72))
* BUG-088 suppress iOS keyboard toolbar with CSS and inputMode ([96c257c](https://github.com/Adedamola-Aina/AnchorOS/commit/96c257c4a53cfd18a2c61bbba0aa33a26a87356d))
* BUG-089 navigation guard on tab switching for unsaved changes ([860b2e9](https://github.com/Adedamola-Aina/AnchorOS/commit/860b2e97acbd46d291d0063954fe2ebd0c91eca1))
* BUG-090 rename Vault Layer to Ironclad in password strength meter ([b123d62](https://github.com/Adedamola-Aina/AnchorOS/commit/b123d6245cf8a7b3cd528021745e0216118f0406))
* BUG-091 add unsaved changes guard to TaskForm and AccountForm ([e805fb2](https://github.com/Adedamola-Aina/AnchorOS/commit/e805fb2f131e74b6abc0700a04207ef80a477efc))
* **build:** resolve TS errors — remove duplicate declarations and unused setPlatform ([fac39f9](https://github.com/Adedamola-Aina/AnchorOS/commit/fac39f9a7ab7a46da0eec86134377d126309fc03))
* **ci:** add deploy marker commits to pipeline Stage 6b ([a3257f0](https://github.com/Adedamola-Aina/AnchorOS/commit/a3257f0bbe41168b817d7fc0d4c61c704a06586b))
* **ci:** correct firebase config and vitest rules paths ([31b9d89](https://github.com/Adedamola-Aina/AnchorOS/commit/31b9d89579da7413482ead6899f37ab9076125e2))
* **ci:** use npm run test:run in deploy pipeline ([9d651dd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d651ddc1897f2a8e0b662e2bd5bdd783accdb3a))
* **css:** resolve Tailwind content paths to absolute — fixes empty CSS builds ([c96aaf3](https://github.com/Adedamola-Aina/AnchorOS/commit/c96aaf353c6617da4ee0b5aa6c5371bae7d82a59))
* **dashboard:** env parity tracks only anchorOS product commits ([f64cdb1](https://github.com/Adedamola-Aina/AnchorOS/commit/f64cdb115f3709cfcc9839cd74531989c94ef222))
* **dashboard:** extract bug IDs from commit body, not just subject line ([810597b](https://github.com/Adedamola-Aina/AnchorOS/commit/810597ba33dd8b742233eb7f41aadf413ec735ec))
* **docs:** add session length limit — 4-5 tasks per conversation max ([c5a3e44](https://github.com/Adedamola-Aina/AnchorOS/commit/c5a3e4464e6c4a96c544f37b38b0c3eafce8dd3d))
* **docs:** close grey areas in workflow — task definition, scope changes, always check duplicates ([66ed527](https://github.com/Adedamola-Aina/AnchorOS/commit/66ed5279d688ac4657d4f0d5f3baeef2fa91b529))
* **infra:** boot-splash failsafe, lazy Sentry init, telemetry + vite config updates ([0d2e6cb](https://github.com/Adedamola-Aina/AnchorOS/commit/0d2e6cbfc5bb3a9c7404561de8591c5efbf629fc))
* **lint:** exclude .stryker-tmp, tools, functions/lib from eslint scope ([98929c3](https://github.com/Adedamola-Aina/AnchorOS/commit/98929c3bf62cbe8a16d265526f05b50d456d1dd5))
* **lint:** remove redundant setPlatform call in useCapacitor useEffect ([11d2f5b](https://github.com/Adedamola-Aina/AnchorOS/commit/11d2f5b1dfb938a2c9752768d4ff8f8c6e0d20f0))
* **security:** BUG-099..101 fix ReDoS vulnerabilities and update fast-xml-parser ([92c2e26](https://github.com/Adedamola-Aina/AnchorOS/commit/92c2e268279c4f4903c097b0a0f1e1eaaf475d05))
* **security:** BUG-102 update ajv to 8.18.0 to fix ReDoS vulnerability with $data option ([a7c83f9](https://github.com/Adedamola-Aina/AnchorOS/commit/a7c83f991d00121b3732e8ad4fc4cda23755c45f))
* **security:** REM-012 harden Checkmarx workflow with preflight gate ([c4cfe80](https://github.com/Adedamola-Aina/AnchorOS/commit/c4cfe804c74236dd15f5248c1340f70221481996))
* **security:** replace polynomial regex in archiveManager.js ([#37](https://github.com/Adedamola-Aina/AnchorOS/issues/37), [#38](https://github.com/Adedamola-Aina/AnchorOS/issues/38)) ([1351742](https://github.com/Adedamola-Aina/AnchorOS/commit/13517421a520207e4b08cf216027a19de9bbd318))
* **security:** resolve all GitHub security alerts ([178112e](https://github.com/Adedamola-Aina/AnchorOS/commit/178112e0dee7d5eacff399a67fdfe329e0ee671f)), closes [#1-29](https://github.com/Adedamola-Aina/AnchorOS/issues/1-29) [#1-3](https://github.com/Adedamola-Aina/AnchorOS/issues/1-3)
* **security:** resolve remaining 12 code scanning alerts ([4f6aeb6](https://github.com/Adedamola-Aina/AnchorOS/commit/4f6aeb6577252b2f09e86de1b5c9cb324d933070)), closes [#33-36](https://github.com/Adedamola-Aina/AnchorOS/issues/33-36) [#32](https://github.com/Adedamola-Aina/AnchorOS/issues/32) [#21](https://github.com/Adedamola-Aina/AnchorOS/issues/21) [#31](https://github.com/Adedamola-Aina/AnchorOS/issues/31) [#30](https://github.com/Adedamola-Aina/AnchorOS/issues/30) [#24-25](https://github.com/Adedamola-Aina/AnchorOS/issues/24-25) [#15-16](https://github.com/Adedamola-Aina/AnchorOS/issues/15-16)
* **tooling:** implement phase 1 audit recommendations ([f08bea5](https://github.com/Adedamola-Aina/AnchorOS/commit/f08bea5a6351e4b43d2f9dcccba2af4437cf64c0))
* **tooling:** implement phase 1 audit recommendations ([801fcd5](https://github.com/Adedamola-Aina/AnchorOS/commit/801fcd56f527703301d618a1b64d515d9d56ce8e))
* **tooling:** implement phase 1 audit recommendations ([2ed31e4](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed31e40efd08e41eb9f0ab8a2d36ed89da4384a))
* **ui:** fix viewport height and bottom nav positioning ([be79854](https://github.com/Adedamola-Aina/AnchorOS/commit/be79854b27f5845b3bed9ff39a95939511985aa9))
* **ui:** misc component fixes and cleanup ([8e20b8b](https://github.com/Adedamola-Aina/AnchorOS/commit/8e20b8b28aa60921a1b72d8a3d4e5f658a998879))
* **ui:** remove white bar below bottom navigation ([4963294](https://github.com/Adedamola-Aina/AnchorOS/commit/49632942156fae9f8b667238734715caf4da100b))
* **ui:** resolve bottom navigation padding on iOS devices ([9b30eaa](https://github.com/Adedamola-Aina/AnchorOS/commit/9b30eaa8b58ffeb6d9f41dd9f050163e33bff062))
* update CSP headers (worker-src blob:, gstatic, firebasestorage.app), bump SW cache to v1.7.3 ([af943a1](https://github.com/Adedamola-Aina/AnchorOS/commit/af943a139c45831ea97060a92bda35395a70e621))
* **ux:** BUG-092..096, UX-038..039 mobile UX polish batch ([fe5f005](https://github.com/Adedamola-Aina/AnchorOS/commit/fe5f0054cce1a0d317de3fd7cb2e9f2b808c5bc9))
* **ux:** BUG-097 environment banner respects iOS safe area inset ([088c65c](https://github.com/Adedamola-Aina/AnchorOS/commit/088c65ca4168045233580091af66954a6f258e10))
* **ux:** BUG-098 match native iOS tab bar height (h-12 = 48px) ([60ba100](https://github.com/Adedamola-Aina/AnchorOS/commit/60ba100939b3390b61a3526467981dbdb1a77bde))
* **ux:** BUG-098 remove extra 14px bottom nav padding ([5479eca](https://github.com/Adedamola-Aina/AnchorOS/commit/5479ecaf9e067bc505a4a4e1e2fcf5bb77a8f3f5))
* **ux:** UX-037 hide duplicate From row in transfer when account context is set ([b9d9515](https://github.com/Adedamola-Aina/AnchorOS/commit/b9d9515ef166dd82eecfac3a0f9a78cc95d0e5c0))

# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.
