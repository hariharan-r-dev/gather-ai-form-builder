FIX THE CREATED FORMS LIST VIEW AND APPLICATION INPUT INTERACTION.

There are two specific issues to fix. Do not redesign unrelated parts of the dashboard.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. APPLICATION INPUT FIELD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When the user clicks/focuses the main "Application" input field in the creation area:

- The input should become clearly active/focused.
- Show the text-formatting / input controls associated with the application prompt.
- These controls should appear within/attached to the input experience, similar to a modern AI creation composer.
- Do NOT open a separate page, modal, or unrelated panel just because the field is focused.
- Keep the existing prompt text and Create button behavior unchanged.
- Clicking outside should remove the focused state naturally.

IMPORTANT:
The formatting controls should only appear when the input is active/focused. They should not permanently occupy space when the user has not interacted with the field.

Do not change the existing "Use this prompt" behavior:
Recommendation card
→ Create application page
→ prompt is inserted into the AI input
→ user can edit
→ Generate application.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. CREATED FORMS — LIST VIEW KEBAB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In the "Created Forms" section, when List view is selected, every application row must have a kebab menu (⋮) at the far right.

CURRENT PROBLEM:
The list view currently shows:

Application | Submissions | Status | Updated

but there is no action menu at the end of each row.

ADD:

Application | Submissions | Status | Updated | ⋮

The kebab must be visible for EVERY application row.

Example:

┌─────────────────────────────────────────────────────────────┐
│ Application   Submissions   Status       Updated          │
├─────────────────────────────────────────────────────────────┤
│ Dfsdfs       0             Draft        just now       ⋮  │
├─────────────────────────────────────────────────────────────┤
│ Sdfsdf       0             Published    just now       ⋮  │
└─────────────────────────────────────────────────────────────┘

PLACEMENT:
- Align the kebab to the far-right edge of each row.
- Give it a consistent clickable area, approximately 32–36px.
- Keep it vertically centered with the row.
- Do not make it appear only on hover.
- It should ALWAYS be visible in list view.
- Maintain the same kebab visual treatment already used elsewhere in the application.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. KEBAB MENU BEHAVIOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Clicking a row's kebab should open the existing application actions menu.

At minimum keep:

- Open/Edit
- Duplicate
- Delete

If other existing application actions already exist, preserve them.

The menu must:

- Open next to the clicked row.
- Stay above the table/container.
- Not be clipped by the Created Forms container.
- Close when clicking outside.
- Close when another row's kebab is clicked and open the new row's menu.
- NOT navigate into the application merely by clicking the kebab.
- Clicking the application name/row itself should continue to open the application as it currently does.

Use proper z-index and overflow handling so the menu is not hidden behind the table or page.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. GRID VIEW CONSISTENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Do NOT remove or change the existing kebab behavior in Grid view.

Both views must support the same application actions:

LIST VIEW → ⋮ on every row
GRID VIEW → ⋮ on every card

The action menu should use the same component and interaction logic wherever possible.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. RESPONSIVE BEHAVIOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Make sure the kebab remains accessible at smaller desktop/tablet widths.

Do not hide the action menu simply because the viewport becomes narrower.

If horizontal space becomes limited, preserve:

Application
Submissions
Status
Updated
⋮

with the action column remaining visible.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. VISUAL CONSISTENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Keep the current Gather design language.

Do NOT introduce a new visual style.

Preserve:

- current typography
- current blue accent
- current borders
- current rounded corners
- current background
- current spacing
- current status pills
- current list/grid toggle
- current sorting dropdown

Only make the minimum UI changes necessary.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCEPTANCE TEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test all of the following:

1. Click the Application input.
2. Confirm the input-focused/text-formatting controls appear correctly.
3. Click outside.
4. Confirm the focused controls disappear naturally.
5. Go to Created Forms.
6. Select List view.
7. Confirm every application row has a visible ⋮ button.
8. Click the first row's ⋮.
9. Confirm the action menu opens without opening the application.
10. Click an action and confirm it works.
11. Open another row's ⋮.
12. Confirm the previous menu closes and the new one opens.
13. Click outside.
14. Confirm the menu closes.
15. Switch to Grid view.
16. Confirm the existing grid-card kebab menus still work.
17. Confirm no existing creation, recommendation, navigation, or application functionality is broken.

IMPORTANT:
Do not solve this by adding a static decorative ⋮ icon. It must be a fully functional action trigger connected to the application represented by that row.