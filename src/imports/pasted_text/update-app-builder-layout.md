UPDATE THE APPLICATION/FORM BUILDER LAYOUT TO MATCH THE PROVIDED REFERENCE IMAGE.

I have provided two screenshots:

- IMAGE 1 = desired/reference layout
- IMAGE 2 = current implementation

Do NOT redesign the builder. Preserve the existing Gather visual language and functionality. Fix the layout and add the requested resizable sidebar behavior.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ASK GATHER SIDEBAR WIDTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The current "Ask Gather" sidebar is too narrow.

Change the default sidebar width to closely match IMAGE 1.

Reference behavior:

IMAGE 1:
- Ask Gather occupies a substantial left-side panel.
- The main form-building canvas starts further to the right.
- The sidebar feels like a proper workspace panel rather than a narrow utility column.

Set a sensible default width around 390–420px on desktop.

The exact width should be responsive, but it should visually match IMAGE 1.

Do NOT make the sidebar so wide that the form canvas becomes unusable.

The main content area must automatically resize based on the sidebar width.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. RESIZABLE SIDEBAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add a draggable resize handle on the RIGHT EDGE of the Ask Gather sidebar.

The user should be able to:

- move the cursor over the sidebar's right edge
- see a horizontal resize cursor
- click and drag horizontally
- increase the sidebar width
- decrease the sidebar width

The main form canvas must resize smoothly while dragging.

Example:

┌──────────────────────┬───────────────────────────────────────┐
│                      │                                       │
│     ASK GATHER       │             FORM BUILDER             │
│                      │                                       │
│                      │                                       │
│                      │                                       │
│                      │                                       │
└──────────────────────┴───────────────────────────────────────┘
                       ↑
                 draggable edge

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. RESIZE CONSTRAINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Do not allow the sidebar to become unusably small or excessively large.

Use reasonable desktop constraints:

MIN WIDTH: approximately 300px
DEFAULT WIDTH: approximately 400px
MAX WIDTH: approximately 520px

The exact values can be adjusted slightly to maintain a good composition.

When the user drags:

sidebar width increases → form canvas becomes narrower

sidebar width decreases → form canvas becomes wider

Do NOT create horizontal page scrolling.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. DRAG INTERACTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Use Pointer Events for the resize interaction.

The interaction should feel smooth.

While dragging:

- show the resize cursor
- update the sidebar width continuously
- update the main content width continuously
- prevent accidental text selection
- prevent the drag from triggering unrelated clicks
- stop dragging correctly when the pointer leaves the sidebar or the user releases the mouse

Also support pointer cancellation safely.

Do not break normal scrolling or clicking inside Ask Gather.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. ACCESSIBLE RESIZE BEHAVIOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The resize handle must be keyboard accessible as well.

Provide an accessible resize control/handle with an appropriate aria-label such as:

"Resize Ask Gather sidebar"

Support keyboard adjustment using:

- Arrow Left → decrease width
- Arrow Right → increase width

Use a sensible increment such as 20px.

Respect the same minimum and maximum width constraints.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. VISUAL RESIZE HANDLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Keep the resize handle visually subtle.

Normally:

- very light divider
- no large visible bar
- no distracting decoration

On hover/focus/drag:

- provide a subtle visual indication that the edge is draggable
- use the existing Gather blue accent for the interaction state

Do not introduce a new color palette.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. ASK GATHER CONTENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Keep the existing Ask Gather content exactly as it currently works:

ASK GATHER

"Try asking Gather to edit your application:"

- Add a portfolio question
- Make these questions shorter
- Add a leadership question
- Make this suitable for students
- Improve these questions

And keep the bottom AI input:

"Ask Gather to change your application..."

Do NOT remove, redesign, or relocate these controls.

Only give the panel more usable width.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. FORM BUILDER CANVAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The main form builder should adapt to the sidebar width.

Preserve the existing structure:

- application header
- cover image area
- application title
- description
- section heading
- question cards
- Add question
- bottom section navigation

The form content should remain centered within the available canvas.

Do not allow the form cards to become unnecessarily narrow when the sidebar is resized.

Use responsive max-width behavior for the form content.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9. BOTTOM SECTION NAVIGATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT:

Keep the existing bottom section navigation exactly as implemented.

It should continue to contain:

+ Add section

Personal Information
Background
Experience
Additional Questions
New sdf

Keep the section kebab menus working.

The sidebar resize interaction must NOT interfere with:

- section selection
- section kebab menus
- rename
- duplicate
- delete
- dragging/reordering sections

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
10. TOP NAVIGATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Do not change the existing top navigation.

Keep:

Applications / application name

Build
Submissions
Preview
Publish
⋮

Keep the autosave information bar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
11. RESPONSIVE BEHAVIOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This resizable sidebar behavior is primarily for desktop/tablet layouts.

On smaller screens:

- do not allow the sidebar to consume the entire screen
- switch to an appropriate responsive/collapsible behavior
- preserve access to Ask Gather
- prevent horizontal page scrolling

The desktop layout should closely match IMAGE 1.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
12. IMPORTANT — DO NOT BREAK EXISTING FUNCTIONALITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Do NOT rewrite the application builder.

Do NOT remove existing functionality.

Do NOT change:

- AI generation
- Ask Gather functionality
- question editing
- question kebab menus
- section navigation
- section kebab menus
- drag/reorder questions
- drag/reorder sections
- autosave
- Preview
- Publish
- Submissions
- application settings

Only modify the layout necessary to:

1. Make Ask Gather substantially wider by default.
2. Add a draggable right-edge resize handle.
3. Dynamically resize the form canvas.
4. Add keyboard-accessible resizing.
5. Preserve the existing UI styling.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCEPTANCE TEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open an application builder.
2. Compare the layout to IMAGE 1.
3. Ask Gather should have a substantially wider default width.
4. Hover over its right edge.
5. Resize cursor should appear.
6. Drag the edge to the right.
7. Sidebar becomes wider.
8. Form canvas becomes narrower.
9. Drag the edge back to the left.
10. Sidebar becomes narrower.
11. Form canvas becomes wider.
12. Sidebar cannot become smaller than the minimum.
13. Sidebar cannot become larger than the maximum.
14. No page-level horizontal scrollbar appears.
15. Ask Gather controls still work.
16. Section navigation still works.
17. Section kebab menus still work.
18. Question kebab menus still work.
19. Question/section drag-and-drop still works.
20. Keyboard resize works with Arrow Left/Right.
21. Existing top navigation and builder functionality remain unchanged.

MOST IMPORTANT:
The final result should visually feel like IMAGE 1, not IMAGE 2.

The Ask Gather panel should feel like a substantial editing assistant workspace, with the form builder occupying the remaining space. The sidebar must be user-resizable by dragging its right boundary.