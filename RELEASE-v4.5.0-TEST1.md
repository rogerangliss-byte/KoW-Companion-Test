# KoW Companion v4.5.0 TEST 1

## Corrected chest rules
- Legendary Officer Badge Chest: 1 chest gives either 1 Universal Legendary Officer Badge or 600 Officer Readiness Vouchers (ORV).
- Legendary Officer Badge Selection Chest: 1 chest gives 1 eligible individual Officer Badge only. It has no ORV option and does not become a Universal Badge.

## New planning features
- Smart Resource Shortfall with Fully Funded / Partially Funded / Shortfall status.
- Correct handling of Individual Officer Badges, eligible Selection Chests, Universal Badges, Badge Chests and ORV.
- Resource Optimiser Officer selector is populated from the canonical Officer selector without a MutationObserver loop.
- Development output is reconciled to the corrected chest rules.

## Repository cleanup
- Removed the obsolete TEST 2 optimiser fix file.
- Removed temporary GitHub Actions patch/rebuild workflows.
- Removed the empty download file and obsolete v4.4/v4.5 planning notes.
- Service worker returned to a simple network-first cache with no HTML rewriting.

TEST only — do not publish to English Live until user approval.
