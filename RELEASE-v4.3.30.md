# KoW Companion v4.3.30 TEST — Backup & Restore Data Sync Fix

This TEST build fixes cross-device backup/restore completeness.

## Fixed
- Export now saves the currently displayed Officer profile before creating the JSON backup.
- `Officer Badges Held` is therefore captured even when it was the most recently edited field and the user had not switched Officer or pressed Save Progress.
- Officer progress fields now auto-save while editing: stars, unlock state, skill strands, training, Officer Badges Held, Officer level, target level and development goal.
- Shared resources (ORV, SRV, Universal Legendary Badges, Selection Chests, Exclusive Stars and XP Books) auto-save as well.
- Restore now clears the target device's existing localStorage before importing the source backup, preventing stale target-device keys from surviving the restore.
- Restore confirms that Officer profiles and Officer Badges Held were imported before reload.

## Test method
1. On Device A, change Officer Badges Held for several Officers, including the currently selected Officer.
2. Do not press Save Progress for the last Officer.
3. Export App Backup.
4. On Device B, Restore App Backup using that JSON file.
5. Check the same Officers and confirm their Officer Badges Held values, skills, training, stars and levels match Device A.
6. Confirm shared ORV/SRV/badges/chests/stars/XP also match Device A.
