# KoW Companion v4.6.0 LIVE — Hotfix 3

Fixes the regressed Edit Officer Progress behaviour.

- Edit Officer → MAX Officer now delegates to the existing, proven main MAX Officer action.
- This preserves the same confirmation popup, MAX logic, save/persistence, refresh and success popup as the main Officer screen.
- Entering a positive Current Star Level or Current Officer Level automatically marks the Officer as unlocked.
- Skill Strand availability recalculates immediately from the edited Star level:
  - 0★: Strand 1
  - 1★: Strands 1–2
  - 2★: Strands 1–3
  - 3★+: Strands 1–4
- Opening Edit Officer also repairs an inconsistent saved state where progress exists but Officer Unlocked is not checked.
- No Inventory, Planner, Officer database, forecast, resource or storage-schema rules changed.
