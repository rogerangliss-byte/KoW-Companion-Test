# KoW Companion — User Guide
## Version 4.3.29

KoW Companion tracks individual Officer development and shared upgrade resources. Officer-specific progress is saved separately for each Officer, while shared inventory remains available across Officers.

# ✨ What’s New in v4.3.29

## Officer Progress
The Officer Progress area now classifies saved Officers as **MAXED**, **IN PROGRESS**, or **NOT STARTED**. Officers without recorded development are automatically treated as Not Started. Progress filters and Compare Officer Progress filters operate independently, allowing comparison of Not Started and In Progress Officers even when the main Progress view is filtered differently.

## Compare Officer Progress
Officer comparison is available from the dedicated Progress area. Officers are presented in Season order. The comparison uses each Officer’s saved progress rather than the currently displayed Officer fields.

## Edit Officer Progress
The Officer tab now includes **Edit Officer Progress**, allowing the key Officer-specific values to be entered in one place:
- Current Star Level
- Current Officer Level
- Officer Unlocked
- Four Skill Strands
- Training Level

Press **Save Progress** to write these values into the selected Officer’s saved profile and synchronize the other development views.

## MAX Officer
**MAX Officer** provides a one-click way to set an Officer to:
- 5 Stars
- Level 70
- Officer Unlocked
- All four Skill Strands at Level 5
- Training Level 180

Save the Officer after applying MAX so the state is retained in the Officer Progress system.

## Automatic Officer Unlock
If Current Officer Level is set above Level 1, **Officer Unlocked** is automatically selected. Returning the level to 1 does not automatically remove an existing unlocked state.

## Exact Training Level
Training can now be entered as an exact number from **0 to 180** as well as with the slider. The number field and slider remain synchronized.

## Four Independent Skill Strands
Officer skills are represented by **four independent strands**. Each strand starts at **Level 1 free/already unlocked** and can independently advance to Level 5. For example, an Officer can legitimately have strand levels **1 / 3 / 5 / 2**.

There are 16 paid skill increases in total. The badge cost is based on the **total number of paid skill increases already completed**, regardless of which strand was advanced.

The shared cost sequence is:

`10, 10, 15, 15, 30, 30, 40, 40, 45, 45, 50, 50, 75, 75, 80, 80`

The total cost to complete all paid skill upgrades is **690 Officer Badges**.

The Skill display uses:
- **Gold** — that level has been reached.
- **Black/dark** — that level has not yet been reached.
- Level 1 is gold because it is free and already available on every strand.

The skill summary shows the **Next Cost**, **badges used / 690**, and **badges remaining**. Select the **i** information button for the full skill-cost sequence and current strand information.

# Using the App

## Officer Tab
Choose the Officer you want to work with. Officer-specific saved progress belongs to that Officer only. Use **Save This Officer** after changing progress through the normal development controls, or use **Edit Officer Progress** for the consolidated progress entry screen.

## Stars
Enter the Officer’s current and target Star levels and the relevant Star resources. Star development is reflected in the Officer’s saved progress when the profile is saved.

## Develop
Use Develop for Officer unlock, Skill Strands and Training.

### Unlock
Unlocking a Legendary Officer requires the appropriate unlock state in the tracker. Setting an Officer above Level 1 automatically marks the Officer as unlocked.

### Skill Strands
Set each of the four strands independently from Level 1 to Level 5. The app counts the total paid advances across all four strands and applies the shared badge-cost sequence in order.

### Training
Set Training from 0–180 using either the slider or exact numeric entry.

## XP
Enter the Officer’s current level and target level and use the XP inventory/planning controls to calculate XP requirements. Current Officer Level is also used by Officer Progress.

## Shared Inventory
ORV, SRV, Universal Legendary Badges, badge-selection chests, Exclusive Stars and XP Books are shared resources. They are not duplicated inside each Officer’s Quick Edit profile.

## Saving Officer Progress
Progress is saved per Officer. After saving, switching to another Officer and returning should restore the saved values. The Progress and Compare views use these saved profiles.

## Officer Progress Status
**MAXED** means the Officer has reached the tracked maximum development state.

**IN PROGRESS** means development has been recorded but the Officer is not fully maxed.

**NOT STARTED** means no meaningful development has been recorded for that Officer.

## Progress Filters
The main Officer Progress filters control which saved Officers appear in the Progress view. Compare Officer Progress has its own selection/filter behaviour so comparison is not restricted by the main Progress filter.

## Database
The Database contains Officer information used by the calculator. Use the Database/Settings management functions carefully when adding or changing Officers because these records drive Officer selection and calculations.

## Releases
The Release area records recurring Officer release timing and is intended to help with future-season planning.

## Settings
Settings contains application options and management controls. Reset functions should be used deliberately because they may restore default application state.

# Recommended Workflow

1. Select an Officer.
2. Open **Edit Officer Progress**.
3. Enter Stars, Level, Skill Strand levels and Training.
4. Confirm Officer Unlocked; it will be automatically selected if Level is above 1.
5. Press **Save Progress**.
6. Check the Progress tab to confirm the Officer is classified correctly.
7. Use Stars, Develop and XP for detailed resource planning.
8. Use Compare Officer Progress when deciding which Officer to develop next.

# Skill Example

If the four strands are **5 / 3 / 2 / 1**, the Officer has completed:
- Strand 1: four paid increases
- Strand 2: two paid increases
- Strand 3: one paid increase
- Strand 4: zero paid increases

That is **7 paid increases** in total. The first seven costs in the shared sequence are therefore used:

`10 + 10 + 15 + 15 + 30 + 30 + 40 = 150`

The display consequently shows **150 / 690 used**, **540 remaining**, and the **next upgrade costs 40 badges**.

# Troubleshooting

If progress appears incorrect, first confirm that the correct Officer is selected and that **Save Progress** or **Save This Officer** was used after the change. Re-open Edit Officer Progress to confirm the saved values.

If a skill total looks unexpected, count the paid increases above Level 1 across all four strands. The cost depends on the total number of paid increases, not on which particular strand received them.

If the app appears to show an older version after an update, refresh the deployed page and ensure the current v4.3.29 files have replaced the previous release files.
