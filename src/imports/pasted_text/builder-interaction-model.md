FIX THE BUILDER INTERACTION MODEL AND IMPLEMENT THE SETTINGS/CONFIRMATION MODALS.

IMPORTANT:
Do not redesign the existing Gather UI.
Keep the current visual language, spacing, typography, colors, borders and component style.

The main change is to make question editing/settings consistent and move question configuration into a right-side settings panel.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. APPLICATION KEBAB MENU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The application-level kebab menu in the top-right currently contains:

Save draft
Duplicate
Settings
Delete

Keep these actions.

Implement the following behaviors:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. SETTINGS → FORM SETTINGS MODAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When the user clicks:

Settings

from the application-level kebab:

→ open the FORM SETTINGS as a centered modal.

IMPORTANT:
Do NOT open an application settings page.
Do NOT navigate away from the builder.

The form/application settings must appear as a modal overlay on top of the builder.

The modal should contain the existing form settings that were previously available in the application/form settings experience.

Use a proper modal:

┌──────────────────────────────────────────┐
│ Form settings                         ×  │
├──────────────────────────────────────────┤
│                                          │
│ General                                  │
│                                          │
│ Form title                               │
│ [......................................] │
│                                          │
│ Description                              │
│ [......................................] │
│                                          │
│ Other existing form settings...          │
│                                          │
├──────────────────────────────────────────┤
│                         Cancel   Save     │
└──────────────────────────────────────────┘

Use the application's existing settings data/components if they already exist.

Do not duplicate settings logic.

Clicking × or Cancel:
→ close modal
→ remain in builder
→ do not lose changes.

Clicking Save:
→ save/autosave changes
→ close modal.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. SAVE DRAFT → CONFIRMATION MODAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When the user clicks:

Save draft

from the application kebab:

Show a confirmation/status modal.

Example:

┌─────────────────────────────────────┐
│ Draft saved                       ×  │
│                                     │
│ Your application has been saved     │
│ as a draft.                         │
│                                     │
│                         Done        │
└─────────────────────────────────────┘

Do not navigate away from the builder.

The application must remain in its current draft state.

If the system already autosaves, still provide this explicit feedback when the user manually chooses "Save draft".

Use the existing Gather modal styling.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. DELETE → CONFIRMATION MODAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When the user clicks:

Delete

from the application kebab:

DO NOT delete immediately.

Open a destructive confirmation modal.

Example:

┌────────────────────────────────────────┐
│ Delete application                  ×  │
│                                        │
│ Are you sure you want to delete this   │
│ application?                           │
│                                        │
│ This action cannot be undone.           │
│                                        │
│                 Cancel   Delete         │
└────────────────────────────────────────┘

Delete button must use the existing destructive/red treatment.

Cancel:
→ close modal
→ keep application unchanged.

Delete:
→ delete application
→ navigate back to Applications/dashboard
→ remove it from the created forms list.

IMPORTANT:
Never delete immediately after clicking the kebab menu item.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. REMOVE INLINE QUESTION EDITOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THIS IS VERY IMPORTANT.

Remove the current inline question editing UI shown inside the question card.

Specifically, DO NOT show this inside the question card anymore:

QUESTION

┌────────────────────────────────────────┐
│ B   I   U   link   formatting controls │
├────────────────────────────────────────┤
│ Full name                              │
└────────────────────────────────────────┘

The inline formatting toolbar must be removed.

Do not require inline editing.

The question card should remain clean and compact.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. NORMAL QUESTION CARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Question cards should look like the current normal collapsed cards:

┌──────────────────────────────────────────────┐
│ ⋮                                            │
│                                              │
│ Full name                                    │
│ Short answer       Required                  │
│                                              │
└──────────────────────────────────────────────┘

Keep the drag handle on the left.

Keep the kebab on the right.

No formatting toolbar should be visible in the normal state.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. CLICK QUESTION → OPEN RIGHT SETTINGS PANEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When the user clicks ANY question card:

→ open the Question Settings panel from the RIGHT side.

Do NOT use the kebab → Edit flow.

Do NOT open an inline editor.

The question card itself should be the primary way to open its settings.

Example:

USER CLICKS:

┌─────────────────────────────┐
│ Full name                 ⋮ │
│ Short answer    Required   │
└─────────────────────────────┘

Then:

┌──────────────────────────────────┬─────────────────────────┐
│                                  │ Question Settings     × │
│                                  │                         │
│          FORM BUILDER            │ Question                │
│                                  │ [Full name...........]   │
│                                  │                         │
│                                  │ Formatting              │
│                                  │ [B I U Link ...]        │
│                                  │                         │
│                                  │ Placeholder             │
│                                  │ [....................]  │
│                                  │                         │
│                                  │ Answer type             │
│                                  │ [Short answer ▼]        │
│                                  │                         │
│                                  │ Required        [ON]    │
│                                  │                         │
└──────────────────────────────────┴─────────────────────────┘

Use the uploaded reference for the right-side property/settings-panel interaction.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. QUESTION SETTINGS PANEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The right panel should contain settings appropriate to the selected question.

At minimum:

QUESTION
- Question/label text
- Text formatting controls

PLACEHOLDER
- Placeholder text

ANSWER TYPE
- Answer type selector

REQUIRED
- Required toggle

Additional settings should appear dynamically based on the selected answer type.

The panel should behave like a proper property inspector.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9. QUESTION TEXT + FORMATTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Question text editing now happens inside the right settings panel.

Do NOT show the formatting toolbar directly on the question card.

For example:

Question

┌─────────────────────────────┐
│ Full name                   │
└─────────────────────────────┘

Formatting:

[B] [I] [U] [Link] [Clear formatting]

Changes should immediately update the question on the canvas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
10. PLACEHOLDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The settings panel must provide:

Placeholder

[ Short answer ]

or the appropriate current placeholder.

Changing the placeholder should immediately update the question's answer field.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
11. ANSWER TYPE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Provide an Answer type selector.

For example:

Answer type

[ Short answer ▼ ]

The dropdown must include the application's supported question types.

At minimum, support the existing types already implemented.

When the answer type changes:

→ update the question card
→ update the respondent-facing answer control
→ update the right settings panel
→ show only settings relevant to that type.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
12. SHORT ANSWER SETTINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When:

Answer type = Short answer

show:

Question
Formatting
Placeholder
Answer type
Required

The answer preview should show a short-answer input.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
13. DROPDOWN SETTINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When:

Answer type = Dropdown

show the appropriate dropdown-specific controls.

Use the uploaded reference behavior.

Show:

Basic

Label
Caption
Placeholder

Options

[ Option 1                    🗑  ⋮⋮ ]
[ Option 2                    🗑  ⋮⋮ ]

+ Add
Bulk add

Default value

"Other" option
[ toggle ]

Required
[ toggle ]

Half width
[ toggle ]

Do not show irrelevant controls for dropdowns.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
14. "OTHER" OPTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For question types supporting an "Other" option:

When:

"Other" option = ON

the respondent-facing form should provide an additional text input when the user selects Other.

Example:

○ Option 1
○ Option 2
○ Other

[ Please specify... ]

This must work in Preview as well.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
15. DYNAMIC QUESTION SETTINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The settings panel must adapt according to the question type.

Do NOT show the same settings for every question.

Examples:

SHORT ANSWER
→ Question
→ Formatting
→ Placeholder
→ Answer type
→ Required
→ relevant width/settings

DROPDOWN
→ Question
→ Formatting
→ Placeholder
→ Options
→ Default value
→ Other option
→ Answer type
→ Required
→ relevant width/settings

MULTIPLE CHOICE
→ Question
→ Formatting
→ Options
→ Other option
→ Answer type
→ Required

EMAIL
→ Question
→ Placeholder
→ Answer type
→ Required

URL
→ Question
→ Placeholder
→ Answer type
→ Required

Use the existing supported answer types rather than inventing unsupported types.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
16. QUESTION KEBAB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The question kebab should remain available.

However, it should NOT be the primary editing mechanism.

Clicking the question card:
→ opens right settings panel.

Clicking kebab:
→ opens the question action menu.

The action menu can contain:

Duplicate
Delete

and other existing question-level actions.

If "Edit" currently exists in the kebab menu, it should either:
→ open the same right settings panel
OR
→ be removed because clicking the question already opens settings.

Do not maintain two different editing systems.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
17. CLOSE QUESTION SETTINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The right settings panel must have:

× Close

Clicking ×:
→ closes the settings panel
→ returns to the normal builder view.

The question remains updated.

Clicking another question while the panel is open:
→ switch the panel to the newly selected question.

Do not close the builder or navigate away.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
18. AUTOSAVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All changes made inside the question settings panel must continue using the existing autosave behavior.

Examples:

Changing question text
Changing placeholder
Changing answer type
Changing required
Adding/removing options
Changing option order
Enabling Other
Changing width

→ update application state
→ autosave.

Do not require a separate Save button for every question property unless the existing architecture requires it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
19. KEEP DRAGGING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Do not break the existing drag handles.

Questions should still be draggable to reorder.

Sections should still be draggable/reorderable from the bottom section navigation.

The right settings panel should not interfere with dragging.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
20. PANEL WIDTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The right settings panel should have a sensible fixed/default width.

However, preserve the existing ability to resize the sidebar/panel if that functionality is already implemented.

The panel should behave like a property inspector rather than a modal.

Unlike the Form Settings modal:

QUESTION SETTINGS = SIDE PANEL

FORM SETTINGS = CENTERED MODAL

Keep these interaction patterns clearly distinct.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
21. IMPORTANT INTERACTION RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

There are now THREE different interaction patterns:

A. APPLICATION SETTINGS

Application kebab
→ Settings
→ centered Form Settings modal

B. QUESTION SETTINGS

Click question card
→ right Question Settings panel

C. QUESTION ACTIONS

Click question kebab
→ action menu

Do NOT mix these.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
22. FINAL UX FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Application:

Applications
↓
Open application
↓
Builder

Application kebab:
├── Save draft → confirmation modal
├── Duplicate
├── Settings → Form Settings modal
└── Delete → confirmation modal


Question:

Click question card
↓
Right Question Settings panel opens
↓
Edit:
- Question
- Formatting
- Placeholder
- Answer type
- Required
- Type-specific settings
↓
Changes autosave
↓
Close panel


Question kebab:

Click ⋮
↓
Question action menu
↓
Duplicate / Delete / other existing actions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
23. DO NOT BREAK EXISTING FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Preserve:

- Ask Gather sidebar
- sidebar resizing
- bottom section navigation
- section drag/reordering
- section kebab
- question drag/reordering
- question kebab
- Preview
- Mobile/Desktop preview
- Publish
- Submissions
- autosave
- dashboard
- application creation flow
- ready-made prompt flow
- authentication flow
- pricing/branding flow

Only change the interaction model described above.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCEPTANCE TEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

APPLICATION:

1. Click application kebab.
2. Click Settings.
3. Form Settings opens as a centered modal.
4. It does NOT navigate to another settings page.
5. Close modal works.
6. Save works.

7. Click application kebab.
8. Click Save draft.
9. Draft-saved confirmation modal appears.
10. Application remains open.

11. Click application kebab.
12. Click Delete.
13. Delete confirmation modal appears.
14. Application is NOT deleted yet.
15. Cancel keeps application.
16. Delete removes application and returns to dashboard.

QUESTION:

17. Click a question card.
18. Right Question Settings panel opens immediately.
19. No inline formatting toolbar appears inside the question card.
20. Question text can be edited from the right panel.
21. Formatting controls are available in the right panel.
22. Placeholder can be edited.
23. Answer type can be changed.
24. Required can be toggled.
25. Type-specific settings appear dynamically.
26. Dropdown shows options management.
27. "Other" can be enabled.
28. Selecting Other in Preview displays an input field.
29. Changes autosave.
30. Clicking another question switches the right panel to that question.
31. Clicking × closes the panel.

MOST IMPORTANT:

REMOVE THE OLD INLINE EDITING MODEL.

The user should NEVER need:

Question kebab → Edit

to configure a question.

The correct primary interaction is:

CLICK QUESTION → RIGHT SETTINGS PANEL.

The question card itself remains clean and compact.