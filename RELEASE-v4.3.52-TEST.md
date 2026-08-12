# KoW Companion English v4.3.52 TEST

## Multi-Officer Planner calculation correction

- Individual Officer Badges are still deducted from that Officer's requirement first.
- Fully Funded = Held + Shared Allocated covers the complete badge requirement.
- Partially Funded = Shared resources have actually been allocated, but a shortfall remains.
- Shortfall = A badge requirement remains and no shared resources were allocated to that Officer.
- Held Officer Badges alone no longer incorrectly change an Officer to Partially Funded.
- Planner summary now explicitly reports Held badges, Shared badges allocated, and total badges still unfunded.

Example:
Katherine: 1,600 needed - 270 held = 1,330 remaining.
If 649 shared badges are allocated, total covered is 919 and 681 remain unfunded.
