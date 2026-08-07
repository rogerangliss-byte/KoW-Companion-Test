# Changelog

## v4.2.6 TEST — Officer Portrait Filename Fix
- Fixed the remaining Officer portrait loading issue.
- The existing `officer-portraits` folder uses filenames such as:
  - `s7-liora.jpg`
  - `s7-roisin.jpg`
  - `s6-regina.jpg`
  - `katherine.jpg`
- The app was incorrectly requesting names with an extra `officer-` prefix.
- v4.2.6 now requests the exact filenames already stored in the folder.
- No Officer images are included in this package.
- Existing Season and Officer Type / Role filters are unchanged.
