FIX THE QUESTION EDITING INTERACTION IN THE FORM BUILDER.

IMPORTANT:
The current behavior is incorrect. The user should NOT have to click:

Kebab → Edit

to edit a question.

The question/card itself must be directly editable.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. DIRECT QUESTION EDITING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every question card/container should be directly clickable.

Example:

┌──────────────────────────────────────────────┐
│ ⋮                                            │
│ QUESTION                                     │
│                                              │
│ Full name                                    │
│ Short answer   Required                      │
│                                              │
└──────────────────────────────────────────────┘

When the user clicks anywhere on the question card/container:

→ open that question in EDIT MODE.

Do NOT require the kebab menu.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. CLICKING THE QUESTION TEXT / INPUT AREA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If the user clicks directly on:

"Full name"

or the question input/text area:

→ immediately enter edit mode.

The question text should become editable.

Show the formatting toolbar directly above the question text.

For example:

QUESTION

┌──────────────────────────────────────────────┐
│ B   I   U   🔗   ...                         │
├──────────────────────────────────────────────┤
│ Full name                                    │
└──────────────────────────────────────────────┘

The formatting toolbar should NOT permanently appear on every question.

It should only appear while that question is active/editing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. CLICKING ANYWHERE ON THE CARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Clicking the card should activate the question.

The user should be able to click:

- question text
- answer type
- required area
- answer preview
- empty space inside the question card

and enter the editing state.

The interaction should feel similar to a modern visual form builder.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. KEBAB MENU IS NOT THE EDIT BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The kebab icon on the right side of each question should remain.

However:

Clicking kebab MUST NOT be the only way to edit.

The kebab should open an actions menu such as:

Edit
Duplicate
Delete

Optional actions can remain if already implemented.

But clicking the question itself should always support editing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. EDIT MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When a question becomes active:

- visually highlight the active question card
- show the formatting toolbar
- make the question text editable
- show the answer type controls
- show Required toggle
- show answer preview/configuration
- show Done action

Example:

┌──────────────────────────────────────────────┐
│ QUESTION                                  ⋮  │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ B  I  U  🔗  ...                         │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Full name                                    │
│                                              │
│ ANSWER TYPE                                  │
│ [ Short answer ▼ ]  ☑ Required               │
│                                              │
│ ANSWER                                       │
│ [ Short answer                         ]     │
│                                              │
│                                  Done        │
└──────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. CLICKING ANOTHER QUESTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If another question is clicked while one question is being edited:

→ save/autosave the current question
→ close its editing state
→ open the newly clicked question

Do not require the user to click Done before selecting another question.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. CLICK OUTSIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If the user clicks outside the active question:

→ exit editing mode
→ autosave the changes
→ return the question to its normal collapsed/card state

Do not lose the user's changes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. DONE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Keep the existing "Done" action.

Clicking Done:

→ save/autosave changes
→ exit edit mode
→ collapse the question back to its normal card

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9. DO NOT CHANGE THE EXISTING BUILDER STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Keep the current:

- Ask Gather sidebar
- form canvas
- question cards
- section navigation at bottom
- section kebab menus
- question kebab menus
- drag handles
- sidebar resize behavior
- autosave
- Preview
- Publish
- Submissions

Only fix the question interaction model.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
10. SECTION BEHAVIOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The same principle should apply to sections where appropriate.

Clicking a section should select/navigate to it.

The section kebab remains for section actions:

Rename
Duplicate
Delete

Do not make kebab → Edit a prerequisite for normal interaction.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
11. IMPORTANT UX RULE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The primary interaction must be:

CLICK QUESTION → EDIT

NOT:

CLICK KEBAB → EDIT

The kebab is an action menu.

The question card itself is the editing surface.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCEPTANCE TEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open an application in Build mode.
2. Click directly on "Full name".
3. It immediately enters edit mode.
4. Formatting toolbar appears.
5. Question text can be edited.
6. Click the answer type → controls are accessible.
7. Click Required → toggle works.
8. Click anywhere else inside the question card → question remains/openly editable.
9. Click another question → first question autosaves and second opens.
10. Click Done → question collapses.
11. Click outside → question autosaves and collapses.
12. Click kebab → actions menu appears.
13. Kebab is NOT required to edit.
14. Existing drag-and-drop and section controls continue working.

Do not implement any solution where the user must use
"Kebab → Edit" to enter question editing mode.