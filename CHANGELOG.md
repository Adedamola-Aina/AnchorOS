# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.19.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.18.0...v1.19.0-dev.0) (2026-05-03)


### Features

* **auth,family:** Wave 4 — Onboarding 90→100% (pre-auth invite acceptance) ([fa98f16](https://github.com/Adedamola-Aina/AnchorOS/commit/fa98f162ee45e62ece9e05717936ed615d1a5487))
* **auth:** host privacy policy and terms of service at /privacy and /terms ([1ec43c3](https://github.com/Adedamola-Aina/AnchorOS/commit/1ec43c3d17cbf239c3c40cc827c675ab956f1c22))
* **commitments:** native priority on edit + priority filter chips ([6fe1bbe](https://github.com/Adedamola-Aina/AnchorOS/commit/6fe1bbee190b173f2b6e12a28fe51127d8edd6b7))
* **dashboard,settings:** Wave 1 — Auth/Dashboard at 100% parity ([101397a](https://github.com/Adedamola-Aina/AnchorOS/commit/101397ab6959546134afeda99db0da0df3642bf0))
* **dashboard:** smart multi-platform intelligence — expand scan scope, native domains, kanban stages, env labels ([1b784e0](https://github.com/Adedamola-Aina/AnchorOS/commit/1b784e0f194fc91574e40bfce506693adbf3a166))
* **family,settings,dashboard:** complete requested parity sections ([3b13b37](https://github.com/Adedamola-Aina/AnchorOS/commit/3b13b375a1e9db52c4fef377e2c4a4007e41eb4e))
* **family:** Wave 3 — Family Mode 50→85% parity ([09d9da4](https://github.com/Adedamola-Aina/AnchorOS/commit/09d9da4b8c69d5ba7f4b6f6d4adb196d613b0921))
* **finance:** add salary account type + audit reconciliation ([9ce1084](https://github.com/Adedamola-Aina/AnchorOS/commit/9ce10840ada7691c06eb03ed08ef392063e1bbff)), closes [#6D28D9](https://github.com/Adedamola-Aina/AnchorOS/issues/6D28D9)
* **finance:** native transaction memo + edit-time date picker ([5886d25](https://github.com/Adedamola-Aina/AnchorOS/commit/5886d25e9750c76fb7dbb56a9c3b3931519a0043))
* **ios:** fIN-020 native SecureDb parity with src/utils/secureDb.ts ([bca6cf8](https://github.com/Adedamola-Aina/AnchorOS/commit/bca6cf88e02dca16f734bb2a7dd07a2893665619))
* **ios:** fIN-021 native net-worth parity with src/utils/finance.ts ([b03a93d](https://github.com/Adedamola-Aina/AnchorOS/commit/b03a93dd3426313138e92829d8090de9647c723c))
* **ios:** fIN-022 dashboard parity \u2014 calculators + today's focus + haptic ([46c268f](https://github.com/Adedamola-Aina/AnchorOS/commit/46c268fa8ff3c594b75ab3fded0044da3c653993))
* **ios:** fIN-023 anchor ai phase 4a \u2014 dead-code cleanup + engine parity tests ([4dbe540](https://github.com/Adedamola-Aina/AnchorOS/commit/4dbe540c362a542430c1d49b65863f28da8a3b34))
* **ios:** fIN-024 commitments phase 5 \u2014 streak calculator + ARCH-001 splits ([490ec14](https://github.com/Adedamola-Aina/AnchorOS/commit/490ec14cf7ce83e36b8526291f0392dde1d2b5e9))
* **ios:** fIN-025 fabric phase 4b-1 \u2014 anomaly predictions engine ([e63e0c6](https://github.com/Adedamola-Aina/AnchorOS/commit/e63e0c6911192359e9e545d4feff2c42288a18dd))
* **ios:** fIN-026 fabric phase 4b-2 \u2014 budget & burn-rate signals ([d32a53d](https://github.com/Adedamola-Aina/AnchorOS/commit/d32a53d60b9eff4e89e5748b88999566b9fbda29))
* **ios:** fIN-026 fabric phase 4b-3 — behavior signals (streak risk + surplus + 7d spike) ([813c52a](https://github.com/Adedamola-Aina/AnchorOS/commit/813c52a7f8399601bc7d0a874dcf0d73dcdaa297))
* **ios:** fIN-026 fabric phase 4b-4 — goal signals (on-track / at-risk) ([401fd44](https://github.com/Adedamola-Aina/AnchorOS/commit/401fd445cf092add34bf880e31a84aa8e8162030))
* **ios:** fIN-026 fabric phase 4b-5 — pattern signals + recurring_due ([767fcc7](https://github.com/Adedamola-Aina/AnchorOS/commit/767fcc75244c70e1af70683334f8fab1a94b9024))
* **ios:** fIN-026 fabric phase 4b-6 — predictions UI + tab routing ([eabc313](https://github.com/Adedamola-Aina/AnchorOS/commit/eabc3134df6a625c1dabf13c13e39abe0352d5a1))
* **ios:** fIN-027 fabric phase 4c — weekly report + upcoming card ([82bcb5d](https://github.com/Adedamola-Aina/AnchorOS/commit/82bcb5df7f0ce27271f31ba657aef556133b4041))
* **ios:** fIN-028 fabric phase 4d — proactive questions ([a637c63](https://github.com/Adedamola-Aina/AnchorOS/commit/a637c6310d3e33acdf764bb6f7988f6455703606))
* **ios:** fIN-028 fabric phase 4e — NLP query surface (MVP) ([2ceac20](https://github.com/Adedamola-Aina/AnchorOS/commit/2ceac206502882da1de614eea12f6d241377f565))
* **ios:** fIN-028 fabric phase 4e-2/3/4 — record NLP, extended queries, contextual intent ([aacb598](https://github.com/Adedamola-Aina/AnchorOS/commit/aacb59828d6a9ae63364a9fd71b248a562abd209))
* **ios:** fIN-028 fabric phase 4e-3b — day-of-week + correlation insights ([169aa76](https://github.com/Adedamola-Aina/AnchorOS/commit/169aa767a18eba31bf2f23e6b7676071b471fb0f))
* **ios:** fIN-028 fabric phase 4e-3c — query_family closes NLP parity ([182beeb](https://github.com/Adedamola-Aina/AnchorOS/commit/182beeb758554597a1a979e1d446689088954636))
* **ios:** fIN-028 fabric phase 4f — wire RecurringStore + PatternsStore ([31f24a9](https://github.com/Adedamola-Aina/AnchorOS/commit/31f24a9e1eb4c16ebffeef5f853ee8eb6cc7d313))
* **ios:** fIN-028 parity phase 4aa — finance charts (asset distribution + cash flow) ([6e22a02](https://github.com/Adedamola-Aina/AnchorOS/commit/6e22a0200ebe8a95f99b54119e19b85c4aca3a8e))
* **ios:** fIN-028 parity phase 4ab — subscriptions, insights, activity, AI settings, sessions, dev tools ([2be8544](https://github.com/Adedamola-Aina/AnchorOS/commit/2be8544d7f22665236c0f5b42a15a7695e959bff))
* **ios:** fIN-028 parity phase 4g — microMotion port + NetWorthRise on totals ([246a53c](https://github.com/Adedamola-Aina/AnchorOS/commit/246a53c2da46a541803ad5af3c85fd1126a94b3d))
* **ios:** fIN-028 parity phase 4h — TaskRow completionPop + success haptic ([bb0b372](https://github.com/Adedamola-Aina/AnchorOS/commit/bb0b372afb57210efd09ef64577712fc8ccdae6c))
* **ios:** fIN-028 parity phase 4i — savePulse + success/error haptics on AddTransactionSheet ([2774a5c](https://github.com/Adedamola-Aina/AnchorOS/commit/2774a5c97319bf63a20f6774b2bee2231d94a4d7))
* **ios:** fIN-028 parity phase 4j — wallet card tap-to-expand + finance matrix closures ([cb0f26e](https://github.com/Adedamola-Aina/AnchorOS/commit/cb0f26e96cd401f1683407c5f4987ee2ef83c01b))
* **ios:** fIN-028 parity phase 4k — auth mount, press scale, error slide-in ([c1154f2](https://github.com/Adedamola-Aina/AnchorOS/commit/c1154f2db662f5d8a80ab22941397b378e9a6bf7))
* **ios:** fIN-028 parity phase 4l — fabric+dashboard+settings mount, nav haptic, thinking pulse ([031cb42](https://github.com/Adedamola-Aina/AnchorOS/commit/031cb42d49c3ac326b376e53e7743864c463202e))
* **ios:** fIN-028 parity phase 4m — onboarding, auth polish, AnchorHaptic ([11c98ad](https://github.com/Adedamola-Aina/AnchorOS/commit/11c98ad92a26781d7dcf73415235cf442f8d5234))
* **ios:** fIN-028 parity phase 4n — interaction matrix closures ([8ca7ad1](https://github.com/Adedamola-Aina/AnchorOS/commit/8ca7ad1c80c9f2abca340c57a3048418e3d6c5ba))
* **ios:** fIN-028 parity phase 4p — AnchorCompletionRing ported to native dashboard ([84538a4](https://github.com/Adedamola-Aina/AnchorOS/commit/84538a4458f4fda1bd718770d096b4f2e2a9d389))
* **ios:** fIN-028 parity phase 4q — OverdraftWarningBanner ported + wired into AddTransactionSheet ([bc30032](https://github.com/Adedamola-Aina/AnchorOS/commit/bc3003253dd0304ba8780bb20b56bea328a56c2a))
* **ios:** fIN-028 parity phase 4r — UpcomingBillsCard ported to FinanceView ([07fc4ca](https://github.com/Adedamola-Aina/AnchorOS/commit/07fc4ca1d799a0f52b21ce43628b6bcf3cfbaaa9))
* **ios:** fIN-028 parity phase 4s — FinanceSearchSheet + FinanceSummarySheet ported ([d4a75e4](https://github.com/Adedamola-Aina/AnchorOS/commit/d4a75e461221f5c5b85f34a748af868b04e4fa51))
* **ios:** fIN-028 parity phase 4t — fabric + settings + commitments interaction closures ([4b84c1d](https://github.com/Adedamola-Aina/AnchorOS/commit/4b84c1d9780a31214c67129ef970e614bf5fbe1c))
* **ios:** fIN-028 parity phase 4u — tab re-tap scrolls to top ([e909520](https://github.com/Adedamola-Aina/AnchorOS/commit/e909520925993171a933e4c3ceeffcaeb28ff91d))
* **ios:** fIN-028 parity phase 4v — searchable currency picker + press-scale sweep ([daee923](https://github.com/Adedamola-Aina/AnchorOS/commit/daee9234f11689f5d06abe90ef5f5635ccbf05ef))
* **ios:** fIN-028 parity phase 4w — microinteraction sweep ([7fb11ae](https://github.com/Adedamola-Aina/AnchorOS/commit/7fb11aecde3bc22cc34f538b1695ac6db83085ae))
* **ios:** fIN-028 parity phase 4x — theme picker + dynamic type + reduce-motion link ([c69b19b](https://github.com/Adedamola-Aina/AnchorOS/commit/c69b19badca5bbf21b45036b4f1047456c3e76ea))
* **ios:** fIN-028 parity phase 4y — profile avatar + support + data export ([60b145d](https://github.com/Adedamola-Aina/AnchorOS/commit/60b145d03c61a6d0e0e8ae73c80acca541acecbd))
* **ios:** fIN-028 parity phase 4z — notification preferences sheet ([06def56](https://github.com/Adedamola-Aina/AnchorOS/commit/06def56d86843c17ed974df942166cab64e1668e))
* **mobile:** apply native-feel guards to installed PWA ([2e2db49](https://github.com/Adedamola-Aina/AnchorOS/commit/2e2db49ebe62f590c7a9b3b76b5b159aa4e31901))
* **mobile:** fIN-029 strip web behaviour on native (long-press, drag, pinch, zoom) ([0ee479a](https://github.com/Adedamola-Aina/AnchorOS/commit/0ee479af7bb75ddb53c96aac2e534fa7c1ad7c18))
* **native:** close all 10 parity workstreams (WS-1..WS-10) ([739be4a](https://github.com/Adedamola-Aina/AnchorOS/commit/739be4a7f1c49bafea8e806ba91d5fc02cd1f486))
* **parity:** close remaining native mega-batches ([2d5e23f](https://github.com/Adedamola-Aina/AnchorOS/commit/2d5e23f05b610e73fa94fb679e5254b71d19b1c8))
* **parity:** complete finance, commitments, AI, polish, gestures, and platform sections ([5cf6970](https://github.com/Adedamola-Aina/AnchorOS/commit/5cf6970cbdca69881e6e0529d5ef233973ad6bd3))
* **settings,family:** Wave 2 — Settings 85→95% parity ([ae15e8f](https://github.com/Adedamola-Aina/AnchorOS/commit/ae15e8f9fa9e6d50bc9a5eddaa7beed5cd84cf1b))


### Bug Fixes

* **security:** patch 1 critical + 2 high vulnerabilities (npm audit fix) ([5d4f9ac](https://github.com/Adedamola-Aina/AnchorOS/commit/5d4f9acf8372cae05c6f3f3839db282ae0b128a4))


### Performance

* **finance:** eliminate card-stack rearrangement stutter on commit ([966c19f](https://github.com/Adedamola-Aina/AnchorOS/commit/966c19fe48374a9693c0bfe9d005d9c6e2b9fd3e))
* **finance:** smooth card stack swipe — MotionValue, no setTimeout, fix touch-action ([9da0fde](https://github.com/Adedamola-Aina/AnchorOS/commit/9da0fde6d58afc6014c84bfd9b14dda1e1748d5c))

## [1.19.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.18.0...v1.19.0-rc.0) (2026-05-03)


### Features

* **auth,family:** Wave 4 — Onboarding 90→100% (pre-auth invite acceptance) ([fa98f16](https://github.com/Adedamola-Aina/AnchorOS/commit/fa98f162ee45e62ece9e05717936ed615d1a5487))
* **auth:** host privacy policy and terms of service at /privacy and /terms ([1ec43c3](https://github.com/Adedamola-Aina/AnchorOS/commit/1ec43c3d17cbf239c3c40cc827c675ab956f1c22))
* **commitments:** native priority on edit + priority filter chips ([6fe1bbe](https://github.com/Adedamola-Aina/AnchorOS/commit/6fe1bbee190b173f2b6e12a28fe51127d8edd6b7))
* **dashboard,settings:** Wave 1 — Auth/Dashboard at 100% parity ([101397a](https://github.com/Adedamola-Aina/AnchorOS/commit/101397ab6959546134afeda99db0da0df3642bf0))
* **dashboard:** smart multi-platform intelligence — expand scan scope, native domains, kanban stages, env labels ([1b784e0](https://github.com/Adedamola-Aina/AnchorOS/commit/1b784e0f194fc91574e40bfce506693adbf3a166))
* **family,settings,dashboard:** complete requested parity sections ([3b13b37](https://github.com/Adedamola-Aina/AnchorOS/commit/3b13b375a1e9db52c4fef377e2c4a4007e41eb4e))
* **family:** Wave 3 — Family Mode 50→85% parity ([09d9da4](https://github.com/Adedamola-Aina/AnchorOS/commit/09d9da4b8c69d5ba7f4b6f6d4adb196d613b0921))
* **finance:** add salary account type + audit reconciliation ([9ce1084](https://github.com/Adedamola-Aina/AnchorOS/commit/9ce10840ada7691c06eb03ed08ef392063e1bbff)), closes [#6D28D9](https://github.com/Adedamola-Aina/AnchorOS/issues/6D28D9)
* **finance:** native transaction memo + edit-time date picker ([5886d25](https://github.com/Adedamola-Aina/AnchorOS/commit/5886d25e9750c76fb7dbb56a9c3b3931519a0043))
* **ios:** fIN-020 native SecureDb parity with src/utils/secureDb.ts ([bca6cf8](https://github.com/Adedamola-Aina/AnchorOS/commit/bca6cf88e02dca16f734bb2a7dd07a2893665619))
* **ios:** fIN-021 native net-worth parity with src/utils/finance.ts ([b03a93d](https://github.com/Adedamola-Aina/AnchorOS/commit/b03a93dd3426313138e92829d8090de9647c723c))
* **ios:** fIN-022 dashboard parity \u2014 calculators + today's focus + haptic ([46c268f](https://github.com/Adedamola-Aina/AnchorOS/commit/46c268fa8ff3c594b75ab3fded0044da3c653993))
* **ios:** fIN-023 anchor ai phase 4a \u2014 dead-code cleanup + engine parity tests ([4dbe540](https://github.com/Adedamola-Aina/AnchorOS/commit/4dbe540c362a542430c1d49b65863f28da8a3b34))
* **ios:** fIN-024 commitments phase 5 \u2014 streak calculator + ARCH-001 splits ([490ec14](https://github.com/Adedamola-Aina/AnchorOS/commit/490ec14cf7ce83e36b8526291f0392dde1d2b5e9))
* **ios:** fIN-025 fabric phase 4b-1 \u2014 anomaly predictions engine ([e63e0c6](https://github.com/Adedamola-Aina/AnchorOS/commit/e63e0c6911192359e9e545d4feff2c42288a18dd))
* **ios:** fIN-026 fabric phase 4b-2 \u2014 budget & burn-rate signals ([d32a53d](https://github.com/Adedamola-Aina/AnchorOS/commit/d32a53d60b9eff4e89e5748b88999566b9fbda29))
* **ios:** fIN-026 fabric phase 4b-3 — behavior signals (streak risk + surplus + 7d spike) ([813c52a](https://github.com/Adedamola-Aina/AnchorOS/commit/813c52a7f8399601bc7d0a874dcf0d73dcdaa297))
* **ios:** fIN-026 fabric phase 4b-4 — goal signals (on-track / at-risk) ([401fd44](https://github.com/Adedamola-Aina/AnchorOS/commit/401fd445cf092add34bf880e31a84aa8e8162030))
* **ios:** fIN-026 fabric phase 4b-5 — pattern signals + recurring_due ([767fcc7](https://github.com/Adedamola-Aina/AnchorOS/commit/767fcc75244c70e1af70683334f8fab1a94b9024))
* **ios:** fIN-026 fabric phase 4b-6 — predictions UI + tab routing ([eabc313](https://github.com/Adedamola-Aina/AnchorOS/commit/eabc3134df6a625c1dabf13c13e39abe0352d5a1))
* **ios:** fIN-027 fabric phase 4c — weekly report + upcoming card ([82bcb5d](https://github.com/Adedamola-Aina/AnchorOS/commit/82bcb5df7f0ce27271f31ba657aef556133b4041))
* **ios:** fIN-028 fabric phase 4d — proactive questions ([a637c63](https://github.com/Adedamola-Aina/AnchorOS/commit/a637c6310d3e33acdf764bb6f7988f6455703606))
* **ios:** fIN-028 fabric phase 4e — NLP query surface (MVP) ([2ceac20](https://github.com/Adedamola-Aina/AnchorOS/commit/2ceac206502882da1de614eea12f6d241377f565))
* **ios:** fIN-028 fabric phase 4e-2/3/4 — record NLP, extended queries, contextual intent ([aacb598](https://github.com/Adedamola-Aina/AnchorOS/commit/aacb59828d6a9ae63364a9fd71b248a562abd209))
* **ios:** fIN-028 fabric phase 4e-3b — day-of-week + correlation insights ([169aa76](https://github.com/Adedamola-Aina/AnchorOS/commit/169aa767a18eba31bf2f23e6b7676071b471fb0f))
* **ios:** fIN-028 fabric phase 4e-3c — query_family closes NLP parity ([182beeb](https://github.com/Adedamola-Aina/AnchorOS/commit/182beeb758554597a1a979e1d446689088954636))
* **ios:** fIN-028 fabric phase 4f — wire RecurringStore + PatternsStore ([31f24a9](https://github.com/Adedamola-Aina/AnchorOS/commit/31f24a9e1eb4c16ebffeef5f853ee8eb6cc7d313))
* **ios:** fIN-028 parity phase 4aa — finance charts (asset distribution + cash flow) ([6e22a02](https://github.com/Adedamola-Aina/AnchorOS/commit/6e22a0200ebe8a95f99b54119e19b85c4aca3a8e))
* **ios:** fIN-028 parity phase 4ab — subscriptions, insights, activity, AI settings, sessions, dev tools ([2be8544](https://github.com/Adedamola-Aina/AnchorOS/commit/2be8544d7f22665236c0f5b42a15a7695e959bff))
* **ios:** fIN-028 parity phase 4g — microMotion port + NetWorthRise on totals ([246a53c](https://github.com/Adedamola-Aina/AnchorOS/commit/246a53c2da46a541803ad5af3c85fd1126a94b3d))
* **ios:** fIN-028 parity phase 4h — TaskRow completionPop + success haptic ([bb0b372](https://github.com/Adedamola-Aina/AnchorOS/commit/bb0b372afb57210efd09ef64577712fc8ccdae6c))
* **ios:** fIN-028 parity phase 4i — savePulse + success/error haptics on AddTransactionSheet ([2774a5c](https://github.com/Adedamola-Aina/AnchorOS/commit/2774a5c97319bf63a20f6774b2bee2231d94a4d7))
* **ios:** fIN-028 parity phase 4j — wallet card tap-to-expand + finance matrix closures ([cb0f26e](https://github.com/Adedamola-Aina/AnchorOS/commit/cb0f26e96cd401f1683407c5f4987ee2ef83c01b))
* **ios:** fIN-028 parity phase 4k — auth mount, press scale, error slide-in ([c1154f2](https://github.com/Adedamola-Aina/AnchorOS/commit/c1154f2db662f5d8a80ab22941397b378e9a6bf7))
* **ios:** fIN-028 parity phase 4l — fabric+dashboard+settings mount, nav haptic, thinking pulse ([031cb42](https://github.com/Adedamola-Aina/AnchorOS/commit/031cb42d49c3ac326b376e53e7743864c463202e))
* **ios:** fIN-028 parity phase 4m — onboarding, auth polish, AnchorHaptic ([11c98ad](https://github.com/Adedamola-Aina/AnchorOS/commit/11c98ad92a26781d7dcf73415235cf442f8d5234))
* **ios:** fIN-028 parity phase 4n — interaction matrix closures ([8ca7ad1](https://github.com/Adedamola-Aina/AnchorOS/commit/8ca7ad1c80c9f2abca340c57a3048418e3d6c5ba))
* **ios:** fIN-028 parity phase 4p — AnchorCompletionRing ported to native dashboard ([84538a4](https://github.com/Adedamola-Aina/AnchorOS/commit/84538a4458f4fda1bd718770d096b4f2e2a9d389))
* **ios:** fIN-028 parity phase 4q — OverdraftWarningBanner ported + wired into AddTransactionSheet ([bc30032](https://github.com/Adedamola-Aina/AnchorOS/commit/bc3003253dd0304ba8780bb20b56bea328a56c2a))
* **ios:** fIN-028 parity phase 4r — UpcomingBillsCard ported to FinanceView ([07fc4ca](https://github.com/Adedamola-Aina/AnchorOS/commit/07fc4ca1d799a0f52b21ce43628b6bcf3cfbaaa9))
* **ios:** fIN-028 parity phase 4s — FinanceSearchSheet + FinanceSummarySheet ported ([d4a75e4](https://github.com/Adedamola-Aina/AnchorOS/commit/d4a75e461221f5c5b85f34a748af868b04e4fa51))
* **ios:** fIN-028 parity phase 4t — fabric + settings + commitments interaction closures ([4b84c1d](https://github.com/Adedamola-Aina/AnchorOS/commit/4b84c1d9780a31214c67129ef970e614bf5fbe1c))
* **ios:** fIN-028 parity phase 4u — tab re-tap scrolls to top ([e909520](https://github.com/Adedamola-Aina/AnchorOS/commit/e909520925993171a933e4c3ceeffcaeb28ff91d))
* **ios:** fIN-028 parity phase 4v — searchable currency picker + press-scale sweep ([daee923](https://github.com/Adedamola-Aina/AnchorOS/commit/daee9234f11689f5d06abe90ef5f5635ccbf05ef))
* **ios:** fIN-028 parity phase 4w — microinteraction sweep ([7fb11ae](https://github.com/Adedamola-Aina/AnchorOS/commit/7fb11aecde3bc22cc34f538b1695ac6db83085ae))
* **ios:** fIN-028 parity phase 4x — theme picker + dynamic type + reduce-motion link ([c69b19b](https://github.com/Adedamola-Aina/AnchorOS/commit/c69b19badca5bbf21b45036b4f1047456c3e76ea))
* **ios:** fIN-028 parity phase 4y — profile avatar + support + data export ([60b145d](https://github.com/Adedamola-Aina/AnchorOS/commit/60b145d03c61a6d0e0e8ae73c80acca541acecbd))
* **ios:** fIN-028 parity phase 4z — notification preferences sheet ([06def56](https://github.com/Adedamola-Aina/AnchorOS/commit/06def56d86843c17ed974df942166cab64e1668e))
* **mobile:** apply native-feel guards to installed PWA ([2e2db49](https://github.com/Adedamola-Aina/AnchorOS/commit/2e2db49ebe62f590c7a9b3b76b5b159aa4e31901))
* **mobile:** fIN-029 strip web behaviour on native (long-press, drag, pinch, zoom) ([0ee479a](https://github.com/Adedamola-Aina/AnchorOS/commit/0ee479af7bb75ddb53c96aac2e534fa7c1ad7c18))
* **native:** close all 10 parity workstreams (WS-1..WS-10) ([739be4a](https://github.com/Adedamola-Aina/AnchorOS/commit/739be4a7f1c49bafea8e806ba91d5fc02cd1f486))
* **parity:** close remaining native mega-batches ([2d5e23f](https://github.com/Adedamola-Aina/AnchorOS/commit/2d5e23f05b610e73fa94fb679e5254b71d19b1c8))
* **parity:** complete finance, commitments, AI, polish, gestures, and platform sections ([5cf6970](https://github.com/Adedamola-Aina/AnchorOS/commit/5cf6970cbdca69881e6e0529d5ef233973ad6bd3))
* **settings,family:** Wave 2 — Settings 85→95% parity ([ae15e8f](https://github.com/Adedamola-Aina/AnchorOS/commit/ae15e8f9fa9e6d50bc9a5eddaa7beed5cd84cf1b))


### Bug Fixes

* **security:** patch 1 critical + 2 high vulnerabilities (npm audit fix) ([5d4f9ac](https://github.com/Adedamola-Aina/AnchorOS/commit/5d4f9acf8372cae05c6f3f3839db282ae0b128a4))


### Performance

* **finance:** smooth card stack swipe — MotionValue, no setTimeout, fix touch-action ([9da0fde](https://github.com/Adedamola-Aina/AnchorOS/commit/9da0fde6d58afc6014c84bfd9b14dda1e1748d5c))

## [1.19.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.18.0...v1.19.0-dev.0) (2026-05-03)


### Features

* **auth,family:** Wave 4 — Onboarding 90→100% (pre-auth invite acceptance) ([fa98f16](https://github.com/Adedamola-Aina/AnchorOS/commit/fa98f162ee45e62ece9e05717936ed615d1a5487))
* **auth:** host privacy policy and terms of service at /privacy and /terms ([1ec43c3](https://github.com/Adedamola-Aina/AnchorOS/commit/1ec43c3d17cbf239c3c40cc827c675ab956f1c22))
* **commitments:** native priority on edit + priority filter chips ([6fe1bbe](https://github.com/Adedamola-Aina/AnchorOS/commit/6fe1bbee190b173f2b6e12a28fe51127d8edd6b7))
* **dashboard,settings:** Wave 1 — Auth/Dashboard at 100% parity ([101397a](https://github.com/Adedamola-Aina/AnchorOS/commit/101397ab6959546134afeda99db0da0df3642bf0))
* **dashboard:** smart multi-platform intelligence — expand scan scope, native domains, kanban stages, env labels ([1b784e0](https://github.com/Adedamola-Aina/AnchorOS/commit/1b784e0f194fc91574e40bfce506693adbf3a166))
* **family,settings,dashboard:** complete requested parity sections ([3b13b37](https://github.com/Adedamola-Aina/AnchorOS/commit/3b13b375a1e9db52c4fef377e2c4a4007e41eb4e))
* **family:** Wave 3 — Family Mode 50→85% parity ([09d9da4](https://github.com/Adedamola-Aina/AnchorOS/commit/09d9da4b8c69d5ba7f4b6f6d4adb196d613b0921))
* **finance:** add salary account type + audit reconciliation ([9ce1084](https://github.com/Adedamola-Aina/AnchorOS/commit/9ce10840ada7691c06eb03ed08ef392063e1bbff)), closes [#6D28D9](https://github.com/Adedamola-Aina/AnchorOS/issues/6D28D9)
* **finance:** native transaction memo + edit-time date picker ([5886d25](https://github.com/Adedamola-Aina/AnchorOS/commit/5886d25e9750c76fb7dbb56a9c3b3931519a0043))
* **ios:** fIN-020 native SecureDb parity with src/utils/secureDb.ts ([bca6cf8](https://github.com/Adedamola-Aina/AnchorOS/commit/bca6cf88e02dca16f734bb2a7dd07a2893665619))
* **ios:** fIN-021 native net-worth parity with src/utils/finance.ts ([b03a93d](https://github.com/Adedamola-Aina/AnchorOS/commit/b03a93dd3426313138e92829d8090de9647c723c))
* **ios:** fIN-022 dashboard parity \u2014 calculators + today's focus + haptic ([46c268f](https://github.com/Adedamola-Aina/AnchorOS/commit/46c268fa8ff3c594b75ab3fded0044da3c653993))
* **ios:** fIN-023 anchor ai phase 4a \u2014 dead-code cleanup + engine parity tests ([4dbe540](https://github.com/Adedamola-Aina/AnchorOS/commit/4dbe540c362a542430c1d49b65863f28da8a3b34))
* **ios:** fIN-024 commitments phase 5 \u2014 streak calculator + ARCH-001 splits ([490ec14](https://github.com/Adedamola-Aina/AnchorOS/commit/490ec14cf7ce83e36b8526291f0392dde1d2b5e9))
* **ios:** fIN-025 fabric phase 4b-1 \u2014 anomaly predictions engine ([e63e0c6](https://github.com/Adedamola-Aina/AnchorOS/commit/e63e0c6911192359e9e545d4feff2c42288a18dd))
* **ios:** fIN-026 fabric phase 4b-2 \u2014 budget & burn-rate signals ([d32a53d](https://github.com/Adedamola-Aina/AnchorOS/commit/d32a53d60b9eff4e89e5748b88999566b9fbda29))
* **ios:** fIN-026 fabric phase 4b-3 — behavior signals (streak risk + surplus + 7d spike) ([813c52a](https://github.com/Adedamola-Aina/AnchorOS/commit/813c52a7f8399601bc7d0a874dcf0d73dcdaa297))
* **ios:** fIN-026 fabric phase 4b-4 — goal signals (on-track / at-risk) ([401fd44](https://github.com/Adedamola-Aina/AnchorOS/commit/401fd445cf092add34bf880e31a84aa8e8162030))
* **ios:** fIN-026 fabric phase 4b-5 — pattern signals + recurring_due ([767fcc7](https://github.com/Adedamola-Aina/AnchorOS/commit/767fcc75244c70e1af70683334f8fab1a94b9024))
* **ios:** fIN-026 fabric phase 4b-6 — predictions UI + tab routing ([eabc313](https://github.com/Adedamola-Aina/AnchorOS/commit/eabc3134df6a625c1dabf13c13e39abe0352d5a1))
* **ios:** fIN-027 fabric phase 4c — weekly report + upcoming card ([82bcb5d](https://github.com/Adedamola-Aina/AnchorOS/commit/82bcb5df7f0ce27271f31ba657aef556133b4041))
* **ios:** fIN-028 fabric phase 4d — proactive questions ([a637c63](https://github.com/Adedamola-Aina/AnchorOS/commit/a637c6310d3e33acdf764bb6f7988f6455703606))
* **ios:** fIN-028 fabric phase 4e — NLP query surface (MVP) ([2ceac20](https://github.com/Adedamola-Aina/AnchorOS/commit/2ceac206502882da1de614eea12f6d241377f565))
* **ios:** fIN-028 fabric phase 4e-2/3/4 — record NLP, extended queries, contextual intent ([aacb598](https://github.com/Adedamola-Aina/AnchorOS/commit/aacb59828d6a9ae63364a9fd71b248a562abd209))
* **ios:** fIN-028 fabric phase 4e-3b — day-of-week + correlation insights ([169aa76](https://github.com/Adedamola-Aina/AnchorOS/commit/169aa767a18eba31bf2f23e6b7676071b471fb0f))
* **ios:** fIN-028 fabric phase 4e-3c — query_family closes NLP parity ([182beeb](https://github.com/Adedamola-Aina/AnchorOS/commit/182beeb758554597a1a979e1d446689088954636))
* **ios:** fIN-028 fabric phase 4f — wire RecurringStore + PatternsStore ([31f24a9](https://github.com/Adedamola-Aina/AnchorOS/commit/31f24a9e1eb4c16ebffeef5f853ee8eb6cc7d313))
* **ios:** fIN-028 parity phase 4aa — finance charts (asset distribution + cash flow) ([6e22a02](https://github.com/Adedamola-Aina/AnchorOS/commit/6e22a0200ebe8a95f99b54119e19b85c4aca3a8e))
* **ios:** fIN-028 parity phase 4ab — subscriptions, insights, activity, AI settings, sessions, dev tools ([2be8544](https://github.com/Adedamola-Aina/AnchorOS/commit/2be8544d7f22665236c0f5b42a15a7695e959bff))
* **ios:** fIN-028 parity phase 4g — microMotion port + NetWorthRise on totals ([246a53c](https://github.com/Adedamola-Aina/AnchorOS/commit/246a53c2da46a541803ad5af3c85fd1126a94b3d))
* **ios:** fIN-028 parity phase 4h — TaskRow completionPop + success haptic ([bb0b372](https://github.com/Adedamola-Aina/AnchorOS/commit/bb0b372afb57210efd09ef64577712fc8ccdae6c))
* **ios:** fIN-028 parity phase 4i — savePulse + success/error haptics on AddTransactionSheet ([2774a5c](https://github.com/Adedamola-Aina/AnchorOS/commit/2774a5c97319bf63a20f6774b2bee2231d94a4d7))
* **ios:** fIN-028 parity phase 4j — wallet card tap-to-expand + finance matrix closures ([cb0f26e](https://github.com/Adedamola-Aina/AnchorOS/commit/cb0f26e96cd401f1683407c5f4987ee2ef83c01b))
* **ios:** fIN-028 parity phase 4k — auth mount, press scale, error slide-in ([c1154f2](https://github.com/Adedamola-Aina/AnchorOS/commit/c1154f2db662f5d8a80ab22941397b378e9a6bf7))
* **ios:** fIN-028 parity phase 4l — fabric+dashboard+settings mount, nav haptic, thinking pulse ([031cb42](https://github.com/Adedamola-Aina/AnchorOS/commit/031cb42d49c3ac326b376e53e7743864c463202e))
* **ios:** fIN-028 parity phase 4m — onboarding, auth polish, AnchorHaptic ([11c98ad](https://github.com/Adedamola-Aina/AnchorOS/commit/11c98ad92a26781d7dcf73415235cf442f8d5234))
* **ios:** fIN-028 parity phase 4n — interaction matrix closures ([8ca7ad1](https://github.com/Adedamola-Aina/AnchorOS/commit/8ca7ad1c80c9f2abca340c57a3048418e3d6c5ba))
* **ios:** fIN-028 parity phase 4p — AnchorCompletionRing ported to native dashboard ([84538a4](https://github.com/Adedamola-Aina/AnchorOS/commit/84538a4458f4fda1bd718770d096b4f2e2a9d389))
* **ios:** fIN-028 parity phase 4q — OverdraftWarningBanner ported + wired into AddTransactionSheet ([bc30032](https://github.com/Adedamola-Aina/AnchorOS/commit/bc3003253dd0304ba8780bb20b56bea328a56c2a))
* **ios:** fIN-028 parity phase 4r — UpcomingBillsCard ported to FinanceView ([07fc4ca](https://github.com/Adedamola-Aina/AnchorOS/commit/07fc4ca1d799a0f52b21ce43628b6bcf3cfbaaa9))
* **ios:** fIN-028 parity phase 4s — FinanceSearchSheet + FinanceSummarySheet ported ([d4a75e4](https://github.com/Adedamola-Aina/AnchorOS/commit/d4a75e461221f5c5b85f34a748af868b04e4fa51))
* **ios:** fIN-028 parity phase 4t — fabric + settings + commitments interaction closures ([4b84c1d](https://github.com/Adedamola-Aina/AnchorOS/commit/4b84c1d9780a31214c67129ef970e614bf5fbe1c))
* **ios:** fIN-028 parity phase 4u — tab re-tap scrolls to top ([e909520](https://github.com/Adedamola-Aina/AnchorOS/commit/e909520925993171a933e4c3ceeffcaeb28ff91d))
* **ios:** fIN-028 parity phase 4v — searchable currency picker + press-scale sweep ([daee923](https://github.com/Adedamola-Aina/AnchorOS/commit/daee9234f11689f5d06abe90ef5f5635ccbf05ef))
* **ios:** fIN-028 parity phase 4w — microinteraction sweep ([7fb11ae](https://github.com/Adedamola-Aina/AnchorOS/commit/7fb11aecde3bc22cc34f538b1695ac6db83085ae))
* **ios:** fIN-028 parity phase 4x — theme picker + dynamic type + reduce-motion link ([c69b19b](https://github.com/Adedamola-Aina/AnchorOS/commit/c69b19badca5bbf21b45036b4f1047456c3e76ea))
* **ios:** fIN-028 parity phase 4y — profile avatar + support + data export ([60b145d](https://github.com/Adedamola-Aina/AnchorOS/commit/60b145d03c61a6d0e0e8ae73c80acca541acecbd))
* **ios:** fIN-028 parity phase 4z — notification preferences sheet ([06def56](https://github.com/Adedamola-Aina/AnchorOS/commit/06def56d86843c17ed974df942166cab64e1668e))
* **mobile:** apply native-feel guards to installed PWA ([2e2db49](https://github.com/Adedamola-Aina/AnchorOS/commit/2e2db49ebe62f590c7a9b3b76b5b159aa4e31901))
* **mobile:** fIN-029 strip web behaviour on native (long-press, drag, pinch, zoom) ([0ee479a](https://github.com/Adedamola-Aina/AnchorOS/commit/0ee479af7bb75ddb53c96aac2e534fa7c1ad7c18))
* **native:** close all 10 parity workstreams (WS-1..WS-10) ([739be4a](https://github.com/Adedamola-Aina/AnchorOS/commit/739be4a7f1c49bafea8e806ba91d5fc02cd1f486))
* **parity:** close remaining native mega-batches ([2d5e23f](https://github.com/Adedamola-Aina/AnchorOS/commit/2d5e23f05b610e73fa94fb679e5254b71d19b1c8))
* **parity:** complete finance, commitments, AI, polish, gestures, and platform sections ([5cf6970](https://github.com/Adedamola-Aina/AnchorOS/commit/5cf6970cbdca69881e6e0529d5ef233973ad6bd3))
* **settings,family:** Wave 2 — Settings 85→95% parity ([ae15e8f](https://github.com/Adedamola-Aina/AnchorOS/commit/ae15e8f9fa9e6d50bc9a5eddaa7beed5cd84cf1b))


### Bug Fixes

* **security:** patch 1 critical + 2 high vulnerabilities (npm audit fix) ([5d4f9ac](https://github.com/Adedamola-Aina/AnchorOS/commit/5d4f9acf8372cae05c6f3f3839db282ae0b128a4))


### Performance

* **finance:** smooth card stack swipe — MotionValue, no setTimeout, fix touch-action ([9da0fde](https://github.com/Adedamola-Aina/AnchorOS/commit/9da0fde6d58afc6014c84bfd9b14dda1e1748d5c))

## [1.19.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.18.0...v1.19.0-rc.0) (2026-05-03)


### Features

* **auth,family:** Wave 4 — Onboarding 90→100% (pre-auth invite acceptance) ([fa98f16](https://github.com/Adedamola-Aina/AnchorOS/commit/fa98f162ee45e62ece9e05717936ed615d1a5487))
* **auth:** host privacy policy and terms of service at /privacy and /terms ([1ec43c3](https://github.com/Adedamola-Aina/AnchorOS/commit/1ec43c3d17cbf239c3c40cc827c675ab956f1c22))
* **commitments:** native priority on edit + priority filter chips ([6fe1bbe](https://github.com/Adedamola-Aina/AnchorOS/commit/6fe1bbee190b173f2b6e12a28fe51127d8edd6b7))
* **dashboard,settings:** Wave 1 — Auth/Dashboard at 100% parity ([101397a](https://github.com/Adedamola-Aina/AnchorOS/commit/101397ab6959546134afeda99db0da0df3642bf0))
* **dashboard:** smart multi-platform intelligence — expand scan scope, native domains, kanban stages, env labels ([1b784e0](https://github.com/Adedamola-Aina/AnchorOS/commit/1b784e0f194fc91574e40bfce506693adbf3a166))
* **family,settings,dashboard:** complete requested parity sections ([3b13b37](https://github.com/Adedamola-Aina/AnchorOS/commit/3b13b375a1e9db52c4fef377e2c4a4007e41eb4e))
* **family:** Wave 3 — Family Mode 50→85% parity ([09d9da4](https://github.com/Adedamola-Aina/AnchorOS/commit/09d9da4b8c69d5ba7f4b6f6d4adb196d613b0921))
* **finance:** add salary account type + audit reconciliation ([9ce1084](https://github.com/Adedamola-Aina/AnchorOS/commit/9ce10840ada7691c06eb03ed08ef392063e1bbff)), closes [#6D28D9](https://github.com/Adedamola-Aina/AnchorOS/issues/6D28D9)
* **finance:** native transaction memo + edit-time date picker ([5886d25](https://github.com/Adedamola-Aina/AnchorOS/commit/5886d25e9750c76fb7dbb56a9c3b3931519a0043))
* **ios:** fIN-020 native SecureDb parity with src/utils/secureDb.ts ([bca6cf8](https://github.com/Adedamola-Aina/AnchorOS/commit/bca6cf88e02dca16f734bb2a7dd07a2893665619))
* **ios:** fIN-021 native net-worth parity with src/utils/finance.ts ([b03a93d](https://github.com/Adedamola-Aina/AnchorOS/commit/b03a93dd3426313138e92829d8090de9647c723c))
* **ios:** fIN-022 dashboard parity \u2014 calculators + today's focus + haptic ([46c268f](https://github.com/Adedamola-Aina/AnchorOS/commit/46c268fa8ff3c594b75ab3fded0044da3c653993))
* **ios:** fIN-023 anchor ai phase 4a \u2014 dead-code cleanup + engine parity tests ([4dbe540](https://github.com/Adedamola-Aina/AnchorOS/commit/4dbe540c362a542430c1d49b65863f28da8a3b34))
* **ios:** fIN-024 commitments phase 5 \u2014 streak calculator + ARCH-001 splits ([490ec14](https://github.com/Adedamola-Aina/AnchorOS/commit/490ec14cf7ce83e36b8526291f0392dde1d2b5e9))
* **ios:** fIN-025 fabric phase 4b-1 \u2014 anomaly predictions engine ([e63e0c6](https://github.com/Adedamola-Aina/AnchorOS/commit/e63e0c6911192359e9e545d4feff2c42288a18dd))
* **ios:** fIN-026 fabric phase 4b-2 \u2014 budget & burn-rate signals ([d32a53d](https://github.com/Adedamola-Aina/AnchorOS/commit/d32a53d60b9eff4e89e5748b88999566b9fbda29))
* **ios:** fIN-026 fabric phase 4b-3 — behavior signals (streak risk + surplus + 7d spike) ([813c52a](https://github.com/Adedamola-Aina/AnchorOS/commit/813c52a7f8399601bc7d0a874dcf0d73dcdaa297))
* **ios:** fIN-026 fabric phase 4b-4 — goal signals (on-track / at-risk) ([401fd44](https://github.com/Adedamola-Aina/AnchorOS/commit/401fd445cf092add34bf880e31a84aa8e8162030))
* **ios:** fIN-026 fabric phase 4b-5 — pattern signals + recurring_due ([767fcc7](https://github.com/Adedamola-Aina/AnchorOS/commit/767fcc75244c70e1af70683334f8fab1a94b9024))
* **ios:** fIN-026 fabric phase 4b-6 — predictions UI + tab routing ([eabc313](https://github.com/Adedamola-Aina/AnchorOS/commit/eabc3134df6a625c1dabf13c13e39abe0352d5a1))
* **ios:** fIN-027 fabric phase 4c — weekly report + upcoming card ([82bcb5d](https://github.com/Adedamola-Aina/AnchorOS/commit/82bcb5df7f0ce27271f31ba657aef556133b4041))
* **ios:** fIN-028 fabric phase 4d — proactive questions ([a637c63](https://github.com/Adedamola-Aina/AnchorOS/commit/a637c6310d3e33acdf764bb6f7988f6455703606))
* **ios:** fIN-028 fabric phase 4e — NLP query surface (MVP) ([2ceac20](https://github.com/Adedamola-Aina/AnchorOS/commit/2ceac206502882da1de614eea12f6d241377f565))
* **ios:** fIN-028 fabric phase 4e-2/3/4 — record NLP, extended queries, contextual intent ([aacb598](https://github.com/Adedamola-Aina/AnchorOS/commit/aacb59828d6a9ae63364a9fd71b248a562abd209))
* **ios:** fIN-028 fabric phase 4e-3b — day-of-week + correlation insights ([169aa76](https://github.com/Adedamola-Aina/AnchorOS/commit/169aa767a18eba31bf2f23e6b7676071b471fb0f))
* **ios:** fIN-028 fabric phase 4e-3c — query_family closes NLP parity ([182beeb](https://github.com/Adedamola-Aina/AnchorOS/commit/182beeb758554597a1a979e1d446689088954636))
* **ios:** fIN-028 fabric phase 4f — wire RecurringStore + PatternsStore ([31f24a9](https://github.com/Adedamola-Aina/AnchorOS/commit/31f24a9e1eb4c16ebffeef5f853ee8eb6cc7d313))
* **ios:** fIN-028 parity phase 4aa — finance charts (asset distribution + cash flow) ([6e22a02](https://github.com/Adedamola-Aina/AnchorOS/commit/6e22a0200ebe8a95f99b54119e19b85c4aca3a8e))
* **ios:** fIN-028 parity phase 4ab — subscriptions, insights, activity, AI settings, sessions, dev tools ([2be8544](https://github.com/Adedamola-Aina/AnchorOS/commit/2be8544d7f22665236c0f5b42a15a7695e959bff))
* **ios:** fIN-028 parity phase 4g — microMotion port + NetWorthRise on totals ([246a53c](https://github.com/Adedamola-Aina/AnchorOS/commit/246a53c2da46a541803ad5af3c85fd1126a94b3d))
* **ios:** fIN-028 parity phase 4h — TaskRow completionPop + success haptic ([bb0b372](https://github.com/Adedamola-Aina/AnchorOS/commit/bb0b372afb57210efd09ef64577712fc8ccdae6c))
* **ios:** fIN-028 parity phase 4i — savePulse + success/error haptics on AddTransactionSheet ([2774a5c](https://github.com/Adedamola-Aina/AnchorOS/commit/2774a5c97319bf63a20f6774b2bee2231d94a4d7))
* **ios:** fIN-028 parity phase 4j — wallet card tap-to-expand + finance matrix closures ([cb0f26e](https://github.com/Adedamola-Aina/AnchorOS/commit/cb0f26e96cd401f1683407c5f4987ee2ef83c01b))
* **ios:** fIN-028 parity phase 4k — auth mount, press scale, error slide-in ([c1154f2](https://github.com/Adedamola-Aina/AnchorOS/commit/c1154f2db662f5d8a80ab22941397b378e9a6bf7))
* **ios:** fIN-028 parity phase 4l — fabric+dashboard+settings mount, nav haptic, thinking pulse ([031cb42](https://github.com/Adedamola-Aina/AnchorOS/commit/031cb42d49c3ac326b376e53e7743864c463202e))
* **ios:** fIN-028 parity phase 4m — onboarding, auth polish, AnchorHaptic ([11c98ad](https://github.com/Adedamola-Aina/AnchorOS/commit/11c98ad92a26781d7dcf73415235cf442f8d5234))
* **ios:** fIN-028 parity phase 4n — interaction matrix closures ([8ca7ad1](https://github.com/Adedamola-Aina/AnchorOS/commit/8ca7ad1c80c9f2abca340c57a3048418e3d6c5ba))
* **ios:** fIN-028 parity phase 4p — AnchorCompletionRing ported to native dashboard ([84538a4](https://github.com/Adedamola-Aina/AnchorOS/commit/84538a4458f4fda1bd718770d096b4f2e2a9d389))
* **ios:** fIN-028 parity phase 4q — OverdraftWarningBanner ported + wired into AddTransactionSheet ([bc30032](https://github.com/Adedamola-Aina/AnchorOS/commit/bc3003253dd0304ba8780bb20b56bea328a56c2a))
* **ios:** fIN-028 parity phase 4r — UpcomingBillsCard ported to FinanceView ([07fc4ca](https://github.com/Adedamola-Aina/AnchorOS/commit/07fc4ca1d799a0f52b21ce43628b6bcf3cfbaaa9))
* **ios:** fIN-028 parity phase 4s — FinanceSearchSheet + FinanceSummarySheet ported ([d4a75e4](https://github.com/Adedamola-Aina/AnchorOS/commit/d4a75e461221f5c5b85f34a748af868b04e4fa51))
* **ios:** fIN-028 parity phase 4t — fabric + settings + commitments interaction closures ([4b84c1d](https://github.com/Adedamola-Aina/AnchorOS/commit/4b84c1d9780a31214c67129ef970e614bf5fbe1c))
* **ios:** fIN-028 parity phase 4u — tab re-tap scrolls to top ([e909520](https://github.com/Adedamola-Aina/AnchorOS/commit/e909520925993171a933e4c3ceeffcaeb28ff91d))
* **ios:** fIN-028 parity phase 4v — searchable currency picker + press-scale sweep ([daee923](https://github.com/Adedamola-Aina/AnchorOS/commit/daee9234f11689f5d06abe90ef5f5635ccbf05ef))
* **ios:** fIN-028 parity phase 4w — microinteraction sweep ([7fb11ae](https://github.com/Adedamola-Aina/AnchorOS/commit/7fb11aecde3bc22cc34f538b1695ac6db83085ae))
* **ios:** fIN-028 parity phase 4x — theme picker + dynamic type + reduce-motion link ([c69b19b](https://github.com/Adedamola-Aina/AnchorOS/commit/c69b19badca5bbf21b45036b4f1047456c3e76ea))
* **ios:** fIN-028 parity phase 4y — profile avatar + support + data export ([60b145d](https://github.com/Adedamola-Aina/AnchorOS/commit/60b145d03c61a6d0e0e8ae73c80acca541acecbd))
* **ios:** fIN-028 parity phase 4z — notification preferences sheet ([06def56](https://github.com/Adedamola-Aina/AnchorOS/commit/06def56d86843c17ed974df942166cab64e1668e))
* **mobile:** apply native-feel guards to installed PWA ([2e2db49](https://github.com/Adedamola-Aina/AnchorOS/commit/2e2db49ebe62f590c7a9b3b76b5b159aa4e31901))
* **mobile:** fIN-029 strip web behaviour on native (long-press, drag, pinch, zoom) ([0ee479a](https://github.com/Adedamola-Aina/AnchorOS/commit/0ee479af7bb75ddb53c96aac2e534fa7c1ad7c18))
* **native:** close all 10 parity workstreams (WS-1..WS-10) ([739be4a](https://github.com/Adedamola-Aina/AnchorOS/commit/739be4a7f1c49bafea8e806ba91d5fc02cd1f486))
* **parity:** close remaining native mega-batches ([2d5e23f](https://github.com/Adedamola-Aina/AnchorOS/commit/2d5e23f05b610e73fa94fb679e5254b71d19b1c8))
* **parity:** complete finance, commitments, AI, polish, gestures, and platform sections ([5cf6970](https://github.com/Adedamola-Aina/AnchorOS/commit/5cf6970cbdca69881e6e0529d5ef233973ad6bd3))
* **settings,family:** Wave 2 — Settings 85→95% parity ([ae15e8f](https://github.com/Adedamola-Aina/AnchorOS/commit/ae15e8f9fa9e6d50bc9a5eddaa7beed5cd84cf1b))


### Bug Fixes

* **security:** patch 1 critical + 2 high vulnerabilities (npm audit fix) ([5d4f9ac](https://github.com/Adedamola-Aina/AnchorOS/commit/5d4f9acf8372cae05c6f3f3839db282ae0b128a4))

## [1.19.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.18.0...v1.19.0-dev.0) (2026-05-03)


### Features

* **auth,family:** Wave 4 — Onboarding 90→100% (pre-auth invite acceptance) ([fa98f16](https://github.com/Adedamola-Aina/AnchorOS/commit/fa98f162ee45e62ece9e05717936ed615d1a5487))
* **auth:** host privacy policy and terms of service at /privacy and /terms ([1ec43c3](https://github.com/Adedamola-Aina/AnchorOS/commit/1ec43c3d17cbf239c3c40cc827c675ab956f1c22))
* **commitments:** native priority on edit + priority filter chips ([6fe1bbe](https://github.com/Adedamola-Aina/AnchorOS/commit/6fe1bbee190b173f2b6e12a28fe51127d8edd6b7))
* **dashboard,settings:** Wave 1 — Auth/Dashboard at 100% parity ([101397a](https://github.com/Adedamola-Aina/AnchorOS/commit/101397ab6959546134afeda99db0da0df3642bf0))
* **dashboard:** smart multi-platform intelligence — expand scan scope, native domains, kanban stages, env labels ([1b784e0](https://github.com/Adedamola-Aina/AnchorOS/commit/1b784e0f194fc91574e40bfce506693adbf3a166))
* **family,settings,dashboard:** complete requested parity sections ([3b13b37](https://github.com/Adedamola-Aina/AnchorOS/commit/3b13b375a1e9db52c4fef377e2c4a4007e41eb4e))
* **family:** Wave 3 — Family Mode 50→85% parity ([09d9da4](https://github.com/Adedamola-Aina/AnchorOS/commit/09d9da4b8c69d5ba7f4b6f6d4adb196d613b0921))
* **finance:** add salary account type + audit reconciliation ([9ce1084](https://github.com/Adedamola-Aina/AnchorOS/commit/9ce10840ada7691c06eb03ed08ef392063e1bbff)), closes [#6D28D9](https://github.com/Adedamola-Aina/AnchorOS/issues/6D28D9)
* **finance:** native transaction memo + edit-time date picker ([5886d25](https://github.com/Adedamola-Aina/AnchorOS/commit/5886d25e9750c76fb7dbb56a9c3b3931519a0043))
* **ios:** fIN-020 native SecureDb parity with src/utils/secureDb.ts ([bca6cf8](https://github.com/Adedamola-Aina/AnchorOS/commit/bca6cf88e02dca16f734bb2a7dd07a2893665619))
* **ios:** fIN-021 native net-worth parity with src/utils/finance.ts ([b03a93d](https://github.com/Adedamola-Aina/AnchorOS/commit/b03a93dd3426313138e92829d8090de9647c723c))
* **ios:** fIN-022 dashboard parity \u2014 calculators + today's focus + haptic ([46c268f](https://github.com/Adedamola-Aina/AnchorOS/commit/46c268fa8ff3c594b75ab3fded0044da3c653993))
* **ios:** fIN-023 anchor ai phase 4a \u2014 dead-code cleanup + engine parity tests ([4dbe540](https://github.com/Adedamola-Aina/AnchorOS/commit/4dbe540c362a542430c1d49b65863f28da8a3b34))
* **ios:** fIN-024 commitments phase 5 \u2014 streak calculator + ARCH-001 splits ([490ec14](https://github.com/Adedamola-Aina/AnchorOS/commit/490ec14cf7ce83e36b8526291f0392dde1d2b5e9))
* **ios:** fIN-025 fabric phase 4b-1 \u2014 anomaly predictions engine ([e63e0c6](https://github.com/Adedamola-Aina/AnchorOS/commit/e63e0c6911192359e9e545d4feff2c42288a18dd))
* **ios:** fIN-026 fabric phase 4b-2 \u2014 budget & burn-rate signals ([d32a53d](https://github.com/Adedamola-Aina/AnchorOS/commit/d32a53d60b9eff4e89e5748b88999566b9fbda29))
* **ios:** fIN-026 fabric phase 4b-3 — behavior signals (streak risk + surplus + 7d spike) ([813c52a](https://github.com/Adedamola-Aina/AnchorOS/commit/813c52a7f8399601bc7d0a874dcf0d73dcdaa297))
* **ios:** fIN-026 fabric phase 4b-4 — goal signals (on-track / at-risk) ([401fd44](https://github.com/Adedamola-Aina/AnchorOS/commit/401fd445cf092add34bf880e31a84aa8e8162030))
* **ios:** fIN-026 fabric phase 4b-5 — pattern signals + recurring_due ([767fcc7](https://github.com/Adedamola-Aina/AnchorOS/commit/767fcc75244c70e1af70683334f8fab1a94b9024))
* **ios:** fIN-026 fabric phase 4b-6 — predictions UI + tab routing ([eabc313](https://github.com/Adedamola-Aina/AnchorOS/commit/eabc3134df6a625c1dabf13c13e39abe0352d5a1))
* **ios:** fIN-027 fabric phase 4c — weekly report + upcoming card ([82bcb5d](https://github.com/Adedamola-Aina/AnchorOS/commit/82bcb5df7f0ce27271f31ba657aef556133b4041))
* **ios:** fIN-028 fabric phase 4d — proactive questions ([a637c63](https://github.com/Adedamola-Aina/AnchorOS/commit/a637c6310d3e33acdf764bb6f7988f6455703606))
* **ios:** fIN-028 fabric phase 4e — NLP query surface (MVP) ([2ceac20](https://github.com/Adedamola-Aina/AnchorOS/commit/2ceac206502882da1de614eea12f6d241377f565))
* **ios:** fIN-028 fabric phase 4e-2/3/4 — record NLP, extended queries, contextual intent ([aacb598](https://github.com/Adedamola-Aina/AnchorOS/commit/aacb59828d6a9ae63364a9fd71b248a562abd209))
* **ios:** fIN-028 fabric phase 4e-3b — day-of-week + correlation insights ([169aa76](https://github.com/Adedamola-Aina/AnchorOS/commit/169aa767a18eba31bf2f23e6b7676071b471fb0f))
* **ios:** fIN-028 fabric phase 4e-3c — query_family closes NLP parity ([182beeb](https://github.com/Adedamola-Aina/AnchorOS/commit/182beeb758554597a1a979e1d446689088954636))
* **ios:** fIN-028 fabric phase 4f — wire RecurringStore + PatternsStore ([31f24a9](https://github.com/Adedamola-Aina/AnchorOS/commit/31f24a9e1eb4c16ebffeef5f853ee8eb6cc7d313))
* **ios:** fIN-028 parity phase 4aa — finance charts (asset distribution + cash flow) ([6e22a02](https://github.com/Adedamola-Aina/AnchorOS/commit/6e22a0200ebe8a95f99b54119e19b85c4aca3a8e))
* **ios:** fIN-028 parity phase 4ab — subscriptions, insights, activity, AI settings, sessions, dev tools ([2be8544](https://github.com/Adedamola-Aina/AnchorOS/commit/2be8544d7f22665236c0f5b42a15a7695e959bff))
* **ios:** fIN-028 parity phase 4g — microMotion port + NetWorthRise on totals ([246a53c](https://github.com/Adedamola-Aina/AnchorOS/commit/246a53c2da46a541803ad5af3c85fd1126a94b3d))
* **ios:** fIN-028 parity phase 4h — TaskRow completionPop + success haptic ([bb0b372](https://github.com/Adedamola-Aina/AnchorOS/commit/bb0b372afb57210efd09ef64577712fc8ccdae6c))
* **ios:** fIN-028 parity phase 4i — savePulse + success/error haptics on AddTransactionSheet ([2774a5c](https://github.com/Adedamola-Aina/AnchorOS/commit/2774a5c97319bf63a20f6774b2bee2231d94a4d7))
* **ios:** fIN-028 parity phase 4j — wallet card tap-to-expand + finance matrix closures ([cb0f26e](https://github.com/Adedamola-Aina/AnchorOS/commit/cb0f26e96cd401f1683407c5f4987ee2ef83c01b))
* **ios:** fIN-028 parity phase 4k — auth mount, press scale, error slide-in ([c1154f2](https://github.com/Adedamola-Aina/AnchorOS/commit/c1154f2db662f5d8a80ab22941397b378e9a6bf7))
* **ios:** fIN-028 parity phase 4l — fabric+dashboard+settings mount, nav haptic, thinking pulse ([031cb42](https://github.com/Adedamola-Aina/AnchorOS/commit/031cb42d49c3ac326b376e53e7743864c463202e))
* **ios:** fIN-028 parity phase 4m — onboarding, auth polish, AnchorHaptic ([11c98ad](https://github.com/Adedamola-Aina/AnchorOS/commit/11c98ad92a26781d7dcf73415235cf442f8d5234))
* **ios:** fIN-028 parity phase 4n — interaction matrix closures ([8ca7ad1](https://github.com/Adedamola-Aina/AnchorOS/commit/8ca7ad1c80c9f2abca340c57a3048418e3d6c5ba))
* **ios:** fIN-028 parity phase 4p — AnchorCompletionRing ported to native dashboard ([84538a4](https://github.com/Adedamola-Aina/AnchorOS/commit/84538a4458f4fda1bd718770d096b4f2e2a9d389))
* **ios:** fIN-028 parity phase 4q — OverdraftWarningBanner ported + wired into AddTransactionSheet ([bc30032](https://github.com/Adedamola-Aina/AnchorOS/commit/bc3003253dd0304ba8780bb20b56bea328a56c2a))
* **ios:** fIN-028 parity phase 4r — UpcomingBillsCard ported to FinanceView ([07fc4ca](https://github.com/Adedamola-Aina/AnchorOS/commit/07fc4ca1d799a0f52b21ce43628b6bcf3cfbaaa9))
* **ios:** fIN-028 parity phase 4s — FinanceSearchSheet + FinanceSummarySheet ported ([d4a75e4](https://github.com/Adedamola-Aina/AnchorOS/commit/d4a75e461221f5c5b85f34a748af868b04e4fa51))
* **ios:** fIN-028 parity phase 4t — fabric + settings + commitments interaction closures ([4b84c1d](https://github.com/Adedamola-Aina/AnchorOS/commit/4b84c1d9780a31214c67129ef970e614bf5fbe1c))
* **ios:** fIN-028 parity phase 4u — tab re-tap scrolls to top ([e909520](https://github.com/Adedamola-Aina/AnchorOS/commit/e909520925993171a933e4c3ceeffcaeb28ff91d))
* **ios:** fIN-028 parity phase 4v — searchable currency picker + press-scale sweep ([daee923](https://github.com/Adedamola-Aina/AnchorOS/commit/daee9234f11689f5d06abe90ef5f5635ccbf05ef))
* **ios:** fIN-028 parity phase 4w — microinteraction sweep ([7fb11ae](https://github.com/Adedamola-Aina/AnchorOS/commit/7fb11aecde3bc22cc34f538b1695ac6db83085ae))
* **ios:** fIN-028 parity phase 4x — theme picker + dynamic type + reduce-motion link ([c69b19b](https://github.com/Adedamola-Aina/AnchorOS/commit/c69b19badca5bbf21b45036b4f1047456c3e76ea))
* **ios:** fIN-028 parity phase 4y — profile avatar + support + data export ([60b145d](https://github.com/Adedamola-Aina/AnchorOS/commit/60b145d03c61a6d0e0e8ae73c80acca541acecbd))
* **ios:** fIN-028 parity phase 4z — notification preferences sheet ([06def56](https://github.com/Adedamola-Aina/AnchorOS/commit/06def56d86843c17ed974df942166cab64e1668e))
* **mobile:** apply native-feel guards to installed PWA ([2e2db49](https://github.com/Adedamola-Aina/AnchorOS/commit/2e2db49ebe62f590c7a9b3b76b5b159aa4e31901))
* **mobile:** fIN-029 strip web behaviour on native (long-press, drag, pinch, zoom) ([0ee479a](https://github.com/Adedamola-Aina/AnchorOS/commit/0ee479af7bb75ddb53c96aac2e534fa7c1ad7c18))
* **native:** close all 10 parity workstreams (WS-1..WS-10) ([739be4a](https://github.com/Adedamola-Aina/AnchorOS/commit/739be4a7f1c49bafea8e806ba91d5fc02cd1f486))
* **parity:** close remaining native mega-batches ([2d5e23f](https://github.com/Adedamola-Aina/AnchorOS/commit/2d5e23f05b610e73fa94fb679e5254b71d19b1c8))
* **parity:** complete finance, commitments, AI, polish, gestures, and platform sections ([5cf6970](https://github.com/Adedamola-Aina/AnchorOS/commit/5cf6970cbdca69881e6e0529d5ef233973ad6bd3))
* **settings,family:** Wave 2 — Settings 85→95% parity ([ae15e8f](https://github.com/Adedamola-Aina/AnchorOS/commit/ae15e8f9fa9e6d50bc9a5eddaa7beed5cd84cf1b))


### Bug Fixes

* **security:** patch 1 critical + 2 high vulnerabilities (npm audit fix) ([5d4f9ac](https://github.com/Adedamola-Aina/AnchorOS/commit/5d4f9acf8372cae05c6f3f3839db282ae0b128a4))

## [1.18.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.17.1...v1.18.0) (2026-04-16)


### Features

* **auth:** iOS native Sprint 2 — Authentication Parity ([dbff7de](https://github.com/Adedamola-Aina/AnchorOS/commit/dbff7de5b4c853c58cd0bd9b5352a41398929021))
* **ios:** add native anchor dashboard shell ui ([2f568a0](https://github.com/Adedamola-Aina/AnchorOS/commit/2f568a0ddb0e12e62b41f81db63efdced00c9482))
* **ios:** add one-command native sync and open scripts ([ae7732d](https://github.com/Adedamola-Aina/AnchorOS/commit/ae7732ddbc5f447580535672b006d6b3555e7917))
* **ios:** align native shell with anchor tab and banner layout ([bdafa0c](https://github.com/Adedamola-Aina/AnchorOS/commit/bdafa0c03e28963ea303b3df640aa86fd6cf6f5a))
* **ios:** bootstrap native swiftui app with firebase auth scaffold ([fa9318a](https://github.com/Adedamola-Aina/AnchorOS/commit/fa9318ace6da007c3e9ab3fdeda465d62e3230a1))
* **ios:** deliver full native ui parity pass across core tabs ([392a8d1](https://github.com/Adedamola-Aina/AnchorOS/commit/392a8d16c4ec078374578c2790d0995a10576696))
* **ios:** expand native tabs with tasks anchor and finance views ([013428b](https://github.com/Adedamola-Aina/AnchorOS/commit/013428bac20739450a1434bd1b7fcaeb27221862))
* **ios:** FIN-018 Firestore service layer + live data on all 5 native screens ([ecd7eb3](https://github.com/Adedamola-Aina/AnchorOS/commit/ecd7eb371577e120f7166517851a2fcbdbdc2710))
* **ios:** multi-environment Firebase plist swap via build configs ([3de8e3f](https://github.com/Adedamola-Aina/AnchorOS/commit/3de8e3f8cfdfb59951e55114bd9dcfb64546a558))
* **ios:** Sprint 2 — write operations, CRUD forms, toast system ([4b454e3](https://github.com/Adedamola-Aina/AnchorOS/commit/4b454e3033fc0babc4a710af9edc4e6d18758338))
* **ios:** Sprint 3 — Family Mode, mood persistence, FirebaseFunctions ([b8acec1](https://github.com/Adedamola-Aina/AnchorOS/commit/b8acec1d989cb0115e7a74c25068288665ccb3a8))
* **ios:** Sprint 4 — sign-up, edit forms, account detail view ([bec7713](https://github.com/Adedamola-Aina/AnchorOS/commit/bec771372bd31bdd11727afa0f8a0a53cf424863))
* **ios:** Sprint 5 — EditCommitmentSheet, OnboardingView, Dashboard quick-actions, Currency picker ([c24d275](https://github.com/Adedamola-Aina/AnchorOS/commit/c24d275fc0c5e58c50849eb914b3680c4f9ab7d9))
* **ios:** Sprint 6 — tap-to-edit tasks, shared accounts, transaction type filter ([e62b1d2](https://github.com/Adedamola-Aina/AnchorOS/commit/e62b1d288af6ee6d0e1ab6fdadc3dc78ef1f3d7d))
* **ios:** Sprint 7 — Fabric AI insights, spending trends chart, error states, offline persistence ([25b3468](https://github.com/Adedamola-Aina/AnchorOS/commit/25b3468d728e5ebd048286cce0f16f6429fa4c51))
* **ios:** unify native tabs around shared live state and shell polish ([7c91381](https://github.com/Adedamola-Aina/AnchorOS/commit/7c913817361f9f87f31c46a3496e57b666306dad))
* **ios:** wire native dashboard to live project state ([4a95928](https://github.com/Adedamola-Aina/AnchorOS/commit/4a95928f82c40f7dfa868cb30e431ee71ba12f72))
* **mobile:** iOS native Sprint 1 — Foundation & Design System ([0380b2c](https://github.com/Adedamola-Aina/AnchorOS/commit/0380b2c67c870843d90adcbc273b8f58f06f5b5f))
* **mobile:** iOS Sprint 3 — swipe, refresh, security settings FIN-019 ([07e3a0d](https://github.com/Adedamola-Aina/AnchorOS/commit/07e3a0dfadfe85d6e78d8b4931c43752e1c8ffd5))


### Bug Fixes

* **auth:** replace invalid type cast with factorID check BUG-000 ([53f80f4](https://github.com/Adedamola-Aina/AnchorOS/commit/53f80f45cb408c5379da6cffa0026ebf03672aec))
* **auth:** resolve xcode compile errors in passkey + onboarding BUG-000 ([73335a2](https://github.com/Adedamola-Aina/AnchorOS/commit/73335a2e6fbd6e56e4a5752e0335032e8efd9280))
* **finance:** feedback fails when navigator.platform is empty BUG-132 ([5b0937c](https://github.com/Adedamola-Aina/AnchorOS/commit/5b0937c1c723426ba32c7b4471900d283da4637c))
* **ios:** align plist source names with actual file names (Development/Staging/Production) ([708e2b5](https://github.com/Adedamola-Aina/AnchorOS/commit/708e2b5c4c552a9009029caf81b0585836b37e16))
* **ios:** call FirebaseApp.configure() before Firestore init ([2497960](https://github.com/Adedamola-Aina/AnchorOS/commit/2497960a49f70ee9b7452f529d9ffaecb0fe56e1))
* **ios:** configure firebase before auth access ([50b8506](https://github.com/Adedamola-Aina/AnchorOS/commit/50b85062ca2237d555169dd0657d1c799036748d))
* **ios:** correct AnchorFormField param names in edit sheets (label→placeholder, keyboard→keyboardType) ([f4b347a](https://github.com/Adedamola-Aina/AnchorOS/commit/f4b347af626dc4fd64d552d02416f6e60987d11c))
* **ios:** escape curly quotes in AnchorAIView string interpolation ([390365f](https://github.com/Adedamola-Aina/AnchorOS/commit/390365f83a67f30cca2bc11157073812e07e0ee8))
* **ios:** pwa visual parity — background, card border, shadow, aspect ratio BUG-000 ([ec06351](https://github.com/Adedamola-Aina/AnchorOS/commit/ec06351428baca4f0e295797fcfbd06e738e1d4b))
* **ios:** remove FirebaseFirestoreSwift — merged into FirebaseFirestore in SDK 11 ([3ee4178](https://github.com/Adedamola-Aina/AnchorOS/commit/3ee4178e895d5879eaa99a9f9b51eb30c16e751b))
* **ios:** UI/UX parity pass — match PWA layout across all 5 screens ([e0554c9](https://github.com/Adedamola-Aina/AnchorOS/commit/e0554c9382657bc0762cafbdee73a720d223f858))
* **mobile:** add @MainActor to saveSavingsGoal for FinanceStore isolation BUG-000 ([d7e4dfe](https://github.com/Adedamola-Aina/AnchorOS/commit/d7e4dfe3953916c7b3bc2091350dcb8793c67456))
* **mobile:** move saveSavingsGoal to main view for correct env object access BUG-000 ([b4adb51](https://github.com/Adedamola-Aina/AnchorOS/commit/b4adb51a13b7b85e817ff3b7186d2c5b7b80903c))

## [1.17.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.17.0...v1.17.1) (2026-04-11)


### Bug Fixes

* **dashboard:** reconcile roadmap status from deployment evidence ([45faee7](https://github.com/Adedamola-Aina/AnchorOS/commit/45faee72bdda098666fe560524193459728393cb))
* **mobile:** PWA-008 stabilize iOS bottom nav safe-area and dashboard health signals ([a85fe8b](https://github.com/Adedamola-Aina/AnchorOS/commit/a85fe8b9b8c5203d75d83460fa530dfc0a3c5df4))

## [1.17.1-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.17.0...v1.17.1-rc.0) (2026-04-11)


### Bug Fixes

* **dashboard:** reconcile roadmap status from deployment evidence ([45faee7](https://github.com/Adedamola-Aina/AnchorOS/commit/45faee72bdda098666fe560524193459728393cb))
* **mobile:** PWA-008 stabilize iOS bottom nav safe-area and dashboard health signals ([a85fe8b](https://github.com/Adedamola-Aina/AnchorOS/commit/a85fe8b9b8c5203d75d83460fa530dfc0a3c5df4))

## [1.17.1-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.17.0...v1.17.1-dev.0) (2026-04-11)


### Bug Fixes

* **dashboard:** reconcile roadmap status from deployment evidence ([45faee7](https://github.com/Adedamola-Aina/AnchorOS/commit/45faee72bdda098666fe560524193459728393cb))
* **mobile:** PWA-008 stabilize iOS bottom nav safe-area and dashboard health signals ([a85fe8b](https://github.com/Adedamola-Aina/AnchorOS/commit/a85fe8b9b8c5203d75d83460fa530dfc0a3c5df4))

## [1.17.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.1...v1.17.0) (2026-04-11)


### Features

* **auth:** complete auth sprint — AUTH-003 AUTH-006 AUTH-008 SEC-006 ARCH-025 ([557e8fd](https://github.com/Adedamola-Aina/AnchorOS/commit/557e8fd2d57d49eeddf51f9d02cb146d44607c2d))
* **auth:** sprint 7 auth and security — AUTH-003 AUTH-006 AUTH-008 SEC-006 ([a12aabc](https://github.com/Adedamola-Aina/AnchorOS/commit/a12aabc09068dd1a663ef4a198bab735408c9d23))
* **commitments:** sprint 6 commitments domain — COMM-007 COMM-001 COMM-002 FIN-014 ([7a9e5c3](https://github.com/Adedamola-Aina/AnchorOS/commit/7a9e5c32a6a57d879250567c79d9ada329cde407))
* **fabric:** sprint 8 — insight reasoning, anomaly alerts, savings suggestions, goal projection ([8287957](https://github.com/Adedamola-Aina/AnchorOS/commit/8287957bcd2a03dde9e2b72cde587e33f71588e3))
* **fabric:** sprint 9 — scenario modelling, conversation context, experiments, monthly review ([c8fc152](https://github.com/Adedamola-Aina/AnchorOS/commit/c8fc152064839084fb551f7ed248fdc936ebcd6f))
* **finance:** sprint 5 product features — PRD-007 UX-036 COMM-006 PRD-010 ([ad74935](https://github.com/Adedamola-Aina/AnchorOS/commit/ad7493568e93069d2ecd99d3373dd8b78bf66e21))
* **functions:** sprint 3 schema and migration foundation — ENG-003 DB-001 ARCH-025 BUG-025 ([20de8a6](https://github.com/Adedamola-Aina/AnchorOS/commit/20de8a65e83781347ab417bbdc2f89dac1af23e7))
* **functions:** sprint 4 observability and measurement — ENG-007 SRE-004 SRE-005 DATA-003 ([7128292](https://github.com/Adedamola-Aina/AnchorOS/commit/71282921f30cea57811975e0e0286e6feb4c6e44))
* **quality:** sprint 1 quality gate foundation — GAP-006 ARCH-024 DB-004 ARCH-027 ([9d0cafd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d0cafdb1bd322cbeb9b8a09e55c14739fe8e012))
* **quality:** sprint 2 code health and performance — GAP-010 GAP-008 PERF-006 PSE-003 ([b0e194d](https://github.com/Adedamola-Aina/AnchorOS/commit/b0e194d10d0b91aefcf41bc72cd22424d05d3c79))


### Bug Fixes

* **e2e:** avoid strict union in finance delete assertion ([c8904eb](https://github.com/Adedamola-Aina/AnchorOS/commit/c8904ebde6c67a22e0f42cf3361b3a29282da0e2))
* **e2e:** harden finance spec fallbacks ([ebab396](https://github.com/Adedamola-Aina/AnchorOS/commit/ebab3960de35bf14aea0e90fcb2e29cf246feba4))
* **e2e:** stabilize nav and unblock staging pipeline ([8634a53](https://github.com/Adedamola-Aina/AnchorOS/commit/8634a53bf0343d2da7c27055c64fb9adec482764))
* **fabric:** expand intent detection for natural transaction phrases ([2f819cd](https://github.com/Adedamola-Aina/AnchorOS/commit/2f819cde025ba99ea5b6ecb46a906555c3619819))

## [1.17.0-rc.5](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.1...v1.17.0-rc.5) (2026-04-10)


### Features

* **auth:** complete auth sprint — AUTH-003 AUTH-006 AUTH-008 SEC-006 ARCH-025 ([557e8fd](https://github.com/Adedamola-Aina/AnchorOS/commit/557e8fd2d57d49eeddf51f9d02cb146d44607c2d))
* **auth:** sprint 7 auth and security — AUTH-003 AUTH-006 AUTH-008 SEC-006 ([a12aabc](https://github.com/Adedamola-Aina/AnchorOS/commit/a12aabc09068dd1a663ef4a198bab735408c9d23))
* **commitments:** sprint 6 commitments domain — COMM-007 COMM-001 COMM-002 FIN-014 ([7a9e5c3](https://github.com/Adedamola-Aina/AnchorOS/commit/7a9e5c32a6a57d879250567c79d9ada329cde407))
* **fabric:** sprint 8 — insight reasoning, anomaly alerts, savings suggestions, goal projection ([8287957](https://github.com/Adedamola-Aina/AnchorOS/commit/8287957bcd2a03dde9e2b72cde587e33f71588e3))
* **fabric:** sprint 9 — scenario modelling, conversation context, experiments, monthly review ([c8fc152](https://github.com/Adedamola-Aina/AnchorOS/commit/c8fc152064839084fb551f7ed248fdc936ebcd6f))
* **finance:** sprint 5 product features — PRD-007 UX-036 COMM-006 PRD-010 ([ad74935](https://github.com/Adedamola-Aina/AnchorOS/commit/ad7493568e93069d2ecd99d3373dd8b78bf66e21))
* **functions:** sprint 3 schema and migration foundation — ENG-003 DB-001 ARCH-025 BUG-025 ([20de8a6](https://github.com/Adedamola-Aina/AnchorOS/commit/20de8a65e83781347ab417bbdc2f89dac1af23e7))
* **functions:** sprint 4 observability and measurement — ENG-007 SRE-004 SRE-005 DATA-003 ([7128292](https://github.com/Adedamola-Aina/AnchorOS/commit/71282921f30cea57811975e0e0286e6feb4c6e44))
* **quality:** sprint 1 quality gate foundation — GAP-006 ARCH-024 DB-004 ARCH-027 ([9d0cafd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d0cafdb1bd322cbeb9b8a09e55c14739fe8e012))
* **quality:** sprint 2 code health and performance — GAP-010 GAP-008 PERF-006 PSE-003 ([b0e194d](https://github.com/Adedamola-Aina/AnchorOS/commit/b0e194d10d0b91aefcf41bc72cd22424d05d3c79))


### Bug Fixes

* **e2e:** avoid strict union in finance delete assertion ([c8904eb](https://github.com/Adedamola-Aina/AnchorOS/commit/c8904ebde6c67a22e0f42cf3361b3a29282da0e2))
* **e2e:** harden finance spec fallbacks ([ebab396](https://github.com/Adedamola-Aina/AnchorOS/commit/ebab3960de35bf14aea0e90fcb2e29cf246feba4))
* **e2e:** stabilize nav and unblock staging pipeline ([8634a53](https://github.com/Adedamola-Aina/AnchorOS/commit/8634a53bf0343d2da7c27055c64fb9adec482764))
* **fabric:** expand intent detection for natural transaction phrases ([2f819cd](https://github.com/Adedamola-Aina/AnchorOS/commit/2f819cde025ba99ea5b6ecb46a906555c3619819))

## [1.17.0-rc.4](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.1...v1.17.0-rc.4) (2026-04-10)


### Features

* **auth:** complete auth sprint — AUTH-003 AUTH-006 AUTH-008 SEC-006 ARCH-025 ([557e8fd](https://github.com/Adedamola-Aina/AnchorOS/commit/557e8fd2d57d49eeddf51f9d02cb146d44607c2d))
* **auth:** sprint 7 auth and security — AUTH-003 AUTH-006 AUTH-008 SEC-006 ([a12aabc](https://github.com/Adedamola-Aina/AnchorOS/commit/a12aabc09068dd1a663ef4a198bab735408c9d23))
* **commitments:** sprint 6 commitments domain — COMM-007 COMM-001 COMM-002 FIN-014 ([7a9e5c3](https://github.com/Adedamola-Aina/AnchorOS/commit/7a9e5c32a6a57d879250567c79d9ada329cde407))
* **fabric:** sprint 8 — insight reasoning, anomaly alerts, savings suggestions, goal projection ([8287957](https://github.com/Adedamola-Aina/AnchorOS/commit/8287957bcd2a03dde9e2b72cde587e33f71588e3))
* **fabric:** sprint 9 — scenario modelling, conversation context, experiments, monthly review ([c8fc152](https://github.com/Adedamola-Aina/AnchorOS/commit/c8fc152064839084fb551f7ed248fdc936ebcd6f))
* **finance:** sprint 5 product features — PRD-007 UX-036 COMM-006 PRD-010 ([ad74935](https://github.com/Adedamola-Aina/AnchorOS/commit/ad7493568e93069d2ecd99d3373dd8b78bf66e21))
* **functions:** sprint 3 schema and migration foundation — ENG-003 DB-001 ARCH-025 BUG-025 ([20de8a6](https://github.com/Adedamola-Aina/AnchorOS/commit/20de8a65e83781347ab417bbdc2f89dac1af23e7))
* **functions:** sprint 4 observability and measurement — ENG-007 SRE-004 SRE-005 DATA-003 ([7128292](https://github.com/Adedamola-Aina/AnchorOS/commit/71282921f30cea57811975e0e0286e6feb4c6e44))
* **quality:** sprint 1 quality gate foundation — GAP-006 ARCH-024 DB-004 ARCH-027 ([9d0cafd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d0cafdb1bd322cbeb9b8a09e55c14739fe8e012))
* **quality:** sprint 2 code health and performance — GAP-010 GAP-008 PERF-006 PSE-003 ([b0e194d](https://github.com/Adedamola-Aina/AnchorOS/commit/b0e194d10d0b91aefcf41bc72cd22424d05d3c79))


### Bug Fixes

* **e2e:** harden finance spec fallbacks ([ebab396](https://github.com/Adedamola-Aina/AnchorOS/commit/ebab3960de35bf14aea0e90fcb2e29cf246feba4))
* **e2e:** stabilize nav and unblock staging pipeline ([8634a53](https://github.com/Adedamola-Aina/AnchorOS/commit/8634a53bf0343d2da7c27055c64fb9adec482764))
* **fabric:** expand intent detection for natural transaction phrases ([2f819cd](https://github.com/Adedamola-Aina/AnchorOS/commit/2f819cde025ba99ea5b6ecb46a906555c3619819))

## [1.17.0-rc.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.1...v1.17.0-rc.3) (2026-04-10)


### Features

* **auth:** complete auth sprint — AUTH-003 AUTH-006 AUTH-008 SEC-006 ARCH-025 ([557e8fd](https://github.com/Adedamola-Aina/AnchorOS/commit/557e8fd2d57d49eeddf51f9d02cb146d44607c2d))
* **auth:** sprint 7 auth and security — AUTH-003 AUTH-006 AUTH-008 SEC-006 ([a12aabc](https://github.com/Adedamola-Aina/AnchorOS/commit/a12aabc09068dd1a663ef4a198bab735408c9d23))
* **commitments:** sprint 6 commitments domain — COMM-007 COMM-001 COMM-002 FIN-014 ([7a9e5c3](https://github.com/Adedamola-Aina/AnchorOS/commit/7a9e5c32a6a57d879250567c79d9ada329cde407))
* **fabric:** sprint 8 — insight reasoning, anomaly alerts, savings suggestions, goal projection ([8287957](https://github.com/Adedamola-Aina/AnchorOS/commit/8287957bcd2a03dde9e2b72cde587e33f71588e3))
* **fabric:** sprint 9 — scenario modelling, conversation context, experiments, monthly review ([c8fc152](https://github.com/Adedamola-Aina/AnchorOS/commit/c8fc152064839084fb551f7ed248fdc936ebcd6f))
* **finance:** sprint 5 product features — PRD-007 UX-036 COMM-006 PRD-010 ([ad74935](https://github.com/Adedamola-Aina/AnchorOS/commit/ad7493568e93069d2ecd99d3373dd8b78bf66e21))
* **functions:** sprint 3 schema and migration foundation — ENG-003 DB-001 ARCH-025 BUG-025 ([20de8a6](https://github.com/Adedamola-Aina/AnchorOS/commit/20de8a65e83781347ab417bbdc2f89dac1af23e7))
* **functions:** sprint 4 observability and measurement — ENG-007 SRE-004 SRE-005 DATA-003 ([7128292](https://github.com/Adedamola-Aina/AnchorOS/commit/71282921f30cea57811975e0e0286e6feb4c6e44))
* **quality:** sprint 1 quality gate foundation — GAP-006 ARCH-024 DB-004 ARCH-027 ([9d0cafd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d0cafdb1bd322cbeb9b8a09e55c14739fe8e012))
* **quality:** sprint 2 code health and performance — GAP-010 GAP-008 PERF-006 PSE-003 ([b0e194d](https://github.com/Adedamola-Aina/AnchorOS/commit/b0e194d10d0b91aefcf41bc72cd22424d05d3c79))


### Bug Fixes

* **e2e:** stabilize nav and unblock staging pipeline ([8634a53](https://github.com/Adedamola-Aina/AnchorOS/commit/8634a53bf0343d2da7c27055c64fb9adec482764))
* **fabric:** expand intent detection for natural transaction phrases ([2f819cd](https://github.com/Adedamola-Aina/AnchorOS/commit/2f819cde025ba99ea5b6ecb46a906555c3619819))

## [1.17.0-rc.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.1...v1.17.0-rc.2) (2026-04-10)


### Features

* **auth:** complete auth sprint — AUTH-003 AUTH-006 AUTH-008 SEC-006 ARCH-025 ([557e8fd](https://github.com/Adedamola-Aina/AnchorOS/commit/557e8fd2d57d49eeddf51f9d02cb146d44607c2d))
* **auth:** sprint 7 auth and security — AUTH-003 AUTH-006 AUTH-008 SEC-006 ([a12aabc](https://github.com/Adedamola-Aina/AnchorOS/commit/a12aabc09068dd1a663ef4a198bab735408c9d23))
* **commitments:** sprint 6 commitments domain — COMM-007 COMM-001 COMM-002 FIN-014 ([7a9e5c3](https://github.com/Adedamola-Aina/AnchorOS/commit/7a9e5c32a6a57d879250567c79d9ada329cde407))
* **fabric:** sprint 8 — insight reasoning, anomaly alerts, savings suggestions, goal projection ([8287957](https://github.com/Adedamola-Aina/AnchorOS/commit/8287957bcd2a03dde9e2b72cde587e33f71588e3))
* **fabric:** sprint 9 — scenario modelling, conversation context, experiments, monthly review ([c8fc152](https://github.com/Adedamola-Aina/AnchorOS/commit/c8fc152064839084fb551f7ed248fdc936ebcd6f))
* **finance:** sprint 5 product features — PRD-007 UX-036 COMM-006 PRD-010 ([ad74935](https://github.com/Adedamola-Aina/AnchorOS/commit/ad7493568e93069d2ecd99d3373dd8b78bf66e21))
* **functions:** sprint 3 schema and migration foundation — ENG-003 DB-001 ARCH-025 BUG-025 ([20de8a6](https://github.com/Adedamola-Aina/AnchorOS/commit/20de8a65e83781347ab417bbdc2f89dac1af23e7))
* **functions:** sprint 4 observability and measurement — ENG-007 SRE-004 SRE-005 DATA-003 ([7128292](https://github.com/Adedamola-Aina/AnchorOS/commit/71282921f30cea57811975e0e0286e6feb4c6e44))
* **quality:** sprint 1 quality gate foundation — GAP-006 ARCH-024 DB-004 ARCH-027 ([9d0cafd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d0cafdb1bd322cbeb9b8a09e55c14739fe8e012))
* **quality:** sprint 2 code health and performance — GAP-010 GAP-008 PERF-006 PSE-003 ([b0e194d](https://github.com/Adedamola-Aina/AnchorOS/commit/b0e194d10d0b91aefcf41bc72cd22424d05d3c79))


### Bug Fixes

* **fabric:** expand intent detection for natural transaction phrases ([2f819cd](https://github.com/Adedamola-Aina/AnchorOS/commit/2f819cde025ba99ea5b6ecb46a906555c3619819))

## [1.17.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.1...v1.17.0-rc.1) (2026-04-10)


### Features

* **auth:** complete auth sprint — AUTH-003 AUTH-006 AUTH-008 SEC-006 ARCH-025 ([557e8fd](https://github.com/Adedamola-Aina/AnchorOS/commit/557e8fd2d57d49eeddf51f9d02cb146d44607c2d))
* **auth:** sprint 7 auth and security — AUTH-003 AUTH-006 AUTH-008 SEC-006 ([a12aabc](https://github.com/Adedamola-Aina/AnchorOS/commit/a12aabc09068dd1a663ef4a198bab735408c9d23))
* **commitments:** sprint 6 commitments domain — COMM-007 COMM-001 COMM-002 FIN-014 ([7a9e5c3](https://github.com/Adedamola-Aina/AnchorOS/commit/7a9e5c32a6a57d879250567c79d9ada329cde407))
* **fabric:** sprint 8 — insight reasoning, anomaly alerts, savings suggestions, goal projection ([8287957](https://github.com/Adedamola-Aina/AnchorOS/commit/8287957bcd2a03dde9e2b72cde587e33f71588e3))
* **fabric:** sprint 9 — scenario modelling, conversation context, experiments, monthly review ([c8fc152](https://github.com/Adedamola-Aina/AnchorOS/commit/c8fc152064839084fb551f7ed248fdc936ebcd6f))
* **finance:** sprint 5 product features — PRD-007 UX-036 COMM-006 PRD-010 ([ad74935](https://github.com/Adedamola-Aina/AnchorOS/commit/ad7493568e93069d2ecd99d3373dd8b78bf66e21))
* **functions:** sprint 3 schema and migration foundation — ENG-003 DB-001 ARCH-025 BUG-025 ([20de8a6](https://github.com/Adedamola-Aina/AnchorOS/commit/20de8a65e83781347ab417bbdc2f89dac1af23e7))
* **functions:** sprint 4 observability and measurement — ENG-007 SRE-004 SRE-005 DATA-003 ([7128292](https://github.com/Adedamola-Aina/AnchorOS/commit/71282921f30cea57811975e0e0286e6feb4c6e44))
* **quality:** sprint 1 quality gate foundation — GAP-006 ARCH-024 DB-004 ARCH-027 ([9d0cafd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d0cafdb1bd322cbeb9b8a09e55c14739fe8e012))
* **quality:** sprint 2 code health and performance — GAP-010 GAP-008 PERF-006 PSE-003 ([b0e194d](https://github.com/Adedamola-Aina/AnchorOS/commit/b0e194d10d0b91aefcf41bc72cd22424d05d3c79))


### Bug Fixes

* **fabric:** expand intent detection for natural transaction phrases ([2f819cd](https://github.com/Adedamola-Aina/AnchorOS/commit/2f819cde025ba99ea5b6ecb46a906555c3619819))

## [1.17.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.1...v1.17.0-rc.0) (2026-04-10)


### Features

* **auth:** complete auth sprint — AUTH-003 AUTH-006 AUTH-008 SEC-006 ARCH-025 ([557e8fd](https://github.com/Adedamola-Aina/AnchorOS/commit/557e8fd2d57d49eeddf51f9d02cb146d44607c2d))
* **auth:** sprint 7 auth and security — AUTH-003 AUTH-006 AUTH-008 SEC-006 ([a12aabc](https://github.com/Adedamola-Aina/AnchorOS/commit/a12aabc09068dd1a663ef4a198bab735408c9d23))
* **commitments:** sprint 6 commitments domain — COMM-007 COMM-001 COMM-002 FIN-014 ([7a9e5c3](https://github.com/Adedamola-Aina/AnchorOS/commit/7a9e5c32a6a57d879250567c79d9ada329cde407))
* **fabric:** sprint 8 — insight reasoning, anomaly alerts, savings suggestions, goal projection ([8287957](https://github.com/Adedamola-Aina/AnchorOS/commit/8287957bcd2a03dde9e2b72cde587e33f71588e3))
* **fabric:** sprint 9 — scenario modelling, conversation context, experiments, monthly review ([c8fc152](https://github.com/Adedamola-Aina/AnchorOS/commit/c8fc152064839084fb551f7ed248fdc936ebcd6f))
* **finance:** sprint 5 product features — PRD-007 UX-036 COMM-006 PRD-010 ([ad74935](https://github.com/Adedamola-Aina/AnchorOS/commit/ad7493568e93069d2ecd99d3373dd8b78bf66e21))
* **functions:** sprint 3 schema and migration foundation — ENG-003 DB-001 ARCH-025 BUG-025 ([20de8a6](https://github.com/Adedamola-Aina/AnchorOS/commit/20de8a65e83781347ab417bbdc2f89dac1af23e7))
* **functions:** sprint 4 observability and measurement — ENG-007 SRE-004 SRE-005 DATA-003 ([7128292](https://github.com/Adedamola-Aina/AnchorOS/commit/71282921f30cea57811975e0e0286e6feb4c6e44))
* **quality:** sprint 1 quality gate foundation — GAP-006 ARCH-024 DB-004 ARCH-027 ([9d0cafd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d0cafdb1bd322cbeb9b8a09e55c14739fe8e012))
* **quality:** sprint 2 code health and performance — GAP-010 GAP-008 PERF-006 PSE-003 ([b0e194d](https://github.com/Adedamola-Aina/AnchorOS/commit/b0e194d10d0b91aefcf41bc72cd22424d05d3c79))


### Bug Fixes

* **fabric:** expand intent detection for natural transaction phrases ([2f819cd](https://github.com/Adedamola-Aina/AnchorOS/commit/2f819cde025ba99ea5b6ecb46a906555c3619819))

## [1.17.0-dev.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.1...v1.17.0-dev.1) (2026-04-10)


### Features

* **auth:** complete auth sprint — AUTH-003 AUTH-006 AUTH-008 SEC-006 ARCH-025 ([557e8fd](https://github.com/Adedamola-Aina/AnchorOS/commit/557e8fd2d57d49eeddf51f9d02cb146d44607c2d))
* **auth:** sprint 7 auth and security — AUTH-003 AUTH-006 AUTH-008 SEC-006 ([a12aabc](https://github.com/Adedamola-Aina/AnchorOS/commit/a12aabc09068dd1a663ef4a198bab735408c9d23))
* **commitments:** sprint 6 commitments domain — COMM-007 COMM-001 COMM-002 FIN-014 ([7a9e5c3](https://github.com/Adedamola-Aina/AnchorOS/commit/7a9e5c32a6a57d879250567c79d9ada329cde407))
* **fabric:** sprint 8 — insight reasoning, anomaly alerts, savings suggestions, goal projection ([8287957](https://github.com/Adedamola-Aina/AnchorOS/commit/8287957bcd2a03dde9e2b72cde587e33f71588e3))
* **fabric:** sprint 9 — scenario modelling, conversation context, experiments, monthly review ([c8fc152](https://github.com/Adedamola-Aina/AnchorOS/commit/c8fc152064839084fb551f7ed248fdc936ebcd6f))
* **finance:** sprint 5 product features — PRD-007 UX-036 COMM-006 PRD-010 ([ad74935](https://github.com/Adedamola-Aina/AnchorOS/commit/ad7493568e93069d2ecd99d3373dd8b78bf66e21))
* **functions:** sprint 3 schema and migration foundation — ENG-003 DB-001 ARCH-025 BUG-025 ([20de8a6](https://github.com/Adedamola-Aina/AnchorOS/commit/20de8a65e83781347ab417bbdc2f89dac1af23e7))
* **functions:** sprint 4 observability and measurement — ENG-007 SRE-004 SRE-005 DATA-003 ([7128292](https://github.com/Adedamola-Aina/AnchorOS/commit/71282921f30cea57811975e0e0286e6feb4c6e44))
* **quality:** sprint 1 quality gate foundation — GAP-006 ARCH-024 DB-004 ARCH-027 ([9d0cafd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d0cafdb1bd322cbeb9b8a09e55c14739fe8e012))
* **quality:** sprint 2 code health and performance — GAP-010 GAP-008 PERF-006 PSE-003 ([b0e194d](https://github.com/Adedamola-Aina/AnchorOS/commit/b0e194d10d0b91aefcf41bc72cd22424d05d3c79))


### Bug Fixes

* **fabric:** expand intent detection for natural transaction phrases ([2f819cd](https://github.com/Adedamola-Aina/AnchorOS/commit/2f819cde025ba99ea5b6ecb46a906555c3619819))

## [1.17.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.1...v1.17.0-dev.0) (2026-04-10)


### Features

* **auth:** complete auth sprint — AUTH-003 AUTH-006 AUTH-008 SEC-006 ARCH-025 ([557e8fd](https://github.com/Adedamola-Aina/AnchorOS/commit/557e8fd2d57d49eeddf51f9d02cb146d44607c2d))
* **auth:** sprint 7 auth and security — AUTH-003 AUTH-006 AUTH-008 SEC-006 ([a12aabc](https://github.com/Adedamola-Aina/AnchorOS/commit/a12aabc09068dd1a663ef4a198bab735408c9d23))
* **commitments:** sprint 6 commitments domain — COMM-007 COMM-001 COMM-002 FIN-014 ([7a9e5c3](https://github.com/Adedamola-Aina/AnchorOS/commit/7a9e5c32a6a57d879250567c79d9ada329cde407))
* **fabric:** sprint 8 — insight reasoning, anomaly alerts, savings suggestions, goal projection ([8287957](https://github.com/Adedamola-Aina/AnchorOS/commit/8287957bcd2a03dde9e2b72cde587e33f71588e3))
* **fabric:** sprint 9 — scenario modelling, conversation context, experiments, monthly review ([c8fc152](https://github.com/Adedamola-Aina/AnchorOS/commit/c8fc152064839084fb551f7ed248fdc936ebcd6f))
* **finance:** sprint 5 product features — PRD-007 UX-036 COMM-006 PRD-010 ([ad74935](https://github.com/Adedamola-Aina/AnchorOS/commit/ad7493568e93069d2ecd99d3373dd8b78bf66e21))
* **functions:** sprint 3 schema and migration foundation — ENG-003 DB-001 ARCH-025 BUG-025 ([20de8a6](https://github.com/Adedamola-Aina/AnchorOS/commit/20de8a65e83781347ab417bbdc2f89dac1af23e7))
* **functions:** sprint 4 observability and measurement — ENG-007 SRE-004 SRE-005 DATA-003 ([7128292](https://github.com/Adedamola-Aina/AnchorOS/commit/71282921f30cea57811975e0e0286e6feb4c6e44))
* **quality:** sprint 1 quality gate foundation — GAP-006 ARCH-024 DB-004 ARCH-027 ([9d0cafd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d0cafdb1bd322cbeb9b8a09e55c14739fe8e012))
* **quality:** sprint 2 code health and performance — GAP-010 GAP-008 PERF-006 PSE-003 ([b0e194d](https://github.com/Adedamola-Aina/AnchorOS/commit/b0e194d10d0b91aefcf41bc72cd22424d05d3c79))


### Bug Fixes

* **fabric:** expand intent detection for natural transaction phrases ([2f819cd](https://github.com/Adedamola-Aina/AnchorOS/commit/2f819cde025ba99ea5b6ecb46a906555c3619819))

## [1.17.0-rc.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.1...v1.17.0-rc.3) (2026-04-10)


### Features

* **auth:** complete auth sprint — AUTH-003 AUTH-006 AUTH-008 SEC-006 ARCH-025 ([557e8fd](https://github.com/Adedamola-Aina/AnchorOS/commit/557e8fd2d57d49eeddf51f9d02cb146d44607c2d))
* **auth:** sprint 7 auth and security — AUTH-003 AUTH-006 AUTH-008 SEC-006 ([a12aabc](https://github.com/Adedamola-Aina/AnchorOS/commit/a12aabc09068dd1a663ef4a198bab735408c9d23))
* **commitments:** sprint 6 commitments domain — COMM-007 COMM-001 COMM-002 FIN-014 ([7a9e5c3](https://github.com/Adedamola-Aina/AnchorOS/commit/7a9e5c32a6a57d879250567c79d9ada329cde407))
* **fabric:** sprint 8 — insight reasoning, anomaly alerts, savings suggestions, goal projection ([8287957](https://github.com/Adedamola-Aina/AnchorOS/commit/8287957bcd2a03dde9e2b72cde587e33f71588e3))
* **fabric:** sprint 9 — scenario modelling, conversation context, experiments, monthly review ([c8fc152](https://github.com/Adedamola-Aina/AnchorOS/commit/c8fc152064839084fb551f7ed248fdc936ebcd6f))
* **finance:** sprint 5 product features — PRD-007 UX-036 COMM-006 PRD-010 ([ad74935](https://github.com/Adedamola-Aina/AnchorOS/commit/ad7493568e93069d2ecd99d3373dd8b78bf66e21))
* **functions:** sprint 3 schema and migration foundation — ENG-003 DB-001 ARCH-025 BUG-025 ([20de8a6](https://github.com/Adedamola-Aina/AnchorOS/commit/20de8a65e83781347ab417bbdc2f89dac1af23e7))
* **functions:** sprint 4 observability and measurement — ENG-007 SRE-004 SRE-005 DATA-003 ([7128292](https://github.com/Adedamola-Aina/AnchorOS/commit/71282921f30cea57811975e0e0286e6feb4c6e44))
* **quality:** sprint 1 quality gate foundation — GAP-006 ARCH-024 DB-004 ARCH-027 ([9d0cafd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d0cafdb1bd322cbeb9b8a09e55c14739fe8e012))
* **quality:** sprint 2 code health and performance — GAP-010 GAP-008 PERF-006 PSE-003 ([b0e194d](https://github.com/Adedamola-Aina/AnchorOS/commit/b0e194d10d0b91aefcf41bc72cd22424d05d3c79))


### Bug Fixes

* **fabric:** expand intent detection for natural transaction phrases ([2f819cd](https://github.com/Adedamola-Aina/AnchorOS/commit/2f819cde025ba99ea5b6ecb46a906555c3619819))

## [1.17.0-rc.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.1...v1.17.0-rc.2) (2026-04-10)


### Features

* **auth:** complete auth sprint — AUTH-003 AUTH-006 AUTH-008 SEC-006 ARCH-025 ([557e8fd](https://github.com/Adedamola-Aina/AnchorOS/commit/557e8fd2d57d49eeddf51f9d02cb146d44607c2d))
* **auth:** sprint 7 auth and security — AUTH-003 AUTH-006 AUTH-008 SEC-006 ([a12aabc](https://github.com/Adedamola-Aina/AnchorOS/commit/a12aabc09068dd1a663ef4a198bab735408c9d23))
* **commitments:** sprint 6 commitments domain — COMM-007 COMM-001 COMM-002 FIN-014 ([7a9e5c3](https://github.com/Adedamola-Aina/AnchorOS/commit/7a9e5c32a6a57d879250567c79d9ada329cde407))
* **fabric:** sprint 8 — insight reasoning, anomaly alerts, savings suggestions, goal projection ([8287957](https://github.com/Adedamola-Aina/AnchorOS/commit/8287957bcd2a03dde9e2b72cde587e33f71588e3))
* **fabric:** sprint 9 — scenario modelling, conversation context, experiments, monthly review ([c8fc152](https://github.com/Adedamola-Aina/AnchorOS/commit/c8fc152064839084fb551f7ed248fdc936ebcd6f))
* **finance:** sprint 5 product features — PRD-007 UX-036 COMM-006 PRD-010 ([ad74935](https://github.com/Adedamola-Aina/AnchorOS/commit/ad7493568e93069d2ecd99d3373dd8b78bf66e21))
* **functions:** sprint 3 schema and migration foundation — ENG-003 DB-001 ARCH-025 BUG-025 ([20de8a6](https://github.com/Adedamola-Aina/AnchorOS/commit/20de8a65e83781347ab417bbdc2f89dac1af23e7))
* **functions:** sprint 4 observability and measurement — ENG-007 SRE-004 SRE-005 DATA-003 ([7128292](https://github.com/Adedamola-Aina/AnchorOS/commit/71282921f30cea57811975e0e0286e6feb4c6e44))
* **quality:** sprint 1 quality gate foundation — GAP-006 ARCH-024 DB-004 ARCH-027 ([9d0cafd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d0cafdb1bd322cbeb9b8a09e55c14739fe8e012))
* **quality:** sprint 2 code health and performance — GAP-010 GAP-008 PERF-006 PSE-003 ([b0e194d](https://github.com/Adedamola-Aina/AnchorOS/commit/b0e194d10d0b91aefcf41bc72cd22424d05d3c79))


### Bug Fixes

* **fabric:** expand intent detection for natural transaction phrases ([2f819cd](https://github.com/Adedamola-Aina/AnchorOS/commit/2f819cde025ba99ea5b6ecb46a906555c3619819))

## [1.17.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.1...v1.17.0-rc.1) (2026-04-10)


### Features

* **auth:** complete auth sprint — AUTH-003 AUTH-006 AUTH-008 SEC-006 ARCH-025 ([557e8fd](https://github.com/Adedamola-Aina/AnchorOS/commit/557e8fd2d57d49eeddf51f9d02cb146d44607c2d))
* **auth:** sprint 7 auth and security — AUTH-003 AUTH-006 AUTH-008 SEC-006 ([a12aabc](https://github.com/Adedamola-Aina/AnchorOS/commit/a12aabc09068dd1a663ef4a198bab735408c9d23))
* **commitments:** sprint 6 commitments domain — COMM-007 COMM-001 COMM-002 FIN-014 ([7a9e5c3](https://github.com/Adedamola-Aina/AnchorOS/commit/7a9e5c32a6a57d879250567c79d9ada329cde407))
* **fabric:** sprint 8 — insight reasoning, anomaly alerts, savings suggestions, goal projection ([8287957](https://github.com/Adedamola-Aina/AnchorOS/commit/8287957bcd2a03dde9e2b72cde587e33f71588e3))
* **fabric:** sprint 9 — scenario modelling, conversation context, experiments, monthly review ([c8fc152](https://github.com/Adedamola-Aina/AnchorOS/commit/c8fc152064839084fb551f7ed248fdc936ebcd6f))
* **finance:** sprint 5 product features — PRD-007 UX-036 COMM-006 PRD-010 ([ad74935](https://github.com/Adedamola-Aina/AnchorOS/commit/ad7493568e93069d2ecd99d3373dd8b78bf66e21))
* **functions:** sprint 3 schema and migration foundation — ENG-003 DB-001 ARCH-025 BUG-025 ([20de8a6](https://github.com/Adedamola-Aina/AnchorOS/commit/20de8a65e83781347ab417bbdc2f89dac1af23e7))
* **functions:** sprint 4 observability and measurement — ENG-007 SRE-004 SRE-005 DATA-003 ([7128292](https://github.com/Adedamola-Aina/AnchorOS/commit/71282921f30cea57811975e0e0286e6feb4c6e44))
* **quality:** sprint 1 quality gate foundation — GAP-006 ARCH-024 DB-004 ARCH-027 ([9d0cafd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d0cafdb1bd322cbeb9b8a09e55c14739fe8e012))
* **quality:** sprint 2 code health and performance — GAP-010 GAP-008 PERF-006 PSE-003 ([b0e194d](https://github.com/Adedamola-Aina/AnchorOS/commit/b0e194d10d0b91aefcf41bc72cd22424d05d3c79))


### Bug Fixes

* **fabric:** expand intent detection for natural transaction phrases ([2f819cd](https://github.com/Adedamola-Aina/AnchorOS/commit/2f819cde025ba99ea5b6ecb46a906555c3619819))

## [1.17.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.1...v1.17.0-rc.0) (2026-04-10)


### Features

* **auth:** complete auth sprint — AUTH-003 AUTH-006 AUTH-008 SEC-006 ARCH-025 ([557e8fd](https://github.com/Adedamola-Aina/AnchorOS/commit/557e8fd2d57d49eeddf51f9d02cb146d44607c2d))
* **auth:** sprint 7 auth and security — AUTH-003 AUTH-006 AUTH-008 SEC-006 ([a12aabc](https://github.com/Adedamola-Aina/AnchorOS/commit/a12aabc09068dd1a663ef4a198bab735408c9d23))
* **commitments:** sprint 6 commitments domain — COMM-007 COMM-001 COMM-002 FIN-014 ([7a9e5c3](https://github.com/Adedamola-Aina/AnchorOS/commit/7a9e5c32a6a57d879250567c79d9ada329cde407))
* **fabric:** sprint 8 — insight reasoning, anomaly alerts, savings suggestions, goal projection ([8287957](https://github.com/Adedamola-Aina/AnchorOS/commit/8287957bcd2a03dde9e2b72cde587e33f71588e3))
* **fabric:** sprint 9 — scenario modelling, conversation context, experiments, monthly review ([c8fc152](https://github.com/Adedamola-Aina/AnchorOS/commit/c8fc152064839084fb551f7ed248fdc936ebcd6f))
* **finance:** sprint 5 product features — PRD-007 UX-036 COMM-006 PRD-010 ([ad74935](https://github.com/Adedamola-Aina/AnchorOS/commit/ad7493568e93069d2ecd99d3373dd8b78bf66e21))
* **functions:** sprint 3 schema and migration foundation — ENG-003 DB-001 ARCH-025 BUG-025 ([20de8a6](https://github.com/Adedamola-Aina/AnchorOS/commit/20de8a65e83781347ab417bbdc2f89dac1af23e7))
* **functions:** sprint 4 observability and measurement — ENG-007 SRE-004 SRE-005 DATA-003 ([7128292](https://github.com/Adedamola-Aina/AnchorOS/commit/71282921f30cea57811975e0e0286e6feb4c6e44))
* **quality:** sprint 1 quality gate foundation — GAP-006 ARCH-024 DB-004 ARCH-027 ([9d0cafd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d0cafdb1bd322cbeb9b8a09e55c14739fe8e012))
* **quality:** sprint 2 code health and performance — GAP-010 GAP-008 PERF-006 PSE-003 ([b0e194d](https://github.com/Adedamola-Aina/AnchorOS/commit/b0e194d10d0b91aefcf41bc72cd22424d05d3c79))


### Bug Fixes

* **fabric:** expand intent detection for natural transaction phrases ([2f819cd](https://github.com/Adedamola-Aina/AnchorOS/commit/2f819cde025ba99ea5b6ecb46a906555c3619819))

## [1.17.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.1...v1.17.0-dev.0) (2026-04-10)


### Features

* **auth:** complete auth sprint — AUTH-003 AUTH-006 AUTH-008 SEC-006 ARCH-025 ([557e8fd](https://github.com/Adedamola-Aina/AnchorOS/commit/557e8fd2d57d49eeddf51f9d02cb146d44607c2d))
* **auth:** sprint 7 auth and security — AUTH-003 AUTH-006 AUTH-008 SEC-006 ([a12aabc](https://github.com/Adedamola-Aina/AnchorOS/commit/a12aabc09068dd1a663ef4a198bab735408c9d23))
* **commitments:** sprint 6 commitments domain — COMM-007 COMM-001 COMM-002 FIN-014 ([7a9e5c3](https://github.com/Adedamola-Aina/AnchorOS/commit/7a9e5c32a6a57d879250567c79d9ada329cde407))
* **fabric:** sprint 8 — insight reasoning, anomaly alerts, savings suggestions, goal projection ([8287957](https://github.com/Adedamola-Aina/AnchorOS/commit/8287957bcd2a03dde9e2b72cde587e33f71588e3))
* **fabric:** sprint 9 — scenario modelling, conversation context, experiments, monthly review ([c8fc152](https://github.com/Adedamola-Aina/AnchorOS/commit/c8fc152064839084fb551f7ed248fdc936ebcd6f))
* **finance:** sprint 5 product features — PRD-007 UX-036 COMM-006 PRD-010 ([ad74935](https://github.com/Adedamola-Aina/AnchorOS/commit/ad7493568e93069d2ecd99d3373dd8b78bf66e21))
* **functions:** sprint 3 schema and migration foundation — ENG-003 DB-001 ARCH-025 BUG-025 ([20de8a6](https://github.com/Adedamola-Aina/AnchorOS/commit/20de8a65e83781347ab417bbdc2f89dac1af23e7))
* **functions:** sprint 4 observability and measurement — ENG-007 SRE-004 SRE-005 DATA-003 ([7128292](https://github.com/Adedamola-Aina/AnchorOS/commit/71282921f30cea57811975e0e0286e6feb4c6e44))
* **quality:** sprint 1 quality gate foundation — GAP-006 ARCH-024 DB-004 ARCH-027 ([9d0cafd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d0cafdb1bd322cbeb9b8a09e55c14739fe8e012))
* **quality:** sprint 2 code health and performance — GAP-010 GAP-008 PERF-006 PSE-003 ([b0e194d](https://github.com/Adedamola-Aina/AnchorOS/commit/b0e194d10d0b91aefcf41bc72cd22424d05d3c79))


### Bug Fixes

* **fabric:** expand intent detection for natural transaction phrases ([2f819cd](https://github.com/Adedamola-Aina/AnchorOS/commit/2f819cde025ba99ea5b6ecb46a906555c3619819))

## [1.17.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.1...v1.17.0-rc.1) (2026-04-10)


### Features

* **auth:** complete auth sprint — AUTH-003 AUTH-006 AUTH-008 SEC-006 ARCH-025 ([557e8fd](https://github.com/Adedamola-Aina/AnchorOS/commit/557e8fd2d57d49eeddf51f9d02cb146d44607c2d))
* **auth:** sprint 7 auth and security — AUTH-003 AUTH-006 AUTH-008 SEC-006 ([a12aabc](https://github.com/Adedamola-Aina/AnchorOS/commit/a12aabc09068dd1a663ef4a198bab735408c9d23))
* **commitments:** sprint 6 commitments domain — COMM-007 COMM-001 COMM-002 FIN-014 ([7a9e5c3](https://github.com/Adedamola-Aina/AnchorOS/commit/7a9e5c32a6a57d879250567c79d9ada329cde407))
* **fabric:** sprint 8 — insight reasoning, anomaly alerts, savings suggestions, goal projection ([8287957](https://github.com/Adedamola-Aina/AnchorOS/commit/8287957bcd2a03dde9e2b72cde587e33f71588e3))
* **fabric:** sprint 9 — scenario modelling, conversation context, experiments, monthly review ([c8fc152](https://github.com/Adedamola-Aina/AnchorOS/commit/c8fc152064839084fb551f7ed248fdc936ebcd6f))
* **finance:** sprint 5 product features — PRD-007 UX-036 COMM-006 PRD-010 ([ad74935](https://github.com/Adedamola-Aina/AnchorOS/commit/ad7493568e93069d2ecd99d3373dd8b78bf66e21))
* **functions:** sprint 3 schema and migration foundation — ENG-003 DB-001 ARCH-025 BUG-025 ([20de8a6](https://github.com/Adedamola-Aina/AnchorOS/commit/20de8a65e83781347ab417bbdc2f89dac1af23e7))
* **functions:** sprint 4 observability and measurement — ENG-007 SRE-004 SRE-005 DATA-003 ([7128292](https://github.com/Adedamola-Aina/AnchorOS/commit/71282921f30cea57811975e0e0286e6feb4c6e44))
* **quality:** sprint 1 quality gate foundation — GAP-006 ARCH-024 DB-004 ARCH-027 ([9d0cafd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d0cafdb1bd322cbeb9b8a09e55c14739fe8e012))
* **quality:** sprint 2 code health and performance — GAP-010 GAP-008 PERF-006 PSE-003 ([b0e194d](https://github.com/Adedamola-Aina/AnchorOS/commit/b0e194d10d0b91aefcf41bc72cd22424d05d3c79))


### Bug Fixes

* **fabric:** expand intent detection for natural transaction phrases ([2f819cd](https://github.com/Adedamola-Aina/AnchorOS/commit/2f819cde025ba99ea5b6ecb46a906555c3619819))

## [1.17.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.1...v1.17.0-rc.0) (2026-04-10)


### Features

* **auth:** complete auth sprint — AUTH-003 AUTH-006 AUTH-008 SEC-006 ARCH-025 ([557e8fd](https://github.com/Adedamola-Aina/AnchorOS/commit/557e8fd2d57d49eeddf51f9d02cb146d44607c2d))
* **auth:** sprint 7 auth and security — AUTH-003 AUTH-006 AUTH-008 SEC-006 ([a12aabc](https://github.com/Adedamola-Aina/AnchorOS/commit/a12aabc09068dd1a663ef4a198bab735408c9d23))
* **commitments:** sprint 6 commitments domain — COMM-007 COMM-001 COMM-002 FIN-014 ([7a9e5c3](https://github.com/Adedamola-Aina/AnchorOS/commit/7a9e5c32a6a57d879250567c79d9ada329cde407))
* **fabric:** sprint 8 — insight reasoning, anomaly alerts, savings suggestions, goal projection ([8287957](https://github.com/Adedamola-Aina/AnchorOS/commit/8287957bcd2a03dde9e2b72cde587e33f71588e3))
* **fabric:** sprint 9 — scenario modelling, conversation context, experiments, monthly review ([c8fc152](https://github.com/Adedamola-Aina/AnchorOS/commit/c8fc152064839084fb551f7ed248fdc936ebcd6f))
* **finance:** sprint 5 product features — PRD-007 UX-036 COMM-006 PRD-010 ([ad74935](https://github.com/Adedamola-Aina/AnchorOS/commit/ad7493568e93069d2ecd99d3373dd8b78bf66e21))
* **functions:** sprint 3 schema and migration foundation — ENG-003 DB-001 ARCH-025 BUG-025 ([20de8a6](https://github.com/Adedamola-Aina/AnchorOS/commit/20de8a65e83781347ab417bbdc2f89dac1af23e7))
* **functions:** sprint 4 observability and measurement — ENG-007 SRE-004 SRE-005 DATA-003 ([7128292](https://github.com/Adedamola-Aina/AnchorOS/commit/71282921f30cea57811975e0e0286e6feb4c6e44))
* **quality:** sprint 1 quality gate foundation — GAP-006 ARCH-024 DB-004 ARCH-027 ([9d0cafd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d0cafdb1bd322cbeb9b8a09e55c14739fe8e012))
* **quality:** sprint 2 code health and performance — GAP-010 GAP-008 PERF-006 PSE-003 ([b0e194d](https://github.com/Adedamola-Aina/AnchorOS/commit/b0e194d10d0b91aefcf41bc72cd22424d05d3c79))


### Bug Fixes

* **fabric:** expand intent detection for natural transaction phrases ([2f819cd](https://github.com/Adedamola-Aina/AnchorOS/commit/2f819cde025ba99ea5b6ecb46a906555c3619819))

## [1.17.0-dev.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.1...v1.17.0-dev.3) (2026-04-10)


### Features

* **auth:** complete auth sprint — AUTH-003 AUTH-006 AUTH-008 SEC-006 ARCH-025 ([557e8fd](https://github.com/Adedamola-Aina/AnchorOS/commit/557e8fd2d57d49eeddf51f9d02cb146d44607c2d))
* **auth:** sprint 7 auth and security — AUTH-003 AUTH-006 AUTH-008 SEC-006 ([a12aabc](https://github.com/Adedamola-Aina/AnchorOS/commit/a12aabc09068dd1a663ef4a198bab735408c9d23))
* **commitments:** sprint 6 commitments domain — COMM-007 COMM-001 COMM-002 FIN-014 ([7a9e5c3](https://github.com/Adedamola-Aina/AnchorOS/commit/7a9e5c32a6a57d879250567c79d9ada329cde407))
* **fabric:** sprint 8 — insight reasoning, anomaly alerts, savings suggestions, goal projection ([8287957](https://github.com/Adedamola-Aina/AnchorOS/commit/8287957bcd2a03dde9e2b72cde587e33f71588e3))
* **fabric:** sprint 9 — scenario modelling, conversation context, experiments, monthly review ([c8fc152](https://github.com/Adedamola-Aina/AnchorOS/commit/c8fc152064839084fb551f7ed248fdc936ebcd6f))
* **finance:** sprint 5 product features — PRD-007 UX-036 COMM-006 PRD-010 ([ad74935](https://github.com/Adedamola-Aina/AnchorOS/commit/ad7493568e93069d2ecd99d3373dd8b78bf66e21))
* **functions:** sprint 3 schema and migration foundation — ENG-003 DB-001 ARCH-025 BUG-025 ([20de8a6](https://github.com/Adedamola-Aina/AnchorOS/commit/20de8a65e83781347ab417bbdc2f89dac1af23e7))
* **functions:** sprint 4 observability and measurement — ENG-007 SRE-004 SRE-005 DATA-003 ([7128292](https://github.com/Adedamola-Aina/AnchorOS/commit/71282921f30cea57811975e0e0286e6feb4c6e44))
* **quality:** sprint 1 quality gate foundation — GAP-006 ARCH-024 DB-004 ARCH-027 ([9d0cafd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d0cafdb1bd322cbeb9b8a09e55c14739fe8e012))
* **quality:** sprint 2 code health and performance — GAP-010 GAP-008 PERF-006 PSE-003 ([b0e194d](https://github.com/Adedamola-Aina/AnchorOS/commit/b0e194d10d0b91aefcf41bc72cd22424d05d3c79))


### Bug Fixes

* **fabric:** expand intent detection for natural transaction phrases ([2f819cd](https://github.com/Adedamola-Aina/AnchorOS/commit/2f819cde025ba99ea5b6ecb46a906555c3619819))

## [1.17.0-dev.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.1...v1.17.0-dev.2) (2026-04-09)


### Features

* **auth:** complete auth sprint — AUTH-003 AUTH-006 AUTH-008 SEC-006 ARCH-025 ([557e8fd](https://github.com/Adedamola-Aina/AnchorOS/commit/557e8fd2d57d49eeddf51f9d02cb146d44607c2d))
* **auth:** sprint 7 auth and security — AUTH-003 AUTH-006 AUTH-008 SEC-006 ([a12aabc](https://github.com/Adedamola-Aina/AnchorOS/commit/a12aabc09068dd1a663ef4a198bab735408c9d23))
* **commitments:** sprint 6 commitments domain — COMM-007 COMM-001 COMM-002 FIN-014 ([7a9e5c3](https://github.com/Adedamola-Aina/AnchorOS/commit/7a9e5c32a6a57d879250567c79d9ada329cde407))
* **fabric:** sprint 8 — insight reasoning, anomaly alerts, savings suggestions, goal projection ([8287957](https://github.com/Adedamola-Aina/AnchorOS/commit/8287957bcd2a03dde9e2b72cde587e33f71588e3))
* **fabric:** sprint 9 — scenario modelling, conversation context, experiments, monthly review ([c8fc152](https://github.com/Adedamola-Aina/AnchorOS/commit/c8fc152064839084fb551f7ed248fdc936ebcd6f))
* **finance:** sprint 5 product features — PRD-007 UX-036 COMM-006 PRD-010 ([ad74935](https://github.com/Adedamola-Aina/AnchorOS/commit/ad7493568e93069d2ecd99d3373dd8b78bf66e21))
* **functions:** sprint 3 schema and migration foundation — ENG-003 DB-001 ARCH-025 BUG-025 ([20de8a6](https://github.com/Adedamola-Aina/AnchorOS/commit/20de8a65e83781347ab417bbdc2f89dac1af23e7))
* **functions:** sprint 4 observability and measurement — ENG-007 SRE-004 SRE-005 DATA-003 ([7128292](https://github.com/Adedamola-Aina/AnchorOS/commit/71282921f30cea57811975e0e0286e6feb4c6e44))
* **quality:** sprint 1 quality gate foundation — GAP-006 ARCH-024 DB-004 ARCH-027 ([9d0cafd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d0cafdb1bd322cbeb9b8a09e55c14739fe8e012))
* **quality:** sprint 2 code health and performance — GAP-010 GAP-008 PERF-006 PSE-003 ([b0e194d](https://github.com/Adedamola-Aina/AnchorOS/commit/b0e194d10d0b91aefcf41bc72cd22424d05d3c79))


### Bug Fixes

* **fabric:** expand intent detection for natural transaction phrases ([2f819cd](https://github.com/Adedamola-Aina/AnchorOS/commit/2f819cde025ba99ea5b6ecb46a906555c3619819))

## [1.17.0-dev.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.1...v1.17.0-dev.1) (2026-04-09)


### Features

* **auth:** complete auth sprint — AUTH-003 AUTH-006 AUTH-008 SEC-006 ARCH-025 ([557e8fd](https://github.com/Adedamola-Aina/AnchorOS/commit/557e8fd2d57d49eeddf51f9d02cb146d44607c2d))
* **auth:** sprint 7 auth and security — AUTH-003 AUTH-006 AUTH-008 SEC-006 ([a12aabc](https://github.com/Adedamola-Aina/AnchorOS/commit/a12aabc09068dd1a663ef4a198bab735408c9d23))
* **commitments:** sprint 6 commitments domain — COMM-007 COMM-001 COMM-002 FIN-014 ([7a9e5c3](https://github.com/Adedamola-Aina/AnchorOS/commit/7a9e5c32a6a57d879250567c79d9ada329cde407))
* **fabric:** sprint 8 — insight reasoning, anomaly alerts, savings suggestions, goal projection ([8287957](https://github.com/Adedamola-Aina/AnchorOS/commit/8287957bcd2a03dde9e2b72cde587e33f71588e3))
* **fabric:** sprint 9 — scenario modelling, conversation context, experiments, monthly review ([c8fc152](https://github.com/Adedamola-Aina/AnchorOS/commit/c8fc152064839084fb551f7ed248fdc936ebcd6f))
* **finance:** sprint 5 product features — PRD-007 UX-036 COMM-006 PRD-010 ([ad74935](https://github.com/Adedamola-Aina/AnchorOS/commit/ad7493568e93069d2ecd99d3373dd8b78bf66e21))
* **functions:** sprint 3 schema and migration foundation — ENG-003 DB-001 ARCH-025 BUG-025 ([20de8a6](https://github.com/Adedamola-Aina/AnchorOS/commit/20de8a65e83781347ab417bbdc2f89dac1af23e7))
* **functions:** sprint 4 observability and measurement — ENG-007 SRE-004 SRE-005 DATA-003 ([7128292](https://github.com/Adedamola-Aina/AnchorOS/commit/71282921f30cea57811975e0e0286e6feb4c6e44))
* **quality:** sprint 1 quality gate foundation — GAP-006 ARCH-024 DB-004 ARCH-027 ([9d0cafd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d0cafdb1bd322cbeb9b8a09e55c14739fe8e012))
* **quality:** sprint 2 code health and performance — GAP-010 GAP-008 PERF-006 PSE-003 ([b0e194d](https://github.com/Adedamola-Aina/AnchorOS/commit/b0e194d10d0b91aefcf41bc72cd22424d05d3c79))


### Bug Fixes

* **fabric:** expand intent detection for natural transaction phrases ([2f819cd](https://github.com/Adedamola-Aina/AnchorOS/commit/2f819cde025ba99ea5b6ecb46a906555c3619819))

## [1.17.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.1...v1.17.0-dev.0) (2026-04-09)


### Features

* **auth:** complete auth sprint — AUTH-003 AUTH-006 AUTH-008 SEC-006 ARCH-025 ([557e8fd](https://github.com/Adedamola-Aina/AnchorOS/commit/557e8fd2d57d49eeddf51f9d02cb146d44607c2d))
* **auth:** sprint 7 auth and security — AUTH-003 AUTH-006 AUTH-008 SEC-006 ([a12aabc](https://github.com/Adedamola-Aina/AnchorOS/commit/a12aabc09068dd1a663ef4a198bab735408c9d23))
* **commitments:** sprint 6 commitments domain — COMM-007 COMM-001 COMM-002 FIN-014 ([7a9e5c3](https://github.com/Adedamola-Aina/AnchorOS/commit/7a9e5c32a6a57d879250567c79d9ada329cde407))
* **fabric:** sprint 8 — insight reasoning, anomaly alerts, savings suggestions, goal projection ([8287957](https://github.com/Adedamola-Aina/AnchorOS/commit/8287957bcd2a03dde9e2b72cde587e33f71588e3))
* **fabric:** sprint 9 — scenario modelling, conversation context, experiments, monthly review ([c8fc152](https://github.com/Adedamola-Aina/AnchorOS/commit/c8fc152064839084fb551f7ed248fdc936ebcd6f))
* **finance:** sprint 5 product features — PRD-007 UX-036 COMM-006 PRD-010 ([ad74935](https://github.com/Adedamola-Aina/AnchorOS/commit/ad7493568e93069d2ecd99d3373dd8b78bf66e21))
* **functions:** sprint 3 schema and migration foundation — ENG-003 DB-001 ARCH-025 BUG-025 ([20de8a6](https://github.com/Adedamola-Aina/AnchorOS/commit/20de8a65e83781347ab417bbdc2f89dac1af23e7))
* **functions:** sprint 4 observability and measurement — ENG-007 SRE-004 SRE-005 DATA-003 ([7128292](https://github.com/Adedamola-Aina/AnchorOS/commit/71282921f30cea57811975e0e0286e6feb4c6e44))
* **quality:** sprint 1 quality gate foundation — GAP-006 ARCH-024 DB-004 ARCH-027 ([9d0cafd](https://github.com/Adedamola-Aina/AnchorOS/commit/9d0cafdb1bd322cbeb9b8a09e55c14739fe8e012))
* **quality:** sprint 2 code health and performance — GAP-010 GAP-008 PERF-006 PSE-003 ([b0e194d](https://github.com/Adedamola-Aina/AnchorOS/commit/b0e194d10d0b91aefcf41bc72cd22424d05d3c79))


### Bug Fixes

* **fabric:** expand intent detection for natural transaction phrases ([2f819cd](https://github.com/Adedamola-Aina/AnchorOS/commit/2f819cde025ba99ea5b6ecb46a906555c3619819))

## [1.16.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.16.0...v1.16.1) (2026-04-06)

## [1.16.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0) (2026-04-06)


### Features

* **finance:** apple wallet redesign phases 2-5 — pickers, reorder, analytics UX-041 ([b1f1ac2](https://github.com/Adedamola-Aina/AnchorOS/commit/b1f1ac21dec844b8b38063688a3bfdf621e62967))
* **finance:** apple wallet-style stacked account cards on mobile UX-041 ([d4f2efe](https://github.com/Adedamola-Aina/AnchorOS/commit/d4f2efe5e47d2d5542ff0294c9104ef14f807b28))
* **finance:** refine wallet card material ([df1daee](https://github.com/Adedamola-Aina/AnchorOS/commit/df1daeeeba19518a27727e972d592a7fa4fd1a39))
* **finance:** wallet redesign checkpoint ([e8e381c](https://github.com/Adedamola-Aina/AnchorOS/commit/e8e381caec5f67e864e17edbf7544a82d0441c21))
* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **dashboard:** enforce ticket IDs in commits, exclude automated from metric (ARCH-001) ([371dd2a](https://github.com/Adedamola-Aina/AnchorOS/commit/371dd2acdbce2346443c68e374f239c64081a32d))
* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **finance:** apple wallet peek layout — name+balance at top of each card (BUG-130) ([ab1bbd2](https://github.com/Adedamola-Aina/AnchorOS/commit/ab1bbd2014511e815457c5e05f2b6a0ec837ce75))
* **mobile:** e2e test fixes, touch-target compliance, dep updates (BUG-129) ([c042423](https://github.com/Adedamola-Aina/AnchorOS/commit/c042423c754e28bdaf7a304bdad16f66a05cc725))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** remove * margin/padding reset that overrode v4 space-y utilities (BUG-129) ([9debf9c](https://github.com/Adedamola-Aina/AnchorOS/commit/9debf9c03ca9145f07064110f86bcaf1b63dc58d))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)
* **ui:** restore v3 visual parity — [@utility](https://github.com/utility) typography, sRGB palette, glass-border (BUG-129) ([97b2b1e](https://github.com/Adedamola-Aina/AnchorOS/commit/97b2b1e829bdb4786dfbc66cfe03f8a1cdd411f4))

## [1.16.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-rc.0) (2026-04-06)


### Features

* **finance:** apple wallet redesign phases 2-5 — pickers, reorder, analytics UX-041 ([b1f1ac2](https://github.com/Adedamola-Aina/AnchorOS/commit/b1f1ac21dec844b8b38063688a3bfdf621e62967))
* **finance:** apple wallet-style stacked account cards on mobile UX-041 ([d4f2efe](https://github.com/Adedamola-Aina/AnchorOS/commit/d4f2efe5e47d2d5542ff0294c9104ef14f807b28))
* **finance:** refine wallet card material ([df1daee](https://github.com/Adedamola-Aina/AnchorOS/commit/df1daeeeba19518a27727e972d592a7fa4fd1a39))
* **finance:** wallet redesign checkpoint ([e8e381c](https://github.com/Adedamola-Aina/AnchorOS/commit/e8e381caec5f67e864e17edbf7544a82d0441c21))
* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **dashboard:** enforce ticket IDs in commits, exclude automated from metric (ARCH-001) ([371dd2a](https://github.com/Adedamola-Aina/AnchorOS/commit/371dd2acdbce2346443c68e374f239c64081a32d))
* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **finance:** apple wallet peek layout — name+balance at top of each card (BUG-130) ([ab1bbd2](https://github.com/Adedamola-Aina/AnchorOS/commit/ab1bbd2014511e815457c5e05f2b6a0ec837ce75))
* **mobile:** e2e test fixes, touch-target compliance, dep updates (BUG-129) ([c042423](https://github.com/Adedamola-Aina/AnchorOS/commit/c042423c754e28bdaf7a304bdad16f66a05cc725))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** remove * margin/padding reset that overrode v4 space-y utilities (BUG-129) ([9debf9c](https://github.com/Adedamola-Aina/AnchorOS/commit/9debf9c03ca9145f07064110f86bcaf1b63dc58d))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)
* **ui:** restore v3 visual parity — [@utility](https://github.com/utility) typography, sRGB palette, glass-border (BUG-129) ([97b2b1e](https://github.com/Adedamola-Aina/AnchorOS/commit/97b2b1e829bdb4786dfbc66cfe03f8a1cdd411f4))

## [1.16.0-dev.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-dev.2) (2026-04-06)


### Features

* **finance:** apple wallet redesign phases 2-5 — pickers, reorder, analytics UX-041 ([b1f1ac2](https://github.com/Adedamola-Aina/AnchorOS/commit/b1f1ac21dec844b8b38063688a3bfdf621e62967))
* **finance:** apple wallet-style stacked account cards on mobile UX-041 ([d4f2efe](https://github.com/Adedamola-Aina/AnchorOS/commit/d4f2efe5e47d2d5542ff0294c9104ef14f807b28))
* **finance:** refine wallet card material ([df1daee](https://github.com/Adedamola-Aina/AnchorOS/commit/df1daeeeba19518a27727e972d592a7fa4fd1a39))
* **finance:** wallet redesign checkpoint ([e8e381c](https://github.com/Adedamola-Aina/AnchorOS/commit/e8e381caec5f67e864e17edbf7544a82d0441c21))
* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **dashboard:** enforce ticket IDs in commits, exclude automated from metric (ARCH-001) ([371dd2a](https://github.com/Adedamola-Aina/AnchorOS/commit/371dd2acdbce2346443c68e374f239c64081a32d))
* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **finance:** apple wallet peek layout — name+balance at top of each card (BUG-130) ([ab1bbd2](https://github.com/Adedamola-Aina/AnchorOS/commit/ab1bbd2014511e815457c5e05f2b6a0ec837ce75))
* **mobile:** e2e test fixes, touch-target compliance, dep updates (BUG-129) ([c042423](https://github.com/Adedamola-Aina/AnchorOS/commit/c042423c754e28bdaf7a304bdad16f66a05cc725))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** remove * margin/padding reset that overrode v4 space-y utilities (BUG-129) ([9debf9c](https://github.com/Adedamola-Aina/AnchorOS/commit/9debf9c03ca9145f07064110f86bcaf1b63dc58d))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)
* **ui:** restore v3 visual parity — [@utility](https://github.com/utility) typography, sRGB palette, glass-border (BUG-129) ([97b2b1e](https://github.com/Adedamola-Aina/AnchorOS/commit/97b2b1e829bdb4786dfbc66cfe03f8a1cdd411f4))

## [1.16.0-dev.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-dev.1) (2026-04-06)


### Features

* **finance:** apple wallet redesign phases 2-5 — pickers, reorder, analytics UX-041 ([b1f1ac2](https://github.com/Adedamola-Aina/AnchorOS/commit/b1f1ac21dec844b8b38063688a3bfdf621e62967))
* **finance:** apple wallet-style stacked account cards on mobile UX-041 ([d4f2efe](https://github.com/Adedamola-Aina/AnchorOS/commit/d4f2efe5e47d2d5542ff0294c9104ef14f807b28))
* **finance:** refine wallet card material ([df1daee](https://github.com/Adedamola-Aina/AnchorOS/commit/df1daeeeba19518a27727e972d592a7fa4fd1a39))
* **finance:** wallet redesign checkpoint ([e8e381c](https://github.com/Adedamola-Aina/AnchorOS/commit/e8e381caec5f67e864e17edbf7544a82d0441c21))
* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **dashboard:** enforce ticket IDs in commits, exclude automated from metric (ARCH-001) ([371dd2a](https://github.com/Adedamola-Aina/AnchorOS/commit/371dd2acdbce2346443c68e374f239c64081a32d))
* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **finance:** apple wallet peek layout — name+balance at top of each card (BUG-130) ([ab1bbd2](https://github.com/Adedamola-Aina/AnchorOS/commit/ab1bbd2014511e815457c5e05f2b6a0ec837ce75))
* **mobile:** e2e test fixes, touch-target compliance, dep updates (BUG-129) ([c042423](https://github.com/Adedamola-Aina/AnchorOS/commit/c042423c754e28bdaf7a304bdad16f66a05cc725))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** remove * margin/padding reset that overrode v4 space-y utilities (BUG-129) ([9debf9c](https://github.com/Adedamola-Aina/AnchorOS/commit/9debf9c03ca9145f07064110f86bcaf1b63dc58d))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)
* **ui:** restore v3 visual parity — [@utility](https://github.com/utility) typography, sRGB palette, glass-border (BUG-129) ([97b2b1e](https://github.com/Adedamola-Aina/AnchorOS/commit/97b2b1e829bdb4786dfbc66cfe03f8a1cdd411f4))

## [1.16.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-dev.0) (2026-04-06)


### Features

* **finance:** apple wallet redesign phases 2-5 — pickers, reorder, analytics UX-041 ([b1f1ac2](https://github.com/Adedamola-Aina/AnchorOS/commit/b1f1ac21dec844b8b38063688a3bfdf621e62967))
* **finance:** apple wallet-style stacked account cards on mobile UX-041 ([d4f2efe](https://github.com/Adedamola-Aina/AnchorOS/commit/d4f2efe5e47d2d5542ff0294c9104ef14f807b28))
* **finance:** refine wallet card material ([df1daee](https://github.com/Adedamola-Aina/AnchorOS/commit/df1daeeeba19518a27727e972d592a7fa4fd1a39))
* **finance:** wallet redesign checkpoint ([e8e381c](https://github.com/Adedamola-Aina/AnchorOS/commit/e8e381caec5f67e864e17edbf7544a82d0441c21))
* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **dashboard:** enforce ticket IDs in commits, exclude automated from metric (ARCH-001) ([371dd2a](https://github.com/Adedamola-Aina/AnchorOS/commit/371dd2acdbce2346443c68e374f239c64081a32d))
* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **finance:** apple wallet peek layout — name+balance at top of each card (BUG-130) ([ab1bbd2](https://github.com/Adedamola-Aina/AnchorOS/commit/ab1bbd2014511e815457c5e05f2b6a0ec837ce75))
* **mobile:** e2e test fixes, touch-target compliance, dep updates (BUG-129) ([c042423](https://github.com/Adedamola-Aina/AnchorOS/commit/c042423c754e28bdaf7a304bdad16f66a05cc725))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** remove * margin/padding reset that overrode v4 space-y utilities (BUG-129) ([9debf9c](https://github.com/Adedamola-Aina/AnchorOS/commit/9debf9c03ca9145f07064110f86bcaf1b63dc58d))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)
* **ui:** restore v3 visual parity — [@utility](https://github.com/utility) typography, sRGB palette, glass-border (BUG-129) ([97b2b1e](https://github.com/Adedamola-Aina/AnchorOS/commit/97b2b1e829bdb4786dfbc66cfe03f8a1cdd411f4))

## [1.16.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-rc.0) (2026-04-05)


### Features

* **finance:** apple wallet redesign phases 2-5 — pickers, reorder, analytics UX-041 ([b1f1ac2](https://github.com/Adedamola-Aina/AnchorOS/commit/b1f1ac21dec844b8b38063688a3bfdf621e62967))
* **finance:** apple wallet-style stacked account cards on mobile UX-041 ([d4f2efe](https://github.com/Adedamola-Aina/AnchorOS/commit/d4f2efe5e47d2d5542ff0294c9104ef14f807b28))
* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **dashboard:** enforce ticket IDs in commits, exclude automated from metric (ARCH-001) ([371dd2a](https://github.com/Adedamola-Aina/AnchorOS/commit/371dd2acdbce2346443c68e374f239c64081a32d))
* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **finance:** apple wallet peek layout — name+balance at top of each card (BUG-130) ([ab1bbd2](https://github.com/Adedamola-Aina/AnchorOS/commit/ab1bbd2014511e815457c5e05f2b6a0ec837ce75))
* **mobile:** e2e test fixes, touch-target compliance, dep updates (BUG-129) ([c042423](https://github.com/Adedamola-Aina/AnchorOS/commit/c042423c754e28bdaf7a304bdad16f66a05cc725))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** remove * margin/padding reset that overrode v4 space-y utilities (BUG-129) ([9debf9c](https://github.com/Adedamola-Aina/AnchorOS/commit/9debf9c03ca9145f07064110f86bcaf1b63dc58d))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)
* **ui:** restore v3 visual parity — [@utility](https://github.com/utility) typography, sRGB palette, glass-border (BUG-129) ([97b2b1e](https://github.com/Adedamola-Aina/AnchorOS/commit/97b2b1e829bdb4786dfbc66cfe03f8a1cdd411f4))

## [1.16.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-dev.0) (2026-04-05)


### Features

* **finance:** apple wallet redesign phases 2-5 — pickers, reorder, analytics UX-041 ([b1f1ac2](https://github.com/Adedamola-Aina/AnchorOS/commit/b1f1ac21dec844b8b38063688a3bfdf621e62967))
* **finance:** apple wallet-style stacked account cards on mobile UX-041 ([d4f2efe](https://github.com/Adedamola-Aina/AnchorOS/commit/d4f2efe5e47d2d5542ff0294c9104ef14f807b28))
* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **dashboard:** enforce ticket IDs in commits, exclude automated from metric (ARCH-001) ([371dd2a](https://github.com/Adedamola-Aina/AnchorOS/commit/371dd2acdbce2346443c68e374f239c64081a32d))
* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **finance:** apple wallet peek layout — name+balance at top of each card (BUG-130) ([ab1bbd2](https://github.com/Adedamola-Aina/AnchorOS/commit/ab1bbd2014511e815457c5e05f2b6a0ec837ce75))
* **mobile:** e2e test fixes, touch-target compliance, dep updates (BUG-129) ([c042423](https://github.com/Adedamola-Aina/AnchorOS/commit/c042423c754e28bdaf7a304bdad16f66a05cc725))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** remove * margin/padding reset that overrode v4 space-y utilities (BUG-129) ([9debf9c](https://github.com/Adedamola-Aina/AnchorOS/commit/9debf9c03ca9145f07064110f86bcaf1b63dc58d))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)
* **ui:** restore v3 visual parity — [@utility](https://github.com/utility) typography, sRGB palette, glass-border (BUG-129) ([97b2b1e](https://github.com/Adedamola-Aina/AnchorOS/commit/97b2b1e829bdb4786dfbc66cfe03f8a1cdd411f4))

## [1.16.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-rc.0) (2026-04-05)


### Features

* **finance:** apple wallet redesign phases 2-5 — pickers, reorder, analytics UX-041 ([b1f1ac2](https://github.com/Adedamola-Aina/AnchorOS/commit/b1f1ac21dec844b8b38063688a3bfdf621e62967))
* **finance:** apple wallet-style stacked account cards on mobile UX-041 ([d4f2efe](https://github.com/Adedamola-Aina/AnchorOS/commit/d4f2efe5e47d2d5542ff0294c9104ef14f807b28))
* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **dashboard:** enforce ticket IDs in commits, exclude automated from metric (ARCH-001) ([371dd2a](https://github.com/Adedamola-Aina/AnchorOS/commit/371dd2acdbce2346443c68e374f239c64081a32d))
* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** e2e test fixes, touch-target compliance, dep updates (BUG-129) ([c042423](https://github.com/Adedamola-Aina/AnchorOS/commit/c042423c754e28bdaf7a304bdad16f66a05cc725))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** remove * margin/padding reset that overrode v4 space-y utilities (BUG-129) ([9debf9c](https://github.com/Adedamola-Aina/AnchorOS/commit/9debf9c03ca9145f07064110f86bcaf1b63dc58d))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)
* **ui:** restore v3 visual parity — [@utility](https://github.com/utility) typography, sRGB palette, glass-border (BUG-129) ([97b2b1e](https://github.com/Adedamola-Aina/AnchorOS/commit/97b2b1e829bdb4786dfbc66cfe03f8a1cdd411f4))

## [1.16.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-dev.0) (2026-04-05)


### Features

* **finance:** apple wallet redesign phases 2-5 — pickers, reorder, analytics UX-041 ([b1f1ac2](https://github.com/Adedamola-Aina/AnchorOS/commit/b1f1ac21dec844b8b38063688a3bfdf621e62967))
* **finance:** apple wallet-style stacked account cards on mobile UX-041 ([d4f2efe](https://github.com/Adedamola-Aina/AnchorOS/commit/d4f2efe5e47d2d5542ff0294c9104ef14f807b28))
* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **dashboard:** enforce ticket IDs in commits, exclude automated from metric (ARCH-001) ([371dd2a](https://github.com/Adedamola-Aina/AnchorOS/commit/371dd2acdbce2346443c68e374f239c64081a32d))
* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** e2e test fixes, touch-target compliance, dep updates (BUG-129) ([c042423](https://github.com/Adedamola-Aina/AnchorOS/commit/c042423c754e28bdaf7a304bdad16f66a05cc725))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** remove * margin/padding reset that overrode v4 space-y utilities (BUG-129) ([9debf9c](https://github.com/Adedamola-Aina/AnchorOS/commit/9debf9c03ca9145f07064110f86bcaf1b63dc58d))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)
* **ui:** restore v3 visual parity — [@utility](https://github.com/utility) typography, sRGB palette, glass-border (BUG-129) ([97b2b1e](https://github.com/Adedamola-Aina/AnchorOS/commit/97b2b1e829bdb4786dfbc66cfe03f8a1cdd411f4))

## [1.16.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-rc.0) (2026-04-04)


### Features

* **finance:** apple wallet-style stacked account cards on mobile UX-041 ([d4f2efe](https://github.com/Adedamola-Aina/AnchorOS/commit/d4f2efe5e47d2d5542ff0294c9104ef14f807b28))
* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **dashboard:** enforce ticket IDs in commits, exclude automated from metric (ARCH-001) ([371dd2a](https://github.com/Adedamola-Aina/AnchorOS/commit/371dd2acdbce2346443c68e374f239c64081a32d))
* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** e2e test fixes, touch-target compliance, dep updates (BUG-129) ([c042423](https://github.com/Adedamola-Aina/AnchorOS/commit/c042423c754e28bdaf7a304bdad16f66a05cc725))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** remove * margin/padding reset that overrode v4 space-y utilities (BUG-129) ([9debf9c](https://github.com/Adedamola-Aina/AnchorOS/commit/9debf9c03ca9145f07064110f86bcaf1b63dc58d))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)
* **ui:** restore v3 visual parity — [@utility](https://github.com/utility) typography, sRGB palette, glass-border (BUG-129) ([97b2b1e](https://github.com/Adedamola-Aina/AnchorOS/commit/97b2b1e829bdb4786dfbc66cfe03f8a1cdd411f4))

## [1.16.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-dev.0) (2026-04-04)


### Features

* **finance:** apple wallet-style stacked account cards on mobile UX-041 ([d4f2efe](https://github.com/Adedamola-Aina/AnchorOS/commit/d4f2efe5e47d2d5542ff0294c9104ef14f807b28))
* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **dashboard:** enforce ticket IDs in commits, exclude automated from metric (ARCH-001) ([371dd2a](https://github.com/Adedamola-Aina/AnchorOS/commit/371dd2acdbce2346443c68e374f239c64081a32d))
* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** e2e test fixes, touch-target compliance, dep updates (BUG-129) ([c042423](https://github.com/Adedamola-Aina/AnchorOS/commit/c042423c754e28bdaf7a304bdad16f66a05cc725))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** remove * margin/padding reset that overrode v4 space-y utilities (BUG-129) ([9debf9c](https://github.com/Adedamola-Aina/AnchorOS/commit/9debf9c03ca9145f07064110f86bcaf1b63dc58d))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)
* **ui:** restore v3 visual parity — [@utility](https://github.com/utility) typography, sRGB palette, glass-border (BUG-129) ([97b2b1e](https://github.com/Adedamola-Aina/AnchorOS/commit/97b2b1e829bdb4786dfbc66cfe03f8a1cdd411f4))

## [1.16.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-rc.0) (2026-04-04)


### Features

* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** e2e test fixes, touch-target compliance, dep updates (BUG-129) ([c042423](https://github.com/Adedamola-Aina/AnchorOS/commit/c042423c754e28bdaf7a304bdad16f66a05cc725))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** remove * margin/padding reset that overrode v4 space-y utilities (BUG-129) ([9debf9c](https://github.com/Adedamola-Aina/AnchorOS/commit/9debf9c03ca9145f07064110f86bcaf1b63dc58d))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)
* **ui:** restore v3 visual parity — [@utility](https://github.com/utility) typography, sRGB palette, glass-border (BUG-129) ([97b2b1e](https://github.com/Adedamola-Aina/AnchorOS/commit/97b2b1e829bdb4786dfbc66cfe03f8a1cdd411f4))

## [1.16.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-dev.0) (2026-04-04)


### Features

* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** e2e test fixes, touch-target compliance, dep updates (BUG-129) ([c042423](https://github.com/Adedamola-Aina/AnchorOS/commit/c042423c754e28bdaf7a304bdad16f66a05cc725))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** remove * margin/padding reset that overrode v4 space-y utilities (BUG-129) ([9debf9c](https://github.com/Adedamola-Aina/AnchorOS/commit/9debf9c03ca9145f07064110f86bcaf1b63dc58d))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)
* **ui:** restore v3 visual parity — [@utility](https://github.com/utility) typography, sRGB palette, glass-border (BUG-129) ([97b2b1e](https://github.com/Adedamola-Aina/AnchorOS/commit/97b2b1e829bdb4786dfbc66cfe03f8a1cdd411f4))

## [1.16.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-rc.0) (2026-04-04)


### Features

* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** remove * margin/padding reset that overrode v4 space-y utilities (BUG-129) ([9debf9c](https://github.com/Adedamola-Aina/AnchorOS/commit/9debf9c03ca9145f07064110f86bcaf1b63dc58d))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)
* **ui:** restore v3 visual parity — [@utility](https://github.com/utility) typography, sRGB palette, glass-border (BUG-129) ([97b2b1e](https://github.com/Adedamola-Aina/AnchorOS/commit/97b2b1e829bdb4786dfbc66cfe03f8a1cdd411f4))

## [1.16.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-dev.0) (2026-04-04)


### Features

* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** remove * margin/padding reset that overrode v4 space-y utilities (BUG-129) ([9debf9c](https://github.com/Adedamola-Aina/AnchorOS/commit/9debf9c03ca9145f07064110f86bcaf1b63dc58d))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)
* **ui:** restore v3 visual parity — [@utility](https://github.com/utility) typography, sRGB palette, glass-border (BUG-129) ([97b2b1e](https://github.com/Adedamola-Aina/AnchorOS/commit/97b2b1e829bdb4786dfbc66cfe03f8a1cdd411f4))

## [1.16.0-rc.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-rc.3) (2026-04-03)


### Features

* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)
* **ui:** restore v3 visual parity — [@utility](https://github.com/utility) typography, sRGB palette, glass-border (BUG-129) ([97b2b1e](https://github.com/Adedamola-Aina/AnchorOS/commit/97b2b1e829bdb4786dfbc66cfe03f8a1cdd411f4))

## [1.16.0-rc.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-rc.2) (2026-04-03)


### Features

* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)
* **ui:** restore v3 visual parity — [@utility](https://github.com/utility) typography, sRGB palette, glass-border (BUG-129) ([97b2b1e](https://github.com/Adedamola-Aina/AnchorOS/commit/97b2b1e829bdb4786dfbc66cfe03f8a1cdd411f4))

## [1.16.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-rc.1) (2026-04-03)


### Features

* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)
* **ui:** restore v3 visual parity — [@utility](https://github.com/utility) typography, sRGB palette, glass-border (BUG-129) ([97b2b1e](https://github.com/Adedamola-Aina/AnchorOS/commit/97b2b1e829bdb4786dfbc66cfe03f8a1cdd411f4))

## [1.16.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-rc.0) (2026-04-03)


### Features

* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)
* **ui:** restore v3 visual parity — [@utility](https://github.com/utility) typography, sRGB palette, glass-border (BUG-129) ([97b2b1e](https://github.com/Adedamola-Aina/AnchorOS/commit/97b2b1e829bdb4786dfbc66cfe03f8a1cdd411f4))

## [1.16.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-dev.0) (2026-04-03)


### Features

* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)
* **ui:** restore v3 visual parity — [@utility](https://github.com/utility) typography, sRGB palette, glass-border (BUG-129) ([97b2b1e](https://github.com/Adedamola-Aina/AnchorOS/commit/97b2b1e829bdb4786dfbc66cfe03f8a1cdd411f4))

## [1.16.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-rc.1) (2026-04-02)


### Features

* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)

## [1.16.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-rc.0) (2026-04-02)


### Features

* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)

## [1.16.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-dev.0) (2026-04-02)


### Features

* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)

## [1.16.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-rc.0) (2026-04-02)


### Features

* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)

## [1.16.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-dev.0) (2026-04-02)


### Features

* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))
* **ui:** restore v3 form/ring/placeholder defaults stripped by v4 preflight (BUG-129) ([74583b5](https://github.com/Adedamola-Aina/AnchorOS/commit/74583b5bf52cd99143ba91666818aa5e63df0e6d)), closes [#9ca3](https://github.com/Adedamola-Aina/AnchorOS/issues/9ca3)

## [1.16.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-rc.0) (2026-04-02)


### Features

* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))

## [1.16.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.16.0-dev.0) (2026-04-02)


### Features

* **ui:** native tailwind v4 CSS-first rewrite (UX-040) ([723e2eb](https://github.com/Adedamola-Aina/AnchorOS/commit/723e2eb7d7992c2c971fe867b1ca6aa6e10c29c2))


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))

## [1.15.8-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.15.8-rc.0) (2026-04-02)


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))

## [1.15.8-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.15.8-dev.0) (2026-04-02)


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** apply tailwindcss/upgrade v4 syntax migration to index.css ([c30ca56](https://github.com/Adedamola-Aina/AnchorOS/commit/c30ca5642995d815584f1a7eb8d44a9289891f61))
* **ui:** correct border-color default to gray-200, matching v3 preflight exactly ([d6017f5](https://github.com/Adedamola-Aina/AnchorOS/commit/d6017f5752faa9574d48ad14072a9f8ca4b70206)), closes [#e2e8f0](https://github.com/Adedamola-Aina/AnchorOS/issues/e2e8f0) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7) [#e5e7](https://github.com/Adedamola-Aina/AnchorOS/issues/e5e7)
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))

## [1.15.8-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.15.8-rc.0) (2026-04-02)


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))

## [1.15.8-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.15.8-dev.0) (2026-04-02)


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))
* **ui:** restore tailwind v4 visual parity — border-color and glass-card ([3df793c](https://github.com/Adedamola-Aina/AnchorOS/commit/3df793cd319d796d4b9d1adc70ae6d8703334074))

## [1.15.8-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.15.8-rc.0) (2026-04-02)


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))

## [1.15.8-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.15.8-dev.0) (2026-04-02)


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))
* **ui:** glass-card background dropped by tailwind v4 [@apply](https://github.com/apply) dedup (BUG-127) ([7672c32](https://github.com/Adedamola-Aina/AnchorOS/commit/7672c32a85035b0340811c96568f0b9ba99c0cdf))

## [1.15.8-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.15.8-rc.0) (2026-04-02)


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))

## [1.15.8-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.7...v1.15.8-dev.0) (2026-04-02)


### Bug Fixes

* **deps:** restore @testing-library/dom removed by legacy-peer-deps install (SEC-010) ([5f7f23f](https://github.com/Adedamola-Aina/AnchorOS/commit/5f7f23f823a39409d814bea8ca8bb65ae415f36c))
* **mobile:** native ios tab bar height — h-16 → h-[49px], drop min-h-[56px] (UX-039) ([b369ee9](https://github.com/Adedamola-Aina/AnchorOS/commit/b369ee97ce139bfebb416958ec794d382f2afbd5))
* **security:** resolve high-severity devdependency vulnerabilities via overrides (SEC-010) ([3576c57](https://github.com/Adedamola-Aina/AnchorOS/commit/3576c5759721c5da091cf9e94b63c6e0454da9a0))

## [1.15.7](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.6...v1.15.7) (2026-04-01)


### Bug Fixes

* **auth:** dismissAuthEvent missing from rate limit table ([af502b0](https://github.com/Adedamola-Aina/AnchorOS/commit/af502b03c1653216bea47a7944703e98adf0d9b7))

## [1.15.7-rc.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.6...v1.15.7-rc.3) (2026-04-01)


### Bug Fixes

* **auth:** dismissAuthEvent missing from rate limit table ([af502b0](https://github.com/Adedamola-Aina/AnchorOS/commit/af502b03c1653216bea47a7944703e98adf0d9b7))

## [1.15.7-rc.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.6...v1.15.7-rc.2) (2026-04-01)


### Bug Fixes

* **auth:** dismissAuthEvent missing from rate limit table ([af502b0](https://github.com/Adedamola-Aina/AnchorOS/commit/af502b03c1653216bea47a7944703e98adf0d9b7))

## [1.15.7-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.6...v1.15.7-rc.1) (2026-04-01)


### Bug Fixes

* **auth:** dismissAuthEvent missing from rate limit table ([af502b0](https://github.com/Adedamola-Aina/AnchorOS/commit/af502b03c1653216bea47a7944703e98adf0d9b7))

## [1.15.7-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.6...v1.15.7-rc.0) (2026-03-31)


### Bug Fixes

* **auth:** dismissAuthEvent missing from rate limit table ([af502b0](https://github.com/Adedamola-Aina/AnchorOS/commit/af502b03c1653216bea47a7944703e98adf0d9b7))

## [1.15.7-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.6...v1.15.7-dev.0) (2026-03-31)


### Bug Fixes

* **auth:** dismissAuthEvent missing from rate limit table ([af502b0](https://github.com/Adedamola-Aina/AnchorOS/commit/af502b03c1653216bea47a7944703e98adf0d9b7))

## [1.15.7-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.6...v1.15.7-rc.0) (2026-03-31)

## [1.15.6](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.5...v1.15.6) (2026-03-31)

## [1.15.5](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.4...v1.15.5) (2026-03-31)


### Bug Fixes

* **appcheck:** allow App Check debug token in staging; fix test suite hang ([01ec80a](https://github.com/Adedamola-Aina/AnchorOS/commit/01ec80ab3a6c8604cc7ee597b72a155bab16f6a9))

## [1.15.5-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.4...v1.15.5-rc.0) (2026-03-31)


### Bug Fixes

* **appcheck:** allow App Check debug token in staging; fix test suite hang ([01ec80a](https://github.com/Adedamola-Aina/AnchorOS/commit/01ec80ab3a6c8604cc7ee597b72a155bab16f6a9))

## [1.15.4](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.3...v1.15.4) (2026-03-31)

## [1.15.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.2...v1.15.3) (2026-03-31)

## [1.15.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.1...v1.15.2) (2026-03-31)


### Bug Fixes

* **config:** exclude .stryker-tmp from vitest test discovery ([2ed8eb7](https://github.com/Adedamola-Aina/AnchorOS/commit/2ed8eb73e01d74c2a2425581160b840eec13edde))

## [1.15.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.0...v1.15.1) (2026-03-31)


### Bug Fixes

* **settings:** persistent auth event dismissal via dismissAuthEvent CF (BUG-125) ([25edcf1](https://github.com/Adedamola-Aina/AnchorOS/commit/25edcf1f34c806b09bc2a8c5402e22c743627c2f))

## [1.15.1-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.0...v1.15.1-rc.0) (2026-03-31)


### Bug Fixes

* **settings:** persistent auth event dismissal via dismissAuthEvent CF (BUG-125) ([25edcf1](https://github.com/Adedamola-Aina/AnchorOS/commit/25edcf1f34c806b09bc2a8c5402e22c743627c2f))

## [1.15.1-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.15.0...v1.15.1-dev.0) (2026-03-31)


### Bug Fixes

* **settings:** persistent auth event dismissal via dismissAuthEvent CF (BUG-125) ([25edcf1](https://github.com/Adedamola-Aina/AnchorOS/commit/25edcf1f34c806b09bc2a8c5402e22c743627c2f))

## [1.15.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0) (2026-03-31)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** complete passkey registration with server-side attestation verification ([eacb16f](https://github.com/Adedamola-Aina/AnchorOS/commit/eacb16f4f23ad872cfb7a6dfd76f45deb82974b2))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **dashboard:** add code health and delivery intelligence endpoints ([0e62b06](https://github.com/Adedamola-Aina/AnchorOS/commit/0e62b061b5cedd5ed6d2104f47113cf8e80ceba1))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** add popupRedirectResolver for Google/Apple sign-in + passkey delete ([9cc6a5e](https://github.com/Adedamola-Aina/AnchorOS/commit/9cc6a5eea9f2bfc3572503a621efd0d5d46180f5))
* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** bump SW register version to bust stale cache (v1.15.0-rc.10) ([31a8013](https://github.com/Adedamola-Aina/AnchorOS/commit/31a8013a50b2cb6a662b10ebba984a2b65869a39))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **auth:** use shared functions instance + fix SW cache version + env file naming ([e034e10](https://github.com/Adedamola-Aina/AnchorOS/commit/e034e10f95f2f46453d730feebfba323047863ed))
* **build:** remove unused securedb imports causing ts build failure ([b0d66d4](https://github.com/Adedamola-Aina/AnchorOS/commit/b0d66d4fb4d016821c1240178c3bbe4d356ba32d))
* **csp:** add apis.google.com to connect-src for Google OAuth service worker fetch (BUG-123) ([346032b](https://github.com/Adedamola-Aina/AnchorOS/commit/346032b5c323c476343cc31d69dfb5830955d7fc))
* **dashboard:** harden securedb scanner to avoid false negatives ([236d460](https://github.com/Adedamola-Aina/AnchorOS/commit/236d4601734129bc9e1de206faf22683aa9a62f7))
* **dashboard:** normalize trust scorer inputs and update baseline test ([1b95c23](https://github.com/Adedamola-Aina/AnchorOS/commit/1b95c2375e36003756138099d122d05e8b4d430b))
* **dashboard:** null-guard coverage input in trustScorer + fix tests ([d4a59ae](https://github.com/Adedamola-Aina/AnchorOS/commit/d4a59aedddb370734377979154ff658ae17b919c))
* **fabric:** make persistence resilient to secureDb module mocks ([d3a3662](https://github.com/Adedamola-Aina/AnchorOS/commit/d3a366298aafa1eb64e714d40636756e3fcb5e8c))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** normalize account share index in transfer ops ([12530f9](https://github.com/Adedamola-Aina/AnchorOS/commit/12530f9f4a7ce36229ad9708144b036e091c1428))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **functions:** bug-121 align passkey rp id and enforce max keys ([2c7f344](https://github.com/Adedamola-Aina/AnchorOS/commit/2c7f344d07eb40f126c08662dad82fa8e32728e0))
* **functions:** disable App Check enforcement on staging + force functions redeploy ([64ea36f](https://github.com/Adedamola-Aina/AnchorOS/commit/64ea36f6fd82d9c9ba7463cc3d50a801f0f82989))
* **functions:** enforce appcheck defaults and sharing metadata ([20933ec](https://github.com/Adedamola-Aina/AnchorOS/commit/20933ec9353686ecb538862627a0a389fba02ec8))
* **functions:** split passkeyAuth.ts per ARCH-001 (BUG-112) ([ae888d3](https://github.com/Adedamola-Aina/AnchorOS/commit/ae888d300c2e5652be7a58d1b99164071a847627))
* **pwa:** wire offline queue sync through service worker and online events ([dd92a7e](https://github.com/Adedamola-Aina/AnchorOS/commit/dd92a7e82265d93d604db269a6f26e05aa0daba2))
* **security:** bug-111 route firestore access through securedb ([0f2fa4a](https://github.com/Adedamola-Aina/AnchorOS/commit/0f2fa4ab7c2328279e94820fa172053067d9c099))
* **security:** disable client-side encryption on numeric ledger fields ([be40cdc](https://github.com/Adedamola-Aina/AnchorOS/commit/be40cdcb8a3b9101c82c5eee4ed2f1e0e80fa917))
* **security:** harden sharing rules and align permission tests ([0ecae46](https://github.com/Adedamola-Aina/AnchorOS/commit/0ecae46d9e6919b6ec74094a0ed5cd1986866a4d))
* **security:** remove console.log from secureDbCore.ts (BUG-113) ([657f723](https://github.com/Adedamola-Aina/AnchorOS/commit/657f72355b06283f7a382f355a4bcf913fdcc145))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))
* **security:** route all firestore ops through secureDb.ts (BUG-111) ([d6541aa](https://github.com/Adedamola-Aina/AnchorOS/commit/d6541aa3fbfb278994b177f25d66a6d1bf7434a1))
* **security:** switch App Check to ReCaptchaEnterpriseProvider + correct staging site key ([18c556e](https://github.com/Adedamola-Aina/AnchorOS/commit/18c556e9234768fc652b432d63d9bf86264ba34d))
* **settings:** bug-122 split anchor ai knowledge panel helpers ([5c8b148](https://github.com/Adedamola-Aina/AnchorOS/commit/5c8b148e5a014747c69a769ee16dfce282c53876))
* **settings:** replace Chrome icon with Globe (not in lucide-react version) ([90a4c82](https://github.com/Adedamola-Aina/AnchorOS/commit/90a4c8219a0af0ba8d5584de071d441fdedf45d2))
* **settings:** sign-in list scroll, filter reported entries, passkey error display (BUG-123) ([6e2b9b2](https://github.com/Adedamola-Aina/AnchorOS/commit/6e2b9b26327e7bdcccecfd08922e7e91d3d704ea))
* **settings:** sign-in method badge, passkey UI, device dismiss, social account deletion (BUG-124) ([b648a09](https://github.com/Adedamola-Aina/AnchorOS/commit/b648a099d1ab0e57e5f262746ae54c314096657f))
* **ui:** bug-122 stabilize auth mobile passkeys and anchor-ai flows ([c636686](https://github.com/Adedamola-Aina/AnchorOS/commit/c6366864f65cfbe0d492dd54c910e98a71719a4b))
* **ui:** correct month navigation and monthly badge rendering ([3956e86](https://github.com/Adedamola-Aina/AnchorOS/commit/3956e86f904f2d4c5c2e93f0fbb600d986644177))

## [1.15.0-rc.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.3) (2026-03-31)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** complete passkey registration with server-side attestation verification ([eacb16f](https://github.com/Adedamola-Aina/AnchorOS/commit/eacb16f4f23ad872cfb7a6dfd76f45deb82974b2))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **dashboard:** add code health and delivery intelligence endpoints ([0e62b06](https://github.com/Adedamola-Aina/AnchorOS/commit/0e62b061b5cedd5ed6d2104f47113cf8e80ceba1))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** add popupRedirectResolver for Google/Apple sign-in + passkey delete ([9cc6a5e](https://github.com/Adedamola-Aina/AnchorOS/commit/9cc6a5eea9f2bfc3572503a621efd0d5d46180f5))
* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** bump SW register version to bust stale cache (v1.15.0-rc.10) ([31a8013](https://github.com/Adedamola-Aina/AnchorOS/commit/31a8013a50b2cb6a662b10ebba984a2b65869a39))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **auth:** use shared functions instance + fix SW cache version + env file naming ([e034e10](https://github.com/Adedamola-Aina/AnchorOS/commit/e034e10f95f2f46453d730feebfba323047863ed))
* **build:** remove unused securedb imports causing ts build failure ([b0d66d4](https://github.com/Adedamola-Aina/AnchorOS/commit/b0d66d4fb4d016821c1240178c3bbe4d356ba32d))
* **csp:** add apis.google.com to connect-src for Google OAuth service worker fetch (BUG-123) ([346032b](https://github.com/Adedamola-Aina/AnchorOS/commit/346032b5c323c476343cc31d69dfb5830955d7fc))
* **dashboard:** harden securedb scanner to avoid false negatives ([236d460](https://github.com/Adedamola-Aina/AnchorOS/commit/236d4601734129bc9e1de206faf22683aa9a62f7))
* **dashboard:** normalize trust scorer inputs and update baseline test ([1b95c23](https://github.com/Adedamola-Aina/AnchorOS/commit/1b95c2375e36003756138099d122d05e8b4d430b))
* **dashboard:** null-guard coverage input in trustScorer + fix tests ([d4a59ae](https://github.com/Adedamola-Aina/AnchorOS/commit/d4a59aedddb370734377979154ff658ae17b919c))
* **fabric:** make persistence resilient to secureDb module mocks ([d3a3662](https://github.com/Adedamola-Aina/AnchorOS/commit/d3a366298aafa1eb64e714d40636756e3fcb5e8c))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** normalize account share index in transfer ops ([12530f9](https://github.com/Adedamola-Aina/AnchorOS/commit/12530f9f4a7ce36229ad9708144b036e091c1428))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **functions:** bug-121 align passkey rp id and enforce max keys ([2c7f344](https://github.com/Adedamola-Aina/AnchorOS/commit/2c7f344d07eb40f126c08662dad82fa8e32728e0))
* **functions:** disable App Check enforcement on staging + force functions redeploy ([64ea36f](https://github.com/Adedamola-Aina/AnchorOS/commit/64ea36f6fd82d9c9ba7463cc3d50a801f0f82989))
* **functions:** enforce appcheck defaults and sharing metadata ([20933ec](https://github.com/Adedamola-Aina/AnchorOS/commit/20933ec9353686ecb538862627a0a389fba02ec8))
* **functions:** split passkeyAuth.ts per ARCH-001 (BUG-112) ([ae888d3](https://github.com/Adedamola-Aina/AnchorOS/commit/ae888d300c2e5652be7a58d1b99164071a847627))
* **pwa:** wire offline queue sync through service worker and online events ([dd92a7e](https://github.com/Adedamola-Aina/AnchorOS/commit/dd92a7e82265d93d604db269a6f26e05aa0daba2))
* **security:** bug-111 route firestore access through securedb ([0f2fa4a](https://github.com/Adedamola-Aina/AnchorOS/commit/0f2fa4ab7c2328279e94820fa172053067d9c099))
* **security:** disable client-side encryption on numeric ledger fields ([be40cdc](https://github.com/Adedamola-Aina/AnchorOS/commit/be40cdcb8a3b9101c82c5eee4ed2f1e0e80fa917))
* **security:** harden sharing rules and align permission tests ([0ecae46](https://github.com/Adedamola-Aina/AnchorOS/commit/0ecae46d9e6919b6ec74094a0ed5cd1986866a4d))
* **security:** remove console.log from secureDbCore.ts (BUG-113) ([657f723](https://github.com/Adedamola-Aina/AnchorOS/commit/657f72355b06283f7a382f355a4bcf913fdcc145))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))
* **security:** route all firestore ops through secureDb.ts (BUG-111) ([d6541aa](https://github.com/Adedamola-Aina/AnchorOS/commit/d6541aa3fbfb278994b177f25d66a6d1bf7434a1))
* **security:** switch App Check to ReCaptchaEnterpriseProvider + correct staging site key ([18c556e](https://github.com/Adedamola-Aina/AnchorOS/commit/18c556e9234768fc652b432d63d9bf86264ba34d))
* **settings:** bug-122 split anchor ai knowledge panel helpers ([5c8b148](https://github.com/Adedamola-Aina/AnchorOS/commit/5c8b148e5a014747c69a769ee16dfce282c53876))
* **settings:** replace Chrome icon with Globe (not in lucide-react version) ([90a4c82](https://github.com/Adedamola-Aina/AnchorOS/commit/90a4c8219a0af0ba8d5584de071d441fdedf45d2))
* **settings:** sign-in list scroll, filter reported entries, passkey error display (BUG-123) ([6e2b9b2](https://github.com/Adedamola-Aina/AnchorOS/commit/6e2b9b26327e7bdcccecfd08922e7e91d3d704ea))
* **settings:** sign-in method badge, passkey UI, device dismiss, social account deletion (BUG-124) ([b648a09](https://github.com/Adedamola-Aina/AnchorOS/commit/b648a099d1ab0e57e5f262746ae54c314096657f))
* **ui:** bug-122 stabilize auth mobile passkeys and anchor-ai flows ([c636686](https://github.com/Adedamola-Aina/AnchorOS/commit/c6366864f65cfbe0d492dd54c910e98a71719a4b))
* **ui:** correct month navigation and monthly badge rendering ([3956e86](https://github.com/Adedamola-Aina/AnchorOS/commit/3956e86f904f2d4c5c2e93f0fbb600d986644177))

## [1.15.0-rc.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.2) (2026-03-31)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** complete passkey registration with server-side attestation verification ([eacb16f](https://github.com/Adedamola-Aina/AnchorOS/commit/eacb16f4f23ad872cfb7a6dfd76f45deb82974b2))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **dashboard:** add code health and delivery intelligence endpoints ([0e62b06](https://github.com/Adedamola-Aina/AnchorOS/commit/0e62b061b5cedd5ed6d2104f47113cf8e80ceba1))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** add popupRedirectResolver for Google/Apple sign-in + passkey delete ([9cc6a5e](https://github.com/Adedamola-Aina/AnchorOS/commit/9cc6a5eea9f2bfc3572503a621efd0d5d46180f5))
* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** bump SW register version to bust stale cache (v1.15.0-rc.10) ([31a8013](https://github.com/Adedamola-Aina/AnchorOS/commit/31a8013a50b2cb6a662b10ebba984a2b65869a39))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **auth:** use shared functions instance + fix SW cache version + env file naming ([e034e10](https://github.com/Adedamola-Aina/AnchorOS/commit/e034e10f95f2f46453d730feebfba323047863ed))
* **build:** remove unused securedb imports causing ts build failure ([b0d66d4](https://github.com/Adedamola-Aina/AnchorOS/commit/b0d66d4fb4d016821c1240178c3bbe4d356ba32d))
* **csp:** add apis.google.com to connect-src for Google OAuth service worker fetch (BUG-123) ([346032b](https://github.com/Adedamola-Aina/AnchorOS/commit/346032b5c323c476343cc31d69dfb5830955d7fc))
* **dashboard:** harden securedb scanner to avoid false negatives ([236d460](https://github.com/Adedamola-Aina/AnchorOS/commit/236d4601734129bc9e1de206faf22683aa9a62f7))
* **dashboard:** normalize trust scorer inputs and update baseline test ([1b95c23](https://github.com/Adedamola-Aina/AnchorOS/commit/1b95c2375e36003756138099d122d05e8b4d430b))
* **dashboard:** null-guard coverage input in trustScorer + fix tests ([d4a59ae](https://github.com/Adedamola-Aina/AnchorOS/commit/d4a59aedddb370734377979154ff658ae17b919c))
* **fabric:** make persistence resilient to secureDb module mocks ([d3a3662](https://github.com/Adedamola-Aina/AnchorOS/commit/d3a366298aafa1eb64e714d40636756e3fcb5e8c))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** normalize account share index in transfer ops ([12530f9](https://github.com/Adedamola-Aina/AnchorOS/commit/12530f9f4a7ce36229ad9708144b036e091c1428))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **functions:** bug-121 align passkey rp id and enforce max keys ([2c7f344](https://github.com/Adedamola-Aina/AnchorOS/commit/2c7f344d07eb40f126c08662dad82fa8e32728e0))
* **functions:** disable App Check enforcement on staging + force functions redeploy ([64ea36f](https://github.com/Adedamola-Aina/AnchorOS/commit/64ea36f6fd82d9c9ba7463cc3d50a801f0f82989))
* **functions:** enforce appcheck defaults and sharing metadata ([20933ec](https://github.com/Adedamola-Aina/AnchorOS/commit/20933ec9353686ecb538862627a0a389fba02ec8))
* **functions:** split passkeyAuth.ts per ARCH-001 (BUG-112) ([ae888d3](https://github.com/Adedamola-Aina/AnchorOS/commit/ae888d300c2e5652be7a58d1b99164071a847627))
* **pwa:** wire offline queue sync through service worker and online events ([dd92a7e](https://github.com/Adedamola-Aina/AnchorOS/commit/dd92a7e82265d93d604db269a6f26e05aa0daba2))
* **security:** bug-111 route firestore access through securedb ([0f2fa4a](https://github.com/Adedamola-Aina/AnchorOS/commit/0f2fa4ab7c2328279e94820fa172053067d9c099))
* **security:** disable client-side encryption on numeric ledger fields ([be40cdc](https://github.com/Adedamola-Aina/AnchorOS/commit/be40cdcb8a3b9101c82c5eee4ed2f1e0e80fa917))
* **security:** harden sharing rules and align permission tests ([0ecae46](https://github.com/Adedamola-Aina/AnchorOS/commit/0ecae46d9e6919b6ec74094a0ed5cd1986866a4d))
* **security:** remove console.log from secureDbCore.ts (BUG-113) ([657f723](https://github.com/Adedamola-Aina/AnchorOS/commit/657f72355b06283f7a382f355a4bcf913fdcc145))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))
* **security:** route all firestore ops through secureDb.ts (BUG-111) ([d6541aa](https://github.com/Adedamola-Aina/AnchorOS/commit/d6541aa3fbfb278994b177f25d66a6d1bf7434a1))
* **security:** switch App Check to ReCaptchaEnterpriseProvider + correct staging site key ([18c556e](https://github.com/Adedamola-Aina/AnchorOS/commit/18c556e9234768fc652b432d63d9bf86264ba34d))
* **settings:** bug-122 split anchor ai knowledge panel helpers ([5c8b148](https://github.com/Adedamola-Aina/AnchorOS/commit/5c8b148e5a014747c69a769ee16dfce282c53876))
* **settings:** sign-in list scroll, filter reported entries, passkey error display (BUG-123) ([6e2b9b2](https://github.com/Adedamola-Aina/AnchorOS/commit/6e2b9b26327e7bdcccecfd08922e7e91d3d704ea))
* **settings:** sign-in method badge, passkey UI, device dismiss, social account deletion (BUG-124) ([b648a09](https://github.com/Adedamola-Aina/AnchorOS/commit/b648a099d1ab0e57e5f262746ae54c314096657f))
* **ui:** bug-122 stabilize auth mobile passkeys and anchor-ai flows ([c636686](https://github.com/Adedamola-Aina/AnchorOS/commit/c6366864f65cfbe0d492dd54c910e98a71719a4b))
* **ui:** correct month navigation and monthly badge rendering ([3956e86](https://github.com/Adedamola-Aina/AnchorOS/commit/3956e86f904f2d4c5c2e93f0fbb600d986644177))

## [1.15.0-rc.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.1) (2026-03-31)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** complete passkey registration with server-side attestation verification ([eacb16f](https://github.com/Adedamola-Aina/AnchorOS/commit/eacb16f4f23ad872cfb7a6dfd76f45deb82974b2))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **dashboard:** add code health and delivery intelligence endpoints ([0e62b06](https://github.com/Adedamola-Aina/AnchorOS/commit/0e62b061b5cedd5ed6d2104f47113cf8e80ceba1))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** add popupRedirectResolver for Google/Apple sign-in + passkey delete ([9cc6a5e](https://github.com/Adedamola-Aina/AnchorOS/commit/9cc6a5eea9f2bfc3572503a621efd0d5d46180f5))
* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** bump SW register version to bust stale cache (v1.15.0-rc.10) ([31a8013](https://github.com/Adedamola-Aina/AnchorOS/commit/31a8013a50b2cb6a662b10ebba984a2b65869a39))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **auth:** use shared functions instance + fix SW cache version + env file naming ([e034e10](https://github.com/Adedamola-Aina/AnchorOS/commit/e034e10f95f2f46453d730feebfba323047863ed))
* **build:** remove unused securedb imports causing ts build failure ([b0d66d4](https://github.com/Adedamola-Aina/AnchorOS/commit/b0d66d4fb4d016821c1240178c3bbe4d356ba32d))
* **csp:** add apis.google.com to connect-src for Google OAuth service worker fetch (BUG-123) ([346032b](https://github.com/Adedamola-Aina/AnchorOS/commit/346032b5c323c476343cc31d69dfb5830955d7fc))
* **dashboard:** harden securedb scanner to avoid false negatives ([236d460](https://github.com/Adedamola-Aina/AnchorOS/commit/236d4601734129bc9e1de206faf22683aa9a62f7))
* **dashboard:** normalize trust scorer inputs and update baseline test ([1b95c23](https://github.com/Adedamola-Aina/AnchorOS/commit/1b95c2375e36003756138099d122d05e8b4d430b))
* **dashboard:** null-guard coverage input in trustScorer + fix tests ([d4a59ae](https://github.com/Adedamola-Aina/AnchorOS/commit/d4a59aedddb370734377979154ff658ae17b919c))
* **fabric:** make persistence resilient to secureDb module mocks ([d3a3662](https://github.com/Adedamola-Aina/AnchorOS/commit/d3a366298aafa1eb64e714d40636756e3fcb5e8c))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** normalize account share index in transfer ops ([12530f9](https://github.com/Adedamola-Aina/AnchorOS/commit/12530f9f4a7ce36229ad9708144b036e091c1428))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **functions:** bug-121 align passkey rp id and enforce max keys ([2c7f344](https://github.com/Adedamola-Aina/AnchorOS/commit/2c7f344d07eb40f126c08662dad82fa8e32728e0))
* **functions:** disable App Check enforcement on staging + force functions redeploy ([64ea36f](https://github.com/Adedamola-Aina/AnchorOS/commit/64ea36f6fd82d9c9ba7463cc3d50a801f0f82989))
* **functions:** enforce appcheck defaults and sharing metadata ([20933ec](https://github.com/Adedamola-Aina/AnchorOS/commit/20933ec9353686ecb538862627a0a389fba02ec8))
* **functions:** split passkeyAuth.ts per ARCH-001 (BUG-112) ([ae888d3](https://github.com/Adedamola-Aina/AnchorOS/commit/ae888d300c2e5652be7a58d1b99164071a847627))
* **pwa:** wire offline queue sync through service worker and online events ([dd92a7e](https://github.com/Adedamola-Aina/AnchorOS/commit/dd92a7e82265d93d604db269a6f26e05aa0daba2))
* **security:** bug-111 route firestore access through securedb ([0f2fa4a](https://github.com/Adedamola-Aina/AnchorOS/commit/0f2fa4ab7c2328279e94820fa172053067d9c099))
* **security:** disable client-side encryption on numeric ledger fields ([be40cdc](https://github.com/Adedamola-Aina/AnchorOS/commit/be40cdcb8a3b9101c82c5eee4ed2f1e0e80fa917))
* **security:** harden sharing rules and align permission tests ([0ecae46](https://github.com/Adedamola-Aina/AnchorOS/commit/0ecae46d9e6919b6ec74094a0ed5cd1986866a4d))
* **security:** remove console.log from secureDbCore.ts (BUG-113) ([657f723](https://github.com/Adedamola-Aina/AnchorOS/commit/657f72355b06283f7a382f355a4bcf913fdcc145))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))
* **security:** route all firestore ops through secureDb.ts (BUG-111) ([d6541aa](https://github.com/Adedamola-Aina/AnchorOS/commit/d6541aa3fbfb278994b177f25d66a6d1bf7434a1))
* **security:** switch App Check to ReCaptchaEnterpriseProvider + correct staging site key ([18c556e](https://github.com/Adedamola-Aina/AnchorOS/commit/18c556e9234768fc652b432d63d9bf86264ba34d))
* **settings:** bug-122 split anchor ai knowledge panel helpers ([5c8b148](https://github.com/Adedamola-Aina/AnchorOS/commit/5c8b148e5a014747c69a769ee16dfce282c53876))
* **settings:** sign-in list scroll, filter reported entries, passkey error display (BUG-123) ([6e2b9b2](https://github.com/Adedamola-Aina/AnchorOS/commit/6e2b9b26327e7bdcccecfd08922e7e91d3d704ea))
* **ui:** bug-122 stabilize auth mobile passkeys and anchor-ai flows ([c636686](https://github.com/Adedamola-Aina/AnchorOS/commit/c6366864f65cfbe0d492dd54c910e98a71719a4b))
* **ui:** correct month navigation and monthly badge rendering ([3956e86](https://github.com/Adedamola-Aina/AnchorOS/commit/3956e86f904f2d4c5c2e93f0fbb600d986644177))

## [1.15.0-rc.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.0) (2026-03-31)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** complete passkey registration with server-side attestation verification ([eacb16f](https://github.com/Adedamola-Aina/AnchorOS/commit/eacb16f4f23ad872cfb7a6dfd76f45deb82974b2))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **dashboard:** add code health and delivery intelligence endpoints ([0e62b06](https://github.com/Adedamola-Aina/AnchorOS/commit/0e62b061b5cedd5ed6d2104f47113cf8e80ceba1))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** add popupRedirectResolver for Google/Apple sign-in + passkey delete ([9cc6a5e](https://github.com/Adedamola-Aina/AnchorOS/commit/9cc6a5eea9f2bfc3572503a621efd0d5d46180f5))
* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** bump SW register version to bust stale cache (v1.15.0-rc.10) ([31a8013](https://github.com/Adedamola-Aina/AnchorOS/commit/31a8013a50b2cb6a662b10ebba984a2b65869a39))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **auth:** use shared functions instance + fix SW cache version + env file naming ([e034e10](https://github.com/Adedamola-Aina/AnchorOS/commit/e034e10f95f2f46453d730feebfba323047863ed))
* **build:** remove unused securedb imports causing ts build failure ([b0d66d4](https://github.com/Adedamola-Aina/AnchorOS/commit/b0d66d4fb4d016821c1240178c3bbe4d356ba32d))
* **dashboard:** harden securedb scanner to avoid false negatives ([236d460](https://github.com/Adedamola-Aina/AnchorOS/commit/236d4601734129bc9e1de206faf22683aa9a62f7))
* **dashboard:** normalize trust scorer inputs and update baseline test ([1b95c23](https://github.com/Adedamola-Aina/AnchorOS/commit/1b95c2375e36003756138099d122d05e8b4d430b))
* **dashboard:** null-guard coverage input in trustScorer + fix tests ([d4a59ae](https://github.com/Adedamola-Aina/AnchorOS/commit/d4a59aedddb370734377979154ff658ae17b919c))
* **fabric:** make persistence resilient to secureDb module mocks ([d3a3662](https://github.com/Adedamola-Aina/AnchorOS/commit/d3a366298aafa1eb64e714d40636756e3fcb5e8c))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** normalize account share index in transfer ops ([12530f9](https://github.com/Adedamola-Aina/AnchorOS/commit/12530f9f4a7ce36229ad9708144b036e091c1428))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **functions:** bug-121 align passkey rp id and enforce max keys ([2c7f344](https://github.com/Adedamola-Aina/AnchorOS/commit/2c7f344d07eb40f126c08662dad82fa8e32728e0))
* **functions:** disable App Check enforcement on staging + force functions redeploy ([64ea36f](https://github.com/Adedamola-Aina/AnchorOS/commit/64ea36f6fd82d9c9ba7463cc3d50a801f0f82989))
* **functions:** enforce appcheck defaults and sharing metadata ([20933ec](https://github.com/Adedamola-Aina/AnchorOS/commit/20933ec9353686ecb538862627a0a389fba02ec8))
* **functions:** split passkeyAuth.ts per ARCH-001 (BUG-112) ([ae888d3](https://github.com/Adedamola-Aina/AnchorOS/commit/ae888d300c2e5652be7a58d1b99164071a847627))
* **pwa:** wire offline queue sync through service worker and online events ([dd92a7e](https://github.com/Adedamola-Aina/AnchorOS/commit/dd92a7e82265d93d604db269a6f26e05aa0daba2))
* **security:** bug-111 route firestore access through securedb ([0f2fa4a](https://github.com/Adedamola-Aina/AnchorOS/commit/0f2fa4ab7c2328279e94820fa172053067d9c099))
* **security:** disable client-side encryption on numeric ledger fields ([be40cdc](https://github.com/Adedamola-Aina/AnchorOS/commit/be40cdcb8a3b9101c82c5eee4ed2f1e0e80fa917))
* **security:** harden sharing rules and align permission tests ([0ecae46](https://github.com/Adedamola-Aina/AnchorOS/commit/0ecae46d9e6919b6ec74094a0ed5cd1986866a4d))
* **security:** remove console.log from secureDbCore.ts (BUG-113) ([657f723](https://github.com/Adedamola-Aina/AnchorOS/commit/657f72355b06283f7a382f355a4bcf913fdcc145))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))
* **security:** route all firestore ops through secureDb.ts (BUG-111) ([d6541aa](https://github.com/Adedamola-Aina/AnchorOS/commit/d6541aa3fbfb278994b177f25d66a6d1bf7434a1))
* **security:** switch App Check to ReCaptchaEnterpriseProvider + correct staging site key ([18c556e](https://github.com/Adedamola-Aina/AnchorOS/commit/18c556e9234768fc652b432d63d9bf86264ba34d))
* **settings:** bug-122 split anchor ai knowledge panel helpers ([5c8b148](https://github.com/Adedamola-Aina/AnchorOS/commit/5c8b148e5a014747c69a769ee16dfce282c53876))
* **settings:** sign-in list scroll, filter reported entries, passkey error display (BUG-123) ([6e2b9b2](https://github.com/Adedamola-Aina/AnchorOS/commit/6e2b9b26327e7bdcccecfd08922e7e91d3d704ea))
* **ui:** bug-122 stabilize auth mobile passkeys and anchor-ai flows ([c636686](https://github.com/Adedamola-Aina/AnchorOS/commit/c6366864f65cfbe0d492dd54c910e98a71719a4b))
* **ui:** correct month navigation and monthly badge rendering ([3956e86](https://github.com/Adedamola-Aina/AnchorOS/commit/3956e86f904f2d4c5c2e93f0fbb600d986644177))

## [1.15.0-dev.3](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-dev.3) (2026-03-31)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** complete passkey registration with server-side attestation verification ([eacb16f](https://github.com/Adedamola-Aina/AnchorOS/commit/eacb16f4f23ad872cfb7a6dfd76f45deb82974b2))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **dashboard:** add code health and delivery intelligence endpoints ([0e62b06](https://github.com/Adedamola-Aina/AnchorOS/commit/0e62b061b5cedd5ed6d2104f47113cf8e80ceba1))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** add popupRedirectResolver for Google/Apple sign-in + passkey delete ([9cc6a5e](https://github.com/Adedamola-Aina/AnchorOS/commit/9cc6a5eea9f2bfc3572503a621efd0d5d46180f5))
* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** bump SW register version to bust stale cache (v1.15.0-rc.10) ([31a8013](https://github.com/Adedamola-Aina/AnchorOS/commit/31a8013a50b2cb6a662b10ebba984a2b65869a39))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **auth:** use shared functions instance + fix SW cache version + env file naming ([e034e10](https://github.com/Adedamola-Aina/AnchorOS/commit/e034e10f95f2f46453d730feebfba323047863ed))
* **build:** remove unused securedb imports causing ts build failure ([b0d66d4](https://github.com/Adedamola-Aina/AnchorOS/commit/b0d66d4fb4d016821c1240178c3bbe4d356ba32d))
* **dashboard:** harden securedb scanner to avoid false negatives ([236d460](https://github.com/Adedamola-Aina/AnchorOS/commit/236d4601734129bc9e1de206faf22683aa9a62f7))
* **dashboard:** normalize trust scorer inputs and update baseline test ([1b95c23](https://github.com/Adedamola-Aina/AnchorOS/commit/1b95c2375e36003756138099d122d05e8b4d430b))
* **dashboard:** null-guard coverage input in trustScorer + fix tests ([d4a59ae](https://github.com/Adedamola-Aina/AnchorOS/commit/d4a59aedddb370734377979154ff658ae17b919c))
* **fabric:** make persistence resilient to secureDb module mocks ([d3a3662](https://github.com/Adedamola-Aina/AnchorOS/commit/d3a366298aafa1eb64e714d40636756e3fcb5e8c))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** normalize account share index in transfer ops ([12530f9](https://github.com/Adedamola-Aina/AnchorOS/commit/12530f9f4a7ce36229ad9708144b036e091c1428))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **functions:** bug-121 align passkey rp id and enforce max keys ([2c7f344](https://github.com/Adedamola-Aina/AnchorOS/commit/2c7f344d07eb40f126c08662dad82fa8e32728e0))
* **functions:** disable App Check enforcement on staging + force functions redeploy ([64ea36f](https://github.com/Adedamola-Aina/AnchorOS/commit/64ea36f6fd82d9c9ba7463cc3d50a801f0f82989))
* **functions:** enforce appcheck defaults and sharing metadata ([20933ec](https://github.com/Adedamola-Aina/AnchorOS/commit/20933ec9353686ecb538862627a0a389fba02ec8))
* **functions:** split passkeyAuth.ts per ARCH-001 (BUG-112) ([ae888d3](https://github.com/Adedamola-Aina/AnchorOS/commit/ae888d300c2e5652be7a58d1b99164071a847627))
* **pwa:** wire offline queue sync through service worker and online events ([dd92a7e](https://github.com/Adedamola-Aina/AnchorOS/commit/dd92a7e82265d93d604db269a6f26e05aa0daba2))
* **security:** bug-111 route firestore access through securedb ([0f2fa4a](https://github.com/Adedamola-Aina/AnchorOS/commit/0f2fa4ab7c2328279e94820fa172053067d9c099))
* **security:** disable client-side encryption on numeric ledger fields ([be40cdc](https://github.com/Adedamola-Aina/AnchorOS/commit/be40cdcb8a3b9101c82c5eee4ed2f1e0e80fa917))
* **security:** harden sharing rules and align permission tests ([0ecae46](https://github.com/Adedamola-Aina/AnchorOS/commit/0ecae46d9e6919b6ec74094a0ed5cd1986866a4d))
* **security:** remove console.log from secureDbCore.ts (BUG-113) ([657f723](https://github.com/Adedamola-Aina/AnchorOS/commit/657f72355b06283f7a382f355a4bcf913fdcc145))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))
* **security:** route all firestore ops through secureDb.ts (BUG-111) ([d6541aa](https://github.com/Adedamola-Aina/AnchorOS/commit/d6541aa3fbfb278994b177f25d66a6d1bf7434a1))
* **security:** switch App Check to ReCaptchaEnterpriseProvider + correct staging site key ([18c556e](https://github.com/Adedamola-Aina/AnchorOS/commit/18c556e9234768fc652b432d63d9bf86264ba34d))
* **settings:** bug-122 split anchor ai knowledge panel helpers ([5c8b148](https://github.com/Adedamola-Aina/AnchorOS/commit/5c8b148e5a014747c69a769ee16dfce282c53876))
* **settings:** sign-in list scroll, filter reported entries, passkey error display (BUG-123) ([6e2b9b2](https://github.com/Adedamola-Aina/AnchorOS/commit/6e2b9b26327e7bdcccecfd08922e7e91d3d704ea))
* **ui:** bug-122 stabilize auth mobile passkeys and anchor-ai flows ([c636686](https://github.com/Adedamola-Aina/AnchorOS/commit/c6366864f65cfbe0d492dd54c910e98a71719a4b))
* **ui:** correct month navigation and monthly badge rendering ([3956e86](https://github.com/Adedamola-Aina/AnchorOS/commit/3956e86f904f2d4c5c2e93f0fbb600d986644177))

## [1.15.0-dev.2](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-dev.2) (2026-03-29)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** complete passkey registration with server-side attestation verification ([eacb16f](https://github.com/Adedamola-Aina/AnchorOS/commit/eacb16f4f23ad872cfb7a6dfd76f45deb82974b2))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **dashboard:** add code health and delivery intelligence endpoints ([0e62b06](https://github.com/Adedamola-Aina/AnchorOS/commit/0e62b061b5cedd5ed6d2104f47113cf8e80ceba1))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** add popupRedirectResolver for Google/Apple sign-in + passkey delete ([9cc6a5e](https://github.com/Adedamola-Aina/AnchorOS/commit/9cc6a5eea9f2bfc3572503a621efd0d5d46180f5))
* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** bump SW register version to bust stale cache (v1.15.0-rc.10) ([31a8013](https://github.com/Adedamola-Aina/AnchorOS/commit/31a8013a50b2cb6a662b10ebba984a2b65869a39))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **auth:** use shared functions instance + fix SW cache version + env file naming ([e034e10](https://github.com/Adedamola-Aina/AnchorOS/commit/e034e10f95f2f46453d730feebfba323047863ed))
* **build:** remove unused securedb imports causing ts build failure ([b0d66d4](https://github.com/Adedamola-Aina/AnchorOS/commit/b0d66d4fb4d016821c1240178c3bbe4d356ba32d))
* **dashboard:** harden securedb scanner to avoid false negatives ([236d460](https://github.com/Adedamola-Aina/AnchorOS/commit/236d4601734129bc9e1de206faf22683aa9a62f7))
* **dashboard:** normalize trust scorer inputs and update baseline test ([1b95c23](https://github.com/Adedamola-Aina/AnchorOS/commit/1b95c2375e36003756138099d122d05e8b4d430b))
* **dashboard:** null-guard coverage input in trustScorer + fix tests ([d4a59ae](https://github.com/Adedamola-Aina/AnchorOS/commit/d4a59aedddb370734377979154ff658ae17b919c))
* **fabric:** make persistence resilient to secureDb module mocks ([d3a3662](https://github.com/Adedamola-Aina/AnchorOS/commit/d3a366298aafa1eb64e714d40636756e3fcb5e8c))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** normalize account share index in transfer ops ([12530f9](https://github.com/Adedamola-Aina/AnchorOS/commit/12530f9f4a7ce36229ad9708144b036e091c1428))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **functions:** bug-121 align passkey rp id and enforce max keys ([2c7f344](https://github.com/Adedamola-Aina/AnchorOS/commit/2c7f344d07eb40f126c08662dad82fa8e32728e0))
* **functions:** disable App Check enforcement on staging + force functions redeploy ([64ea36f](https://github.com/Adedamola-Aina/AnchorOS/commit/64ea36f6fd82d9c9ba7463cc3d50a801f0f82989))
* **functions:** enforce appcheck defaults and sharing metadata ([20933ec](https://github.com/Adedamola-Aina/AnchorOS/commit/20933ec9353686ecb538862627a0a389fba02ec8))
* **functions:** split passkeyAuth.ts per ARCH-001 (BUG-112) ([ae888d3](https://github.com/Adedamola-Aina/AnchorOS/commit/ae888d300c2e5652be7a58d1b99164071a847627))
* **pwa:** wire offline queue sync through service worker and online events ([dd92a7e](https://github.com/Adedamola-Aina/AnchorOS/commit/dd92a7e82265d93d604db269a6f26e05aa0daba2))
* **security:** bug-111 route firestore access through securedb ([0f2fa4a](https://github.com/Adedamola-Aina/AnchorOS/commit/0f2fa4ab7c2328279e94820fa172053067d9c099))
* **security:** disable client-side encryption on numeric ledger fields ([be40cdc](https://github.com/Adedamola-Aina/AnchorOS/commit/be40cdcb8a3b9101c82c5eee4ed2f1e0e80fa917))
* **security:** harden sharing rules and align permission tests ([0ecae46](https://github.com/Adedamola-Aina/AnchorOS/commit/0ecae46d9e6919b6ec74094a0ed5cd1986866a4d))
* **security:** remove console.log from secureDbCore.ts (BUG-113) ([657f723](https://github.com/Adedamola-Aina/AnchorOS/commit/657f72355b06283f7a382f355a4bcf913fdcc145))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))
* **security:** route all firestore ops through secureDb.ts (BUG-111) ([d6541aa](https://github.com/Adedamola-Aina/AnchorOS/commit/d6541aa3fbfb278994b177f25d66a6d1bf7434a1))
* **security:** switch App Check to ReCaptchaEnterpriseProvider + correct staging site key ([18c556e](https://github.com/Adedamola-Aina/AnchorOS/commit/18c556e9234768fc652b432d63d9bf86264ba34d))
* **settings:** bug-122 split anchor ai knowledge panel helpers ([5c8b148](https://github.com/Adedamola-Aina/AnchorOS/commit/5c8b148e5a014747c69a769ee16dfce282c53876))
* **ui:** bug-122 stabilize auth mobile passkeys and anchor-ai flows ([c636686](https://github.com/Adedamola-Aina/AnchorOS/commit/c6366864f65cfbe0d492dd54c910e98a71719a4b))
* **ui:** correct month navigation and monthly badge rendering ([3956e86](https://github.com/Adedamola-Aina/AnchorOS/commit/3956e86f904f2d4c5c2e93f0fbb600d986644177))

## [1.15.0-dev.1](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-dev.1) (2026-03-29)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** complete passkey registration with server-side attestation verification ([eacb16f](https://github.com/Adedamola-Aina/AnchorOS/commit/eacb16f4f23ad872cfb7a6dfd76f45deb82974b2))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **dashboard:** add code health and delivery intelligence endpoints ([0e62b06](https://github.com/Adedamola-Aina/AnchorOS/commit/0e62b061b5cedd5ed6d2104f47113cf8e80ceba1))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** add popupRedirectResolver for Google/Apple sign-in + passkey delete ([9cc6a5e](https://github.com/Adedamola-Aina/AnchorOS/commit/9cc6a5eea9f2bfc3572503a621efd0d5d46180f5))
* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** bump SW register version to bust stale cache (v1.15.0-rc.10) ([31a8013](https://github.com/Adedamola-Aina/AnchorOS/commit/31a8013a50b2cb6a662b10ebba984a2b65869a39))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **auth:** use shared functions instance + fix SW cache version + env file naming ([e034e10](https://github.com/Adedamola-Aina/AnchorOS/commit/e034e10f95f2f46453d730feebfba323047863ed))
* **build:** remove unused securedb imports causing ts build failure ([b0d66d4](https://github.com/Adedamola-Aina/AnchorOS/commit/b0d66d4fb4d016821c1240178c3bbe4d356ba32d))
* **dashboard:** harden securedb scanner to avoid false negatives ([236d460](https://github.com/Adedamola-Aina/AnchorOS/commit/236d4601734129bc9e1de206faf22683aa9a62f7))
* **dashboard:** normalize trust scorer inputs and update baseline test ([1b95c23](https://github.com/Adedamola-Aina/AnchorOS/commit/1b95c2375e36003756138099d122d05e8b4d430b))
* **dashboard:** null-guard coverage input in trustScorer + fix tests ([d4a59ae](https://github.com/Adedamola-Aina/AnchorOS/commit/d4a59aedddb370734377979154ff658ae17b919c))
* **fabric:** make persistence resilient to secureDb module mocks ([d3a3662](https://github.com/Adedamola-Aina/AnchorOS/commit/d3a366298aafa1eb64e714d40636756e3fcb5e8c))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** normalize account share index in transfer ops ([12530f9](https://github.com/Adedamola-Aina/AnchorOS/commit/12530f9f4a7ce36229ad9708144b036e091c1428))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **functions:** disable App Check enforcement on staging + force functions redeploy ([64ea36f](https://github.com/Adedamola-Aina/AnchorOS/commit/64ea36f6fd82d9c9ba7463cc3d50a801f0f82989))
* **functions:** enforce appcheck defaults and sharing metadata ([20933ec](https://github.com/Adedamola-Aina/AnchorOS/commit/20933ec9353686ecb538862627a0a389fba02ec8))
* **functions:** split passkeyAuth.ts per ARCH-001 (BUG-112) ([ae888d3](https://github.com/Adedamola-Aina/AnchorOS/commit/ae888d300c2e5652be7a58d1b99164071a847627))
* **pwa:** wire offline queue sync through service worker and online events ([dd92a7e](https://github.com/Adedamola-Aina/AnchorOS/commit/dd92a7e82265d93d604db269a6f26e05aa0daba2))
* **security:** disable client-side encryption on numeric ledger fields ([be40cdc](https://github.com/Adedamola-Aina/AnchorOS/commit/be40cdcb8a3b9101c82c5eee4ed2f1e0e80fa917))
* **security:** harden sharing rules and align permission tests ([0ecae46](https://github.com/Adedamola-Aina/AnchorOS/commit/0ecae46d9e6919b6ec74094a0ed5cd1986866a4d))
* **security:** remove console.log from secureDbCore.ts (BUG-113) ([657f723](https://github.com/Adedamola-Aina/AnchorOS/commit/657f72355b06283f7a382f355a4bcf913fdcc145))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))
* **security:** route all firestore ops through secureDb.ts (BUG-111) ([d6541aa](https://github.com/Adedamola-Aina/AnchorOS/commit/d6541aa3fbfb278994b177f25d66a6d1bf7434a1))
* **security:** switch App Check to ReCaptchaEnterpriseProvider + correct staging site key ([18c556e](https://github.com/Adedamola-Aina/AnchorOS/commit/18c556e9234768fc652b432d63d9bf86264ba34d))
* **ui:** correct month navigation and monthly badge rendering ([3956e86](https://github.com/Adedamola-Aina/AnchorOS/commit/3956e86f904f2d4c5c2e93f0fbb600d986644177))

## [1.15.0-dev.0](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-dev.0) (2026-03-29)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** complete passkey registration with server-side attestation verification ([eacb16f](https://github.com/Adedamola-Aina/AnchorOS/commit/eacb16f4f23ad872cfb7a6dfd76f45deb82974b2))
* **auth:** GAP-011 server-side WebAuthn assertion verification ([225c1d5](https://github.com/Adedamola-Aina/AnchorOS/commit/225c1d5cd8c16471ad906a12b4b354857fbc6b01))
* **ci:** ARCH-026 firestore rules coverage gate + dashboard detection fix ([f344695](https://github.com/Adedamola-Aina/AnchorOS/commit/f344695711ced0ce2bdc56969630d55f55cbb3fd))
* **ci:** ARCH-026 firestore rules path coverage enforcement ([cedb38e](https://github.com/Adedamola-Aina/AnchorOS/commit/cedb38e7cfcc115b1fab3dfa7530f86d4e984783))
* **dashboard:** add code health and delivery intelligence endpoints ([0e62b06](https://github.com/Adedamola-Aina/AnchorOS/commit/0e62b061b5cedd5ed6d2104f47113cf8e80ceba1))
* **finance:** inn-002 subscription pattern detection card in finance view ([d2f5b88](https://github.com/Adedamola-Aina/AnchorOS/commit/d2f5b885873ff9e639ec6f1d29fa4e742effcb48))
* **finance:** INN-002 subscription pattern detection wired into finance view ([15e934d](https://github.com/Adedamola-Aina/AnchorOS/commit/15e934dd0d36c926872d962fbb475184a71263aa))
* **security:** arch-022 sec-009 firestore rules for auth events + ledger audit types ([c79f989](https://github.com/Adedamola-Aina/AnchorOS/commit/c79f989b18928e140541600493c0f9edb1eaa53c))
* **security:** sec-005 field-level aes-gcm encryption on finance write/read paths ([0885098](https://github.com/Adedamola-Aina/AnchorOS/commit/0885098884d4399bc3ed187283f24562d5a2de9d))
* **security:** sec-007 sre-003 auth event service, ledger, sentry pii scrubber, health endpoint ([1946c00](https://github.com/Adedamola-Aina/AnchorOS/commit/1946c008f148cf3338a57fc41d02be00fe0e4fb9))
* **security:** sec-007 wire sentry pii scrubber into main, export cloud functions, update config ([0ce7a30](https://github.com/Adedamola-Aina/AnchorOS/commit/0ce7a30da221c3b7ee8b84b5e0265a9ae31eb7f6))
* **types:** ENG-005 shared typescript types package ([9de8cbd](https://github.com/Adedamola-Aina/AnchorOS/commit/9de8cbdf5d0523cb2df308c6e3d5d9e3c74a2f3b))


### Bug Fixes

* **auth:** add popupRedirectResolver for Google/Apple sign-in + passkey delete ([9cc6a5e](https://github.com/Adedamola-Aina/AnchorOS/commit/9cc6a5eea9f2bfc3572503a621efd0d5d46180f5))
* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** bump SW register version to bust stale cache (v1.15.0-rc.10) ([31a8013](https://github.com/Adedamola-Aina/AnchorOS/commit/31a8013a50b2cb6a662b10ebba984a2b65869a39))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **auth:** use shared functions instance + fix SW cache version + env file naming ([e034e10](https://github.com/Adedamola-Aina/AnchorOS/commit/e034e10f95f2f46453d730feebfba323047863ed))
* **dashboard:** harden securedb scanner to avoid false negatives ([236d460](https://github.com/Adedamola-Aina/AnchorOS/commit/236d4601734129bc9e1de206faf22683aa9a62f7))
* **dashboard:** normalize trust scorer inputs and update baseline test ([1b95c23](https://github.com/Adedamola-Aina/AnchorOS/commit/1b95c2375e36003756138099d122d05e8b4d430b))
* **dashboard:** null-guard coverage input in trustScorer + fix tests ([d4a59ae](https://github.com/Adedamola-Aina/AnchorOS/commit/d4a59aedddb370734377979154ff658ae17b919c))
* **fabric:** make persistence resilient to secureDb module mocks ([d3a3662](https://github.com/Adedamola-Aina/AnchorOS/commit/d3a366298aafa1eb64e714d40636756e3fcb5e8c))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** normalize account share index in transfer ops ([12530f9](https://github.com/Adedamola-Aina/AnchorOS/commit/12530f9f4a7ce36229ad9708144b036e091c1428))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **functions:** disable App Check enforcement on staging + force functions redeploy ([64ea36f](https://github.com/Adedamola-Aina/AnchorOS/commit/64ea36f6fd82d9c9ba7463cc3d50a801f0f82989))
* **functions:** enforce appcheck defaults and sharing metadata ([20933ec](https://github.com/Adedamola-Aina/AnchorOS/commit/20933ec9353686ecb538862627a0a389fba02ec8))
* **functions:** split passkeyAuth.ts per ARCH-001 (BUG-112) ([ae888d3](https://github.com/Adedamola-Aina/AnchorOS/commit/ae888d300c2e5652be7a58d1b99164071a847627))
* **pwa:** wire offline queue sync through service worker and online events ([dd92a7e](https://github.com/Adedamola-Aina/AnchorOS/commit/dd92a7e82265d93d604db269a6f26e05aa0daba2))
* **security:** disable client-side encryption on numeric ledger fields ([be40cdc](https://github.com/Adedamola-Aina/AnchorOS/commit/be40cdcb8a3b9101c82c5eee4ed2f1e0e80fa917))
* **security:** harden sharing rules and align permission tests ([0ecae46](https://github.com/Adedamola-Aina/AnchorOS/commit/0ecae46d9e6919b6ec74094a0ed5cd1986866a4d))
* **security:** remove console.log from secureDbCore.ts (BUG-113) ([657f723](https://github.com/Adedamola-Aina/AnchorOS/commit/657f72355b06283f7a382f355a4bcf913fdcc145))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))
* **security:** route all firestore ops through secureDb.ts (BUG-111) ([d6541aa](https://github.com/Adedamola-Aina/AnchorOS/commit/d6541aa3fbfb278994b177f25d66a6d1bf7434a1))
* **security:** switch App Check to ReCaptchaEnterpriseProvider + correct staging site key ([18c556e](https://github.com/Adedamola-Aina/AnchorOS/commit/18c556e9234768fc652b432d63d9bf86264ba34d))
* **ui:** correct month navigation and monthly badge rendering ([3956e86](https://github.com/Adedamola-Aina/AnchorOS/commit/3956e86f904f2d4c5c2e93f0fbb600d986644177))

## [1.15.0-rc.12](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.12) (2026-03-22)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** complete passkey registration with server-side attestation verification ([eacb16f](https://github.com/Adedamola-Aina/AnchorOS/commit/eacb16f4f23ad872cfb7a6dfd76f45deb82974b2))
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

* **auth:** add popupRedirectResolver for Google/Apple sign-in + passkey delete ([9cc6a5e](https://github.com/Adedamola-Aina/AnchorOS/commit/9cc6a5eea9f2bfc3572503a621efd0d5d46180f5))
* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** bump SW register version to bust stale cache (v1.15.0-rc.10) ([31a8013](https://github.com/Adedamola-Aina/AnchorOS/commit/31a8013a50b2cb6a662b10ebba984a2b65869a39))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **auth:** use shared functions instance + fix SW cache version + env file naming ([e034e10](https://github.com/Adedamola-Aina/AnchorOS/commit/e034e10f95f2f46453d730feebfba323047863ed))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **functions:** disable App Check enforcement on staging + force functions redeploy ([64ea36f](https://github.com/Adedamola-Aina/AnchorOS/commit/64ea36f6fd82d9c9ba7463cc3d50a801f0f82989))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))
* **security:** switch App Check to ReCaptchaEnterpriseProvider + correct staging site key ([18c556e](https://github.com/Adedamola-Aina/AnchorOS/commit/18c556e9234768fc652b432d63d9bf86264ba34d))

## [1.15.0-rc.11](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.11) (2026-03-22)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** complete passkey registration with server-side attestation verification ([eacb16f](https://github.com/Adedamola-Aina/AnchorOS/commit/eacb16f4f23ad872cfb7a6dfd76f45deb82974b2))
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

* **auth:** add popupRedirectResolver for Google/Apple sign-in + passkey delete ([9cc6a5e](https://github.com/Adedamola-Aina/AnchorOS/commit/9cc6a5eea9f2bfc3572503a621efd0d5d46180f5))
* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** bump SW register version to bust stale cache (v1.15.0-rc.10) ([31a8013](https://github.com/Adedamola-Aina/AnchorOS/commit/31a8013a50b2cb6a662b10ebba984a2b65869a39))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **auth:** use shared functions instance + fix SW cache version + env file naming ([e034e10](https://github.com/Adedamola-Aina/AnchorOS/commit/e034e10f95f2f46453d730feebfba323047863ed))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))
* **security:** switch App Check to ReCaptchaEnterpriseProvider + correct staging site key ([18c556e](https://github.com/Adedamola-Aina/AnchorOS/commit/18c556e9234768fc652b432d63d9bf86264ba34d))

## [1.15.0-rc.9](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.9) (2026-03-22)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** complete passkey registration with server-side attestation verification ([eacb16f](https://github.com/Adedamola-Aina/AnchorOS/commit/eacb16f4f23ad872cfb7a6dfd76f45deb82974b2))
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

* **auth:** add popupRedirectResolver for Google/Apple sign-in + passkey delete ([9cc6a5e](https://github.com/Adedamola-Aina/AnchorOS/commit/9cc6a5eea9f2bfc3572503a621efd0d5d46180f5))
* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **auth:** use shared functions instance + fix SW cache version + env file naming ([e034e10](https://github.com/Adedamola-Aina/AnchorOS/commit/e034e10f95f2f46453d730feebfba323047863ed))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))
* **security:** switch App Check to ReCaptchaEnterpriseProvider + correct staging site key ([18c556e](https://github.com/Adedamola-Aina/AnchorOS/commit/18c556e9234768fc652b432d63d9bf86264ba34d))

## [1.15.0-rc.8](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.8) (2026-03-22)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** complete passkey registration with server-side attestation verification ([eacb16f](https://github.com/Adedamola-Aina/AnchorOS/commit/eacb16f4f23ad872cfb7a6dfd76f45deb82974b2))
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

* **auth:** add popupRedirectResolver for Google/Apple sign-in + passkey delete ([9cc6a5e](https://github.com/Adedamola-Aina/AnchorOS/commit/9cc6a5eea9f2bfc3572503a621efd0d5d46180f5))
* **auth:** allow all origins in dev CORS for callable functions ([093c5ca](https://github.com/Adedamola-Aina/AnchorOS/commit/093c5ca2f5fc54451b051b5124043f422c9ba564))
* **auth:** auth-001 auth-005 arch-001 apple icon dark mode + split authcontext to 181 lines ([275ce43](https://github.com/Adedamola-Aina/AnchorOS/commit/275ce432dcaa17b0058536a42e232a9d9f0dd255))
* **auth:** BUG-109 apple icon svg + passkey roaming authenticator support ([b677b08](https://github.com/Adedamola-Aina/AnchorOS/commit/b677b089648cc7dd0f8b14ac3ac2b1565e28523e))
* **auth:** resolve typescript type errors in passkey test files ([c72913e](https://github.com/Adedamola-Aina/AnchorOS/commit/c72913efa66d5af45f882de773c182e3a0a9577a))
* **auth:** use shared functions instance + fix SW cache version + env file naming ([e034e10](https://github.com/Adedamola-Aina/AnchorOS/commit/e034e10f95f2f46453d730feebfba323047863ed))
* **finance:** cast AnchorTransaction to Record for decryptFields TS compatibility ([9e89bd1](https://github.com/Adedamola-Aina/AnchorOS/commit/9e89bd148695d6ac9a660b1136a7b0c427b74e28))
* **finance:** double-cast via unknown for AnchorTransaction decrypt ([7c636db](https://github.com/Adedamola-Aina/AnchorOS/commit/7c636db456ea24566a912e00163611e1425d456d))
* **finance:** remove duplicate FieldEncryption import in TransferOperations ([ead0064](https://github.com/Adedamola-Aina/AnchorOS/commit/ead006496a0d99584eef91cfb402660258126efc))
* **functions:** add predeploy build hook and fix TS errors in functions ([4b60674](https://github.com/Adedamola-Aina/AnchorOS/commit/4b60674aae4e5475cc43c278238a5af48d87f978))
* **security:** remove style-src-attr 'none' from CSP headers ([4eed7a0](https://github.com/Adedamola-Aina/AnchorOS/commit/4eed7a05fbf89207ba646182b7a0561ffbfec037))
* **security:** resolve 12 typescript errors in passkey, encryption, subscription detector, audit ([6546cca](https://github.com/Adedamola-Aina/AnchorOS/commit/6546ccad7eac4779387611444a80bc1673ce4980))

## [1.15.0-rc.7](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.7) (2026-03-22)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** complete passkey registration with server-side attestation verification ([eacb16f](https://github.com/Adedamola-Aina/AnchorOS/commit/eacb16f4f23ad872cfb7a6dfd76f45deb82974b2))
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

* **auth:** add popupRedirectResolver for Google/Apple sign-in + passkey delete ([9cc6a5e](https://github.com/Adedamola-Aina/AnchorOS/commit/9cc6a5eea9f2bfc3572503a621efd0d5d46180f5))
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

## [1.15.0-rc.6](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.6) (2026-03-22)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** complete passkey registration with server-side attestation verification ([eacb16f](https://github.com/Adedamola-Aina/AnchorOS/commit/eacb16f4f23ad872cfb7a6dfd76f45deb82974b2))
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

## [1.15.0-rc.5](https://github.com/Adedamola-Aina/AnchorOS/compare/v1.14.3...v1.15.0-rc.5) (2026-03-22)


### Features

* **auth:** auth-001 auth-005 sec-004 social sign-in hook + exponential rate limiter ([7a55945](https://github.com/Adedamola-Aina/AnchorOS/commit/7a5594517f8be10c9dfff22984e33fa1b51de6d8))
* **auth:** auth-002 sec-009 wire passkey ui into auth login + settings security screen ([5b62230](https://github.com/Adedamola-Aina/AnchorOS/commit/5b6223071b395e0ad70518ac3c6f67bb9b0f0404))
* **auth:** complete passkey registration with server-side attestation verification ([eacb16f](https://github.com/Adedamola-Aina/AnchorOS/commit/eacb16f4f23ad872cfb7a6dfd76f45deb82974b2))
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
