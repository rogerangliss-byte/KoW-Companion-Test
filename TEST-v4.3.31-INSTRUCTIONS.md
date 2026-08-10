# KoW Companion English v4.3.31 TEST

## Fix under test
Officer names that already include the season prefix no longer receive a second prefix in display text or progress-save/reset alerts.

Examples:
- `S7 Liora` displays as `S7 Liora`, not `S7 S7 Liora`.
- The same rule applies to all S2-S7 Officers.
- Original Officers remain unchanged.

## Test
1. Upload this ZIP to the Test repository only.
2. Hard refresh the Test app.
3. Select S7 Liora and press Save Progress.
4. Confirm the alert says `S7 Liora progress saved.`
5. Check Quick Progress, Max Officer, Reset Progress and Progress Comparison labels.
6. Confirm backup/restore still works; this fix does not change storage keys or backup schema.
