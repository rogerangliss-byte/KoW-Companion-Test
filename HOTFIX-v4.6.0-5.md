# KoW Companion v4.6.0 TEST — Hotfix 5

Edit Officer Progress regression correction.

- 0★ + Officer Level 1 remains locked.
- Any Star progress above 0★ OR Officer Level above 1 automatically checks Officer Unlocked immediately.
- Strand availability updates immediately inside Edit Officer:
  0★ = Strand 1; 1★ = Strands 1–2; 2★ = Strands 1–3; 3★+ = all four.
- Edit Officer → MAX Officer calls the exact same maxSelectedOfficerProfile() routine as the working outside MAX Officer button.
- No second MAX implementation exists inside the Edit modal.
