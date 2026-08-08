# KoW Companion v4.3.16 TEST

## Changes
- Moved English translations into `lang/en.js`.
- Moved Italian translations into `lang/it.js`.
- The app now builds its translation dictionary from separate language files.
- English remains the fallback/default language.
- Unified visible installed/test version references to v4.3.16.

## Test
1. Open Settings and select Italian.
2. Check all tabs, especially Help.
3. Switch back to English and verify all text returns to English.
4. Reload the page and verify the selected language persists.
5. Reset the app/appearance and verify language returns to English where the existing reset control is intended to do so.
6. Check Settings > App Updates shows installed version v4.3.16.
