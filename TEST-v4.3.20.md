# v4.3.20 TEST — Stability Fix

Stability baseline languages:
- English
- Italian
- French
- German

Changes:
- Deterministic four-language loader with English fallback.
- Full external Help renderer with English fallback.
- Cache-busted language resources at v4.3.20.
- Unsupported/stale saved language values fall back to English.
- Reset returns language to English.
- Refresh/update reload uses a timestamped URL to avoid stale page cache.
- Spanish is intentionally excluded from this stability build.
- No Officer database/resource calculation changes intended.

Test:
1. English -> Italian -> French -> German -> English.
2. Open Help in every language.
3. Refresh while each language is selected.
4. Check for updates / refresh latest version.
5. Confirm saved Officer/resource data remains present.
