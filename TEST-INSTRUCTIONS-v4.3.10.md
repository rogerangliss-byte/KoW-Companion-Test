# KoW Companion v4.3.10 TEST

## Language persistence change
- Language is now stored under the stable browser key `kow_language`, independent of app version.
- Existing v4.3.9 language choice is migrated automatically.
- Refreshing/reopening the app keeps the selected language.
- Backup & Restore includes the language because the backup captures app localStorage.
- Default remains English when no language has ever been selected.

## Test
1. Open Settings and select Italian.
2. Refresh the page: Italian should remain selected.
3. Close and reopen the browser/app: Italian should remain selected.
4. Switch to English, refresh, and confirm English remains selected.
5. Create a backup while Italian is selected, change to English, restore the backup, refresh, and confirm Italian is restored.
