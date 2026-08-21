# KoW Companion v4.6.0 TEST — Release Notes

**ENGLISH TEST — NOT LIVE**

v4.6.0 is based on the stable v4.5.0 English Live application and introduces Upgrade Targets & Recommendations plus the Dynamic Officer Data framework.

## v4.6.0 additions
- Upgrade Targets & Recommendations for the selected Officer, initially non-destructive.
- Dynamic Officer dataset in `officers.json`.
- Versioned Officer-data manifest in `officer-data-version.json`.
- Settings status for the currently published global Officer dataset.
- Clean v4.6.0 service worker with no runtime HTML/version rewriting.

## Controlled reset
The English Test deployment was cleaned after failed one-shot repair workflows. Obsolete custom Actions workflows were removed and the full existing app was preserved as the build source while `index.html` now produces the v4.6.0 Test identity consistently during the GitHub Pages build.

## QA gate
Do not promote to Live until the banner, header, Settings, About and Version Integrity all report v4.6.0, Global Officer Data loads, normal navigation works, saved state survives refresh, and the v4.5.0 core calculations remain regression-free.
