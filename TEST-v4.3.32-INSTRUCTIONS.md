# KoW Companion English v4.3.32 TEST

## Purpose
Test the Progress-tab ordering change only.

## Expected Progress order
The table keeps the three status categories in this order:
1. MAXED
2. IN PROGRESS
3. NOT STARTED

Inside each category, Officers must be ordered newest season first:
S7 → S6 → S5 → S4 → S3 → S2 → Original.

Officers in the same season retain the Officer database order in the main Progress table.

## Test checks
1. Upload this package to KoW-Companion-Test only.
2. Hard refresh / use a cache-busting refresh parameter.
3. Confirm the app reports v4.3.32.
4. Open Progress with all three status filters enabled and verify each category is newest-first.
5. Test each status filter individually: MAXED, IN PROGRESS, NOT STARTED.
6. Check Compare Officer Progress: seasons should also appear newest-first.
7. Confirm existing Officer progress values and individual Officer Badges Held are unchanged.
8. Confirm Backup & Restore still works; this build does not change its storage schema.

Do not upload to LIVE until the ordering has been confirmed.
