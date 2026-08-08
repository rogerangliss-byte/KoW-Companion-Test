# v4.3.18 TEST — Language File Cache Fix

- Adds versioned URLs to lang/en.js and lang/it.js so GitHub Pages/browser caches cannot serve older language files.
- Restores Help content loaded from external language files.
- Adds a visible fallback message if a language resource fails to load.
- No calculator, officer, resource, saved-progress or language-persistence logic changes.
