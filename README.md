# KoW Companion v4.6.0 TEST

**English Test environment — NOT LIVE**

KoW Companion is an Officer development, Inventory, Progress and planning companion for *Kiss of War*. This v4.6.0 Test build is based on the stable v4.5.0 English Live application and is being validated before promotion to Live.

## What's New — v4.6.0 TEST

### Upgrade Targets & Recommendations
The first v4.6.0 milestone adds a non-destructive target calculator for the selected Officer. Set target Level, Stars and Training or choose MAX Officer. The result compares the detected current position with the target and provides the next development gap without spending or altering Inventory.

### Dynamic Officer Data
Officer release data is now separated from core application code. The app reads `officers.json` with no-store caching and reports the current global dataset through `officer-data-version.json` in Settings.

For future Officer releases, update the structured Officer dataset and version manifest rather than changing core calculation code. This is intended to support the four annual Officer release sets with one controlled data publication after testing.

### Native working-state persistence retained
A normal browser refresh should preserve the current working interface state, including selected Officer, current tab, Officer filters, Progress status filters, Compare selections, Planner working rows/resources, Advanced Planner selections, future scenario fields and Resource Optimiser comparison Officer.

Saved Officer profiles, saved plans and Central Inventory remain separate from this temporary working state.

### Correct Legendary chest logic retained
- **Legendary Officer Badge Chest** — each chest is **either 1 Universal Legendary Badge or 600 ORV**. It cannot count as both.
- **Legendary Officer Badge Selection Chest** — each chest gives **1 specific Legendary Officer Badge** for an Officer in the current eligible pool. It does **not** convert to ORV or a Universal Legendary Badge.
- Original Legendary Officers cannot use ORV/SRV seasonal conversion routes.

### Central Inventory order
Inventory follows the approved **Order in List** numbering, not spreadsheet row position:
1. Legendary Officer Badge Chest
2. Legendary Officer Badge Selection Chest
3. ORV
4. SRV
5. Legendary Officer Badge
6. Epic Officer Badge
7. Elite Officer Badge
8. Individual Officer Badges in approved order
9. Elite Stars I–III
10. Epic Stars I–III
11. Legendary Stars I–III
12. XP Books: 100, 500, 1,000, 5,000, 10,000, 20,000 and 50,000

The non-game **50 XP Book** remains removed.

## Confirmed badge totals
- **Legendary:** 10 unlock + 690 Skills + 900 Training = **1,600**.
- **Epic:** 10 unlock + 440 Skills + 4,500 Training = **4,950**.
- **Elite:** 10 unlock + 440 Skills + 18,000 Training = **18,450**.

## Clean v4.6.0 Test deployment architecture
- `index.html` is the v4.6.0 Pages build template.
- `_includes/app-source.html` is the preserved complete application source used during the controlled reset.
- `v460-global-data.js` displays the Global Officer Data status.
- `officers.json` contains published Officer data.
- `officer-data-version.json` identifies the dataset version and Officer count.
- `service-worker.js` is a simple v4.6.0 network-first worker. It does **not** rewrite app versions or HTML at runtime.
- Obsolete custom repair/update GitHub Actions workflows have been removed. Normal GitHub Pages deployment is the only deployment path required.

## Pre-Live QA checklist
- Red banner says **ENGLISH TEST — v4.6.0 — NOT LIVE**.
- Header, Settings, About and Version Integrity consistently report **v4.6.0**.
- Settings shows **Global Officer Data** and the current dataset version.
- App loads normally with no flicker, pulsing or freezes.
- All tabs navigate normally on mobile/tablet and desktop.
- Selected Officer and Officer filters survive refresh.
- Progress filters survive refresh.
- Compare filters and selected Officers survive refresh.
- Planner working rows, Officer selections and requirements survive refresh.
- Resource Optimiser comparison selection survives refresh.
- Badge Chest calculations use Badge or ORV mode, never both.
- Selection Chests provide one eligible specific Officer Badge only and never ORV.
- Original Legendary Officers do not incorrectly use ORV/SRV.
- Inventory follows the approved Order in List.
- No 50 XP Book is shown anywhere.
- Inventory Save feeds the rest of the app.
- Export App Backup and Restore App Backup work correctly.
- Restored data survives reload.
- MAXED / IN PROGRESS / NOT STARTED remain correct.
- Upgrade Targets & Recommendations is non-destructive.

## Backup before testing
Use **Settings → Export App Backup** before destructive or large-scale QA changes. Test Restore using a known-good backup before Live promotion.

## Deployment status
This repository/package is the **English Test** environment and must not be treated as Live until QA passes.

Do not delete the existing `officer-portraits` folder or background assets during root-file updates.

---
**Created by FireStorm (371)**
