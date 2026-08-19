# KoW Companion v4.5.0 TEST

**English Test environment — NOT LIVE**

KoW Companion is an Officer development, Inventory, Progress and planning companion for *Kiss of War*. This v4.5.0 Test build is based on the stable v4.4.0 English Live application and is being validated before promotion to Live.

## v4.5.0 Test objective

v4.5.0 focuses on making planning more accurate, persistent and easier to use while correcting the two different Legendary chest rules. The Test build should retain the stability, backup/restore behaviour and saved Officer data of the v4.4.0 baseline.

## What's New — v4.5.0 TEST

### Native working-state persistence

The current working interface state is saved locally so a normal browser refresh should not unnecessarily return the app to its defaults.

The v4.5.0 Test persistence covers:

- selected Officer;
- Officer Search, Season, Rarity and Role filters;
- current app page/tab;
- Officer Progress status filters: MAXED, IN PROGRESS and NOT STARTED;
- Compare Officer Progress status filters and selected Officers;
- Multi-Officer Planner working rows, Officer selections and badge requirements;
- Multi-Officer Planner resource fields and chest strategy;
- Advanced Planner/session selections;
- Future scenario working fields; and
- Resource Optimiser comparison Officer.

Saved Officer profiles, saved plans and Central Inventory remain separate from this temporary working-interface state.

### Correct Legendary chest logic

v4.5.0 distinguishes the two chest types explicitly:

- **Legendary Officer Badge Chest** — each chest may be used as **either 1 Universal Legendary Badge or 600 Officer Readiness Vouchers (ORV)**. A chest cannot count as both.
- **Legendary Officer Badge Selection Chest** — each chest gives **1 specific Legendary Officer Badge** for an Officer currently available in that chest. It **does not convert to ORV or a Universal Legendary Badge**.

Selection Chests are only applied where the selected Officer is eligible for the current Selection Chest pool.

### Resource Optimiser — Preview

The Planner includes a Resource Optimiser preview. Select a second Officer in **Compare with Officer** to compare badge efficiency, including Officer Readiness Voucher cost per Officer Badge where applicable.

The Optimiser is a preview only: it does not spend or alter saved resources.

### Multi-Officer Upgrade Planner

The Multi-Officer Planner supports a priority list of Officers and previews how shared badge resources could be allocated without changing normal saved Inventory.

It includes:

- named plans;
- multiple Officer rows;
- per-Officer badge requirements;
- row priority/order controls;
- shared ORV;
- Universal Legendary Badges;
- Legendary Officer Badge Chests;
- Legendary Officer Badge Selection Chests; and
- selectable Badge Chest strategy.

### Inventory ordering update

The Central Inventory has been reorganised to follow the approved game-reference **Order in List** rather than spreadsheet row position.

The intended structure is:

1. Legendary Officer Badge Chest
2. Legendary Officer Badge Selection Chest
3. Officer Readiness Vouchers (ORV)
4. Star Readiness Vouchers (SRV)
5. Universal Legendary Officer Badges
6. Universal Epic Officer Badges
7. Universal Elite Officer Badges
8. Individual Officer Badges in the approved Order in List
9. Elite Stars I, II and III
10. Epic Stars I, II and III
11. Legendary Stars I, II and III
12. Officer XP Books

The obsolete/non-game **50 XP Book** entry has been removed. Supported XP Book denominations are **100, 500, 1,000, 5,000, 10,000, 20,000 and 50,000 XP**.

### Progress and Compare

Officer Progress continues to classify all Officers as:

- MAXED;
- IN PROGRESS; or
- NOT STARTED.

Shared Inventory does not artificially increase an Officer's saved progress percentage. Compare Officer Progress uses actual saved Officer progress and allows selected Officers to be compared directly.

## Existing v4.4.0 planning features retained

The v4.5.0 Test build retains the v4.4.0 planning functionality, including:

- Planning Readiness Dashboard for saved future-Officer scenarios;
- separate Badge, Star and XP readiness percentages;
- overall readiness based on the limiting resource;
- Priority Target and Suggested Next Action;
- Open in Planner shortcuts;
- future session planning for October, January, April and July;
- Season and Officer Type reports;
- projected resources for future Legendary Officers;
- ORV/SRV forecasting linked to Releases growth assumptions; and
- exclusion of MAXED Officers from recommendations where appropriate.

## Officer rarities and confirmed badge totals

KoW Companion supports Legendary, Epic and Elite Officers.

- **Legendary:** 10 unlock + 690 Skills + 900 Training = **1,600 badges to MAX**.
- **Epic:** 10 unlock + 440 Skills + 4,500 Training = **4,950 badges to MAX**.
- **Elite:** 10 unlock + 440 Skills + 18,000 Training = **18,450 badges to MAX**.

Original Legendary Officers cannot use ORV/SRV seasonal conversion routes. Epic and Elite Officers use their own rarity-specific Stars and badge logic.

## Recommended QA before Live

Please verify the following in the English Test site before v4.5.0 is promoted:

- app loads normally with no flicker, pulsing or freezes;
- all tabs navigate normally on mobile/tablet and desktop;
- selected Officer survives a browser refresh;
- Officer Search/Season/Rarity/Role filters survive refresh;
- Progress status filters survive refresh;
- Compare filters and selected Officers survive refresh;
- Planner working rows, Officer selections and badge requirements survive refresh;
- Resource Optimiser Officer selection survives refresh;
- Legendary Badge Chest calculations correctly use either Badge or ORV mode, never both;
- Selection Chests provide one eligible specific Officer Badge only and never ORV;
- Original Legendary Officers do not incorrectly use ORV/SRV;
- Inventory appears in the approved Order in List;
- no 50 XP Book is shown anywhere;
- Inventory Save works and values are used throughout the app;
- Export App Backup creates a backup successfully;
- Restore App Backup imports Officer profiles, individual Officer Badges and shared resources correctly;
- restored data survives reload;
- MAXED / IN PROGRESS / NOT STARTED classifications remain correct;
- version header, Settings, About and Version Integrity consistently report **v4.5.0 TEST**; and
- the red Test banner remains visible so this build cannot be mistaken for Live.

## Backup before testing

Before destructive or large-scale QA changes, use **Settings → Export App Backup**. Restore should be tested with a known-good backup before Live promotion.

## Deployment status

This repository is the **English Test** environment. It must not be treated as the Live release until the v4.5.0 QA checklist has passed.

Officer portrait and background assets are maintained separately from normal root-file updates; do not delete the existing `officer-portraits` folder or background assets during deployment.

## Documentation

- `README.md` — release overview and pre-Live QA checklist.
- `USER-GUIDE.md` — comprehensive in-app usage guidance.
- `CHANGELOG.md` — version history.
- `RELEASE-v4.5.0-TEST1.md` — Test baseline/release notes.

---

**Created by FireStorm (371)**
