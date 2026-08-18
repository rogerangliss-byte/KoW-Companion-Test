# KoW Companion — User Guide
## v4.5.0 TEST 1

### Recommended workflow
1. **Inventory first** — enter and save all resources currently held.
2. **Officer** — enter and save each Officer's current progress.
3. **Progress** — verify MAXED, IN PROGRESS and NOT STARTED status.
4. **Releases** — review the recurring schedule and future cost forecast.
5. **Planner** — run Smart Resource Shortfall, Resource Optimiser or Advanced Multi-Officer Planning.
6. Review current-versus-future readiness before spending flexible resources.

## Correct Legendary chest rules

### Legendary Officer Badge Chest
Each **Legendary Officer Badge Chest** gives **either**:
- **1 Universal Legendary Officer Badge**, or
- **600 Officer Readiness Vouchers (ORV)**.

A Badge Chest cannot count as both. **Optimise automatically** may choose the more efficient route for an eligible seasonal Legendary Officer.

### Legendary Officer Badge Selection Chest
Each **Legendary Officer Badge Selection Chest** gives **1 eligible individual Officer Badge only**.
- It has **no ORV option**.
- It does **not** become a Universal Legendary Badge.
- It only applies when the selected Officer is in the current Selection Chest pool.

### Officer restrictions
- Original Legendary Officers cannot use ORV or SRV.
- Seasonal Legendary Officers from S2 onward may use ORV/SRV where their published Officer data allows it.
- Epic and Elite Officers use their own Universal Badges and Stars and cannot use SRV.

## Smart Resource Shortfall
The v4.5 Smart Resource Shortfall is preview-only. It applies badge resources in a controlled planning calculation and reports **Fully Funded**, **Partially Funded**, or **Shortfall**.

The calculation considers:
1. Individual Officer Badges.
2. Eligible Legendary Officer Badge Selection Chests.
3. Universal rarity badges.
4. Legendary Officer Badge Chests using the selected Badge Chest strategy.
5. ORV where the selected Officer is eligible.

No Inventory is deducted by this preview.

## Resource Optimiser
Use **Compare with Officer** to compare the selected Officer with another Officer by ORV cost per Badge. The Officer selector is populated from the same canonical Officer list used by the Officer screen.

Where both Officers can use ORV, favour ORV on the Officer with the lower ORV-per-Badge cost and preserve flexible Universal Legendary Badges / Legendary Officer Badge Chests for the more ORV-expensive Officer where practical.

## Advanced Multi-Officer Planning

### Planning Session
- **Saved Officers only**: current saved candidates only.
- **All Officer sessions**: projected future scenarios plus saved/current candidates.
- **Next Officer session**: next recurring release.
- **October — Rally / Garrison**
- **January — Infantry**
- **April — Tanks**
- **July — Tank Destroyers**

A specific future session intentionally shows only its projected target. Example: **April — Tanks** shows **S8 Tank — PROJECTED**.

### Officer Session / Season
Filter saved/current candidates by All Sessions, Original, S2, S3, S4, S5, S6 or S7.

### Future Officer Type / Officer Type
Use the session default or select Rally, Garrison, Infantry, Tank or Tank Destroyer. Season and Type can be combined, for example **S6 + Tank**.

### Optional toggles
- **Include Not Started** adds eligible NOT STARTED Officers.
- **Include Original Officers** adds Original Officers where applicable.
- MAXED Officers are always excluded.

### Running the report
Press **Analyse Planning Session**. Use **Refresh Recommendation** after changing saved Progress or Inventory. Large Saved/All reports show the Top 10 initially; use **Show all** and **Collapse** as required.

## Future Officer Planning
A **PROJECTED** Officer is a planning placeholder and is not added to the published Officer database.

### Established Legendary Officer resource totals
| Scenario | Badges | Star value | XP |
|---|---:|---:|---:|
| 1 Officer | 1,600 | 98,000 | 199,646,700 |
| 2 Officers | 3,200 | 196,000 | 399,293,400 |

The Planner compares these totals against held Inventory.

### ORV/SRV forecasts
The Releases field **Forecast increase per Officer release (%)** controls forecast growth. Future ORV/SRV values are estimates and remain labelled **FORECAST** until published costs are known.

## Releases integration
The Releases **Future Officer Cost Forecast** includes an **Advanced Future Officer Planning** note and **Open Advanced Planner** button.

## Important
- Planning tools are preview-only.
- They do not deduct Inventory.
- They do not change saved Officer progress.
- MAXED Officers are excluded where appropriate.
- Future ORV/SRV values are forecasts, not published costs.
- This repository is **English Test only** until v4.5.0 is approved for Live.
