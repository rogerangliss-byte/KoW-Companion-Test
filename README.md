# KoW Companion v4.5.0 TEST 1

English Test environment for KoW Companion. This repository is **not Live**.

## v4.5.0 TEST 1
- Correct Legendary Officer Badge Chest rule: **1 Universal Legendary Officer Badge OR 600 ORV**.
- Correct Legendary Officer Badge Selection Chest rule: **1 eligible individual Officer Badge only**; no ORV option.
- Smart Resource Shortfall shows **Fully Funded / Partially Funded / Shortfall** and the remaining badge requirement.
- Resource Optimiser uses the canonical Officer selector and no MutationObserver refresh loop.
- Original Legendary Officers remain ineligible for ORV/SRV.
- Epic and Elite rarity restrictions remain unchanged.

## Repository cleanup
- Removed temporary TEST 2/TEST 3 workflow rewriting.
- Removed the separate optimiser-fix file.
- Removed obsolete temporary planning/release files and the empty `download` file.
- Service worker is network-first and no longer rewrites HTML.

## Test rule
Do not copy this build to English Live until the v4.5.0 feature and regression QA has been approved.

See `RELEASE-v4.5.0-TEST1.md` for the test-build summary and `USER-GUIDE.md` for the full application guide.
