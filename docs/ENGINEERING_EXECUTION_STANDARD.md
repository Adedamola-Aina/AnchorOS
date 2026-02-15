# Engineering Execution Standard - Anchor OS

**Version**: 1.0  
**Effective Date**: 2026-01-27  
**Status**: MANDATORY - All implementations must follow this standard  
**Authority**: Product Owner Directive

---

## 🎯 Mandate

> **"Every implementation, bug fix, or action must follow a thorough and detailed process that covers all aspects of the implementation. No half-assing or cutting corners."**  
> — Product Owner, 2026-01-27

This standard establishes ARCH-003 (Service Layer Tests) as the **baseline quality level** for major architecture work in Anchor OS.

## 📌 Applicability

This 7-Phase standard applies to **ARCH-XXX architecture items** and major cross-cutting initiatives. It extends (not replaces) the mandatory 4-Phase workflow defined in `.github/.agent/rules/00-WORKFLOW.md`.

| Work Type | Process |
|-----------|--------|
| ARCH-XXX architecture items | 7-Phase (this document) |
| Features, bug fixes, refactors | 4-Phase (`.github/.agent/rules/00-WORKFLOW.md`) |
| Docs, config, tooling | 4-Phase with stated TDD exception |

The 4-Phase workflow (GATHER → PLAN → BUILD → CLOSE) is always the outer loop. This standard adds depth within Phase 3 (BUILD) for architecture work.

---

## 📋 Core Principle

**If it's worth doing, it's worth doing completely.**

Every piece of work—whether a new feature, bug fix, refactor, or enhancement—must be:
- ✅ **Comprehensively planned** with detailed task breakdown
- ✅ **Thoroughly tested** with 100% pass rate and coverage metrics
- ✅ **Properly verified** through multiple validation phases
- ✅ **Fully documented** with walkthroughs and metrics
- ✅ **Production-ready** before marked as complete

---

## 🏗️ The 7-Phase Standard

Based on ARCH-003, every significant work item must follow these phases:

### Phase 0: Planning & Assessment
**Deliverable**: Implementation plan + Task checklist

- [ ] Review existing code/documentation
- [ ] Identify all requirements and constraints
- [ ] Reference applicable standards:
  - [ ] [CLAUDE.md](file:///root/anchor-os/CLAUDE.md) - Engineering Constitution
  - [ ] [TESTING_STRATEGY.md](file:///root/anchor-os/docs/TESTING_STRATEGY.md) - Test requirements
  - [ ] [ERROR_HANDLING.md](file:///root/anchor-os/docs/ERROR_HANDLING.md) - Error patterns
  - [ ] ARCH-001 mandate - 200-line max per file rule
  - [ ] Domain-specific standards (as applicable)
- [ ] Create detailed task checklist (arch_XXX_task.md)
- [ ] Create implementation plan (arch_XXX_plan.md)
- [ ] Break down into phases with clear deliverables
- [ ] Identify test requirements (unit, integration, E2E)
- [ ] Define success metrics and coverage targets

**Standard**: Use git conventional commits to track all work (`feat:`, `fix:`, `refactor:`, etc.)

---

### Phase 1-N: Implementation Phases
**Deliverable**: Working code + Tests for each phase

For each implementation phase:

#### Code Implementation
- [ ] Follow TDD (Red-Green-Refactor) per TESTING_STRATEGY.md
- [ ] Write tests FIRST, then implementation
- [ ] Comply with ARCH-001 (200-line maximum per file)
- [ ] Follow ERROR_HANDLING.md patterns
- [ ] Use TypeScript strict mode
- [ ] Follow AAA pattern for tests (Arrange-Act-Assert)

#### Per-Phase Verification
- [ ] All new tests pass (100% pass rate required)
- [ ] No regression in existing tests
- [ ] Lint clean (zero errors in new code)
- [ ] TypeScript compilation successful
- [ ] Git commit with descriptive message

#### Phase Commit Standard
```
<type>: <scope>: <description>

<detailed explanation>
- Specific change 1
- Specific change 2
- Test results (X/X passing)

Part of <ARCH-XXX> Phase <N>.
```

**Example**: See ARCH-003 commits (`fbb214a`, `cd478ca`, `05c32c2`, `2512cfa`, `4778e11`)

---

### Phase N+1: Documentation
**Deliverable**: Comprehensive documentation

Required Documentation:
- [ ] **README** (if applicable) - Usage guide for the feature/module
- [ ] **Walkthrough** (arch_XXX_walkthrough.md) - Implementation narrative
  - [ ] Executive summary with metrics
  - [ ] Phase-by-phase breakdown
  - [ ] Code examples
  - [ ] Test results
  - [ ] Coverage analysis
  - [ ] Impact assessment
- [ ] Update **TESTING_STRATEGY.md** with new patterns (if applicable)
- [ ] Create conventional commit with appropriate prefix (`feat:`, `fix:`, etc.)
- [ ] Capture screenshots/recordings (if UI work)

**Standard**: Walkthroughs must be 400+ lines with comprehensive detail (see arch_003_walkthrough.md - 574 lines)

---

### Phase N+2: Verification
**Deliverable**: Evidence of production-readiness

#### Test Verification
- [ ] Run ALL tests (unit + integration + E2E)
- [ ] Verify 100% pass rate across all test suites
- [ ] Document execution times (must meet SLAs)
- [ ] Zero flaky tests tolerated

#### Coverage Verification
- [ ] Generate coverage report (`npm run test:coverage`)
- [ ] Verify coverage meets targets:
  - [ ] Statement Coverage: 80%+
  - [ ] Branch Coverage: 70%+
  - [ ] Function Coverage: 90%+
  - [ ] Line Coverage: 80%+
- [ ] Document actual coverage metrics
- [ ] Explain any uncovered lines

#### Quality Verification
- [ ] Run linter (`npm run lint`)
- [ ] Zero lint errors in new code
- [ ] Document any pre-existing lint issues
- [ ] Production build successful
- [ ] Test in production mode

#### Integration Verification
- [ ] Test feature in actual application
- [ ] Verify no regressions in related features
- [ ] Test on mobile (iOS Safari) if UI work
- [ ] Test dark mode if UI work
- [ ] Verify accessibility (ARIA labels, keyboard nav)

---

## 📊 Deliverables Checklist

Every completed work item must have:

### 1. Task Artifacts
- ✅ `arch_XXX_task.md` - Comprehensive task checklist (150+ lines)
- ✅ `arch_XXX_plan.md` - Implementation plan (if applicable)
- ✅ `arch_XXX_walkthrough.md` - Detailed walkthrough (400+ lines minimum)

### 2. Code Artifacts
- ✅ Implementation files (all < 200 lines per ARCH-001)
- ✅ Test files (comprehensive coverage)
- ✅ README (if applicable)

### 3. Evidence Artifacts
- ✅ Coverage report (with metrics documented)
- ✅ Test results (100% pass rate)
- ✅ Screenshots/recordings (if UI work)
- ✅ Git commits (one per phase)

### 4. Tracking & Attribution
- ✅ Conventional commits for all changes
- ✅ Git tags for version bumps (automated via CI)

---

## 🎯 Success Criteria

Work is only "Complete" when ALL of the following are true:

### Code Quality
- ✅ 100% test pass rate (no failing tests)
- ✅ 80%+ coverage across all metrics
- ✅ Zero lint errors in new code
- ✅ Production build successful
- ✅ ARCH-001 compliant (all files < 200 lines)

### Testing Quality
- ✅ Unit tests for all business logic
- ✅ Integration tests for critical paths
- ✅ E2E tests for user flows (if UI work)
- ✅ All tests follow AAA pattern
- ✅ Performance SLAs met (< 100ms unit, < 1s integration)

### Documentation Quality
- ✅ Comprehensive walkthrough (400+ lines)
- ✅ Task checklist (150+ lines)
- ✅ All phases documented
- ✅ Coverage metrics documented
- ✅ Impact assessment included

### Production Readiness
- ✅ Verified in production mode
- ✅ No known bugs or issues
- ✅ Mobile-tested (if UI)
- ✅ Accessibility-verified (if UI)
- ✅ Can be deployed without concerns

**If ANY criterion is not met, the work is NOT complete.**

---

## 🚫 Anti-Patterns (Forbidden)

The following practices are **explicitly forbidden**:

❌ **"Ready for review"** without full verification  
❌ Marking work complete with failing tests  
❌ Skipping coverage analysis  
❌ Minimal documentation (< 400 lines walkthrough)  
❌ No task checklist  
❌ Skipping verification phase  
❌ "Works on my machine" without production testing  
❌ Cutting corners on any phase  
❌ "Good enough" mentality  

**Consequence**: Work will be returned for completion to standard.

---

## 📚 Reference Implementations

### Gold Standard: ARCH-003
**What**: Service Layer Tests

**Metrics**:
- 7 phases completed
- 84 tests (100% pass rate)
- 95.13% statement coverage
- 100% function coverage
- 574-line walkthrough
- 165-line task checklist
- Production-ready status

### Upgrade in Progress: ARCH-002
**What**: Feature Error Boundaries  
**Status**: Being upgraded from incomplete to ARCH-003 standard  
**Shows**: How to retroactively apply this standard to existing work

---

## 🔄 Workflow Integration

### For New Features
1. Create `arch_XXX_plan.md` and `arch_XXX_task.md`
2. Get user approval on plan
3. Execute phases 1-N (implementation)
4. Execute phase N+1 (documentation)
5. Execute phase N+2 (verification)
6. Update all project documentation
7. Mark as "Production-Ready"

### For Bug Fixes
Same process, but:
- Phase 0 includes root cause analysis
- Add regression tests
- Verify bug is actually fixed (not masked)
- Document prevention strategy

### For Refactors
Same process, but:
- Phase 0 includes impact analysis
- Must maintain 100% test pass rate throughout
- Document performance improvements (if applicable)
- Verify no behavioral changes

---

## 🎓 Reference Documents

Follow all guidance from:

1. **CLAUDE.md** — Agent instructions and mandatory 4-Phase workflow
2. **`.github/.agent/rules/`** — Workflow, identity, technical mandates, anti-patterns
3. **`docs/TESTING_STRATEGY.md`** — Test categories, coverage goals, AAA pattern, performance SLAs
4. **`docs/ERROR_HANDLING.md`** — AnchorError usage, error boundaries, user-facing messages
5. **`.github/.agent/workflows/deploy.md`** — Deployment checklist and verification

---

## 💡 Key Insights from ARCH-003

### What Made ARCH-003 Excellent

1. **Systematic Phasing**: Each phase had clear deliverables and verification
2. **Comprehensive Testing**: Unit + Integration + Coverage analysis
3. **Detailed Documentation**: 574-line walkthrough with code examples
4. **Metrics-Driven**: All targets documented and exceeded
5. **Production Verification**: Not just "works", but "production-ready"
6. **No Compromises**: Every checkbox completed, every metric met

### Lessons Learned

1. **Documentation is NOT overhead** - It's proof of completeness
2. **Coverage metrics matter** - 95%+ coverage catches edge cases
3. **Verification phase is critical** - Testing the tests validates quality
4. **Task checklists prevent oversights** - 165-line checklist ensured nothing missed
5. **Walkthroughs enable knowledge transfer** - Future developers can understand decisions

---

## 🎯 Application Guide

### When This Standard Applies

**Full 7-Phase process** (this document):
- ✅ Architecture improvements (ARCH-XXX items)
- ✅ Major cross-cutting refactors
- ✅ New infrastructure or service patterns

**4-Phase workflow only** (`.github/.agent/rules/00-WORKFLOW.md`):
- Features, bug fixes, refactors
- Documentation-only changes
- Configuration changes
- Simple one-line fixes

The 4-Phase workflow applies to ALL work. This standard adds additional rigor for architecture items.

---

## 📈 Measuring Compliance

Every completed work item will be evaluated on:

| Category | Weight | Criteria |
|----------|--------|----------|
| **Code Quality** | 25% | Tests pass, lint clean, ARCH-001 compliant |
| **Test Coverage** | 25% | 100% pass, 80%+ coverage, E2E if UI |
| **Documentation** | 25% | Walkthrough 400+ lines, metrics documented |
| **Verification** | 25% | Production-tested, all criteria met |

**Minimum Score for "Complete"**: 100%

Anything less is returned for completion to standard.

---

## 🚀 Benefits

This standard ensures:

1. **Reliability**: 100% test pass rate prevents regressions
2. **Maintainability**: Comprehensive docs enable future changes
3. **Confidence**: Production verification eliminates surprises
4. **Quality**: Coverage metrics ensure thorough testing
5. **Knowledge Transfer**: Walkthroughs preserve decisions
6. **Professionalism**: Work is production-ready, not "good enough"

---

## ✅ Compliance Checklist

Before marking ANY work as complete:

- [ ] All phases in task checklist completed
- [ ] 100% test pass rate achieved
- [ ] Coverage targets met (80%+ across all metrics)
- [ ] Zero lint errors in new code
- [ ] Walkthrough written (400+ lines minimum)
- [ ] All metrics documented
- [ ] Verification phase completed
- [ ] Production build tested
- [ ] All project docs updated
- [ ] Git commits for each phase
- [ ] Can confidently say "Production-Ready"

**If you can't check ALL boxes, the work is NOT complete.**

---

## 📞 Questions?

Review the reference implementations:
- **ARCH-003**: Service Layer Tests (see metrics in Reference Implementations section above)

When in doubt, **default to higher quality**.

---

**Effective**: 2026-01-27  
**Status**: MANDATORY  
**Enforcement**: ALL future engineering work

**No exceptions. No shortcuts. No compromises.**
