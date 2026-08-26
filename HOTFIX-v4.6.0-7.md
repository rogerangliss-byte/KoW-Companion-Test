# KoW Companion v4.6.0 TEST — Hotfix 7

Rebuilt directly from English v4.6.0 LIVE HOTFIX-2.

This fixes the Edit Officer regression using direct control-level event handlers so the UI
updates immediately while editing, before Save Progress.

Expected live behaviour:
- 0★ + Level 1 may remain locked.
- Star >0 OR Officer Level >1 immediately checks Officer Unlocked.
- 0★ unlocked = Strand 1.
- 1★ unlocked = Strands 1–2.
- 2★ unlocked = Strands 1–3.
- 3★+ unlocked = all four Strands.
- Edit Officer MAX uses the exact main maxSelectedOfficerProfile() routine used by the working outside MAX button.
- Banner visibly reads ENGLISH TEST — HOTFIX 7 — NOT LIVE so deployment can be confirmed.
