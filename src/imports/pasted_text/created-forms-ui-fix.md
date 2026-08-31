Fix the CURRENT "Created Forms" section UI shown in the screenshot.

Do NOT redesign the dashboard. This is a UI refinement of the existing Created Forms section.

==================================================
CURRENT PROBLEM
===============

The current section has:

* Too much vertical whitespace
* An unnecessarily tall empty-state card
* Header controls that feel disconnected from the section
* Excessive spacing between the section header and empty state
* Empty state content sitting too high/low relative to the card
* The overall section feels visually sparse and unfinished

Make this feel like a polished production SaaS dashboard.

==================================================

1. CREATED FORMS HEADER
   ==================================================

Keep the existing structure:

Created Forms    0 applications

```
                               [ Recently updated ▼ ] [ List ] [ Grid ]
```

Use a compact horizontal layout.

Container max-width should align exactly with the dashboard's main content width.

Header:

* height: approximately 64–72px
* vertically centered
* no unnecessary extra padding
* title should remain prominent
* "0 applications" should remain secondary

Use:

Created Forms
0 applications

with the count visually lighter/smaller than the title.

==================================================
2. SORT CONTROL
===============

Keep:

Recently updated ▼

Make it a compact dropdown button.

Do NOT put a search icon inside this control.

Dropdown options:

* Recently updated
* Recently created
* Name A–Z
* Name Z–A

The dropdown should open directly beneath the control.

==================================================
3. LIST / GRID TOGGLE
=====================

Keep the existing two-option segmented control:

[ List | Grid ]

It should visually read as ONE control.

Requirements:

* compact
* equal button widths
* subtle border
* rounded corners
* selected state clearly visible
* vertically aligned with Recently updated

Do not enlarge it.

==================================================
4. EMPTY STATE CARD
===================

Replace the current oversized empty-state card with a much more compact card.

Current:

Very tall card with a large amount of empty space.

Change it to:

* approximately 150–180px height
* same content width as the Created Forms section
* subtle 1px border
* 12–16px border radius
* white background
* minimal shadow or no shadow
* centered content

Content:

No applications yet

Describe what you need above and click Create.

Keep these two lines close together.

The title should be stronger.

The supporting text should be smaller and muted.

==================================================
5. EMPTY STATE SPACING
======================

Recommended structure:

Created Forms header

↓ approximately 20–24px

Empty state card

The empty state card should not consume unnecessary vertical space.

The content should be vertically centered inside the card.

Do NOT place the empty state extremely low inside the card.

==================================================
6. SECTION BACKGROUND
=====================

Keep the existing dashboard background.

Do not introduce another large white section behind Created Forms.

The page should visually remain:

Dashboard background

→ Created Forms header

→ White empty-state card

The section should feel integrated with the dashboard rather than like a separate page.

==================================================
7. ALIGNMENT
============

Everything must share one consistent content width:

Hero content
Recommendation cards
Created Forms
Application cards/list

The left edge of:

Created Forms

and

Empty state card

must align perfectly.

The right edge must also align.

Do not create different widths for the header and card.

==================================================
8. WHEN APPLICATIONS EXIST
==========================

Do NOT apply the empty-state styling to populated states.

When applications exist:

Created Forms header

↓

Application list/grid

The same header controls remain.

List view:

Display applications as clean horizontal rows.

Grid view:

Display applications as cards.

Keep the existing kebab menu available on every application.

==================================================
9. RESPONSIVE BEHAVIOR
======================

Desktop:

Created Forms + count on left.

Controls on right.

Mobile:

Stack naturally if necessary.

Example:

Created Forms
0 applications

[ Recently updated ▼ ] [ List | Grid ]

Do not allow controls to overflow horizontally.

==================================================
10. IMPORTANT VISUAL RULE
=========================

Do NOT make the empty state look like a giant blank container.

The purpose of the empty state is simply to communicate:

"No applications yet"

and guide the user back toward the creation input.

Keep it compact.

==================================================
FINAL TARGET
============

The section should visually feel approximately like:

---

Created Forms  0 applications

```
                          Recently updated ▼  List Grid
```

---

┌─────────────────────────────────────────────────────┐
│                                                     │
│                 No applications yet                 │
│       Describe what you need above and click Create.│
│                                                     │
└─────────────────────────────────────────────────────┘

The entire section should have a tighter, cleaner vertical rhythm.

IMPORTANT:
Do not change the dashboard hero.
Do not change the recommendation cards.
Do not change the top navigation.
Do not change the creation input.
Do not change the application's functionality.

ONLY fix the Created Forms section UI and empty state.
