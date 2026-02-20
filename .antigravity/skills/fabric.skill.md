# Fabric AI Features — On-Demand Skill

Load this when working on Fabric v1.5 or v2.0 features.

## Fabric Architecture
- Fabric is AnchorOS's AI-powered productivity layer
- v1.5: Contextual AI suggestions based on current screen
- v2.0: Behavioral learning + predictive suggestions

## Key Files
- src/features/fabric/ — Fabric UI components
- src/services/fabricService.ts — AI API calls
- shared/types/fabric.ts — Shared type definitions

## Fabric v2.0 Constraints
- Behavioral data stored per-user in Firestore (never shared)
- Predictions generated client-side where possible (privacy-first)
- Fabric suggestions are dismissible and never blocking UX
- Every AI call has a fallback non-AI path

## Anti-Patterns Specific to Fabric
- Never send raw transaction data to AI APIs — anonymize first
- Never block UI rendering waiting for AI response
- Never store AI suggestions permanently — they are ephemeral
