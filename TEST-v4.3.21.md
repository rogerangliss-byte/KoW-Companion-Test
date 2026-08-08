# KoW Companion TEST v4.3.21

Language loading stability fix.

- Loads English, Italian, French and German language files before the application module.
- Adds all four language files to the service-worker application cache.
- Advances the service-worker cache key to `kow-v4.3.21-test` so older cached builds are discarded.
- Keeps the existing translated Help content for all four languages.
