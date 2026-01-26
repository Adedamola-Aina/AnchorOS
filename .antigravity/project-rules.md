# ANCHOR OS - AI PROJECT RULES

## Project Context
- **Name**: Anchor OS
- **Type**: Self-hosted personal finance & productivity system
- **Stack**: TypeScript, React, Vite, Firebase, Tailwind CSS
- **Deployment**: LXC 107 (Proxmox), Tailscale-only access
- **Users**: 12 family members (75% mobile, 25% desktop)

## Development Philosophy
- **Test-First**: Write tests before implementation (TDD mandatory)
- **Security-First**: Zero-trust, validate everything
- **Mobile-First**: Optimize for mobile, maintain desktop
- **Privacy-First**: Self-hosted, no tracking

## Critical Documents (Read Before ANY Work)
1. `docs/PROJECT_STATUS.md` - Current state, priorities
2. `docs/KNOWN_ISSUES.md` - Active bugs (don't reintroduce)
3. `docs/ROADMAP.md` - Priorities, dependencies
4. `docs/DEPLOYMENT_STATUS.md` - What's deployed where
5. `CLAUDE.md` - Development constitution

## Before Generating Code
- ✅ Read PROJECT_STATUS.md
- ✅ Check KNOWN_ISSUES.md
- ✅ Verify ROADMAP.md priority
- ✅ Check DEPENDENCIES.md
- ✅ Review relevant CLAUDE.md section

## After Generating Code
- ✅ Update PROJECT_STATUS.md
- ✅ Update CHANGELOG.md
- ✅ Update KNOWN_ISSUES.md (if bug fixed)
- ✅ Update DEPLOYMENT_STATUS.md (if deployed)
- ✅ Run tests
- ✅ Deploy to staging first

## Forbidden Actions
- ❌ Start work without reading docs
- ❌ Finish work without updating docs
- ❌ Deploy to production without staging validation
- ❌ Reintroduce bugs from KNOWN_ISSUES.md
- ❌ Build features conflicting with roadmap
- ❌ Skip writing tests
