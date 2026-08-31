IMPORTANT: FIX THE PREVIOUS IMPLEMENTATION. DO NOT REDESIGN THE DASHBOARD.

I have attached two screenshots:

* IMAGE 1 = EXACT INTENDED DESIGN
* IMAGE 2 = CURRENT INCORRECT IMPLEMENTATION

IMAGE 1 MUST BE THE SOURCE OF TRUTH.

The previous implementation added an incorrect sticky toolbar that does not match the intended dashboard.

==================================================

1. RESTORE THE NORMAL DASHBOARD LAYOUT
   ==================================================

The dashboard should look exactly like IMAGE 1 when the user is at the top.

Top navigation:

Gather

[ + Create Form ] [ Search ] [ Sign in ]

Keep this exactly as it currently appears.

Below it:

Submission limit banner

↓

First-time recommendation cards

↓

Created Forms

The Created Forms header should look like IMAGE 1:

Created Forms    0 applications

```
                          [ Recently updated ▼ ] [ List ] [ Grid ]
```

IMPORTANT:

Do NOT add "+ Create Form" to the Created Forms header.

Do NOT add an additional standalone dropdown button.

Do NOT add an unnecessary search icon inside the Recently updated control.

Do NOT change the existing spacing or hierarchy.

==================================================
2. REMOVE THE INCORRECT STICKY TOOLBAR
======================================

The current implementation shown in IMAGE 2 is WRONG.

Remove the sticky toolbar version that looks like:

Created Forms    0 applications

[ + Create Form ] [ ▼ ] [ Recently updated 🔍 ] [ List ] [ Grid ]

This should NOT exist.

Specifically remove:

* Duplicate "+ Create Form" button
* Separate standalone chevron/dropdown button
* Search icon appearing inside the Recently updated control
* Extra toolbar height
* Full-width white toolbar treatment if it changes the original layout

The Created Forms header should retain its original design.

==================================================
3. WHAT SHOULD HAPPEN WHEN SCROLLING
====================================

The purpose of this feature is simply to make the Created Forms controls accessible while the user is browsing applications.

When the user scrolls down and the Created Forms section reaches the top:

Make the EXISTING Created Forms header sticky.

Do NOT create a new header.

Do NOT clone it with additional controls.

Simply pin the existing header.

The sticky version should contain exactly:

Created Forms    [application count]

```
                     [ Recently updated ▼ ] [ List ] [ Grid ]
```

Use the SAME dimensions, typography, spacing and controls as the original Created Forms header.

==================================================
4. CREATE FORM ACCESS WHILE SCROLLING
=====================================

The user still needs an easy way to create another application.

Do NOT solve this by adding "+ Create Form" into the Created Forms header.

Instead, make the EXISTING TOP NAVIGATION sticky.

When the user scrolls down:

The top navigation should remain visible at the top of the viewport.

It should continue to contain:

Gather

[ + Create Form ] [ Search ] [ Sign in ]

This means the user can create another application at any point without adding a duplicate Create Form button to Created Forms.

The top navigation should remain compact.

==================================================
5. FINAL SCROLL BEHAVIOR
========================

Initial position:

┌─────────────────────────────────────────────┐
│ Gather    + Create Form    Search    Sign in│
└─────────────────────────────────────────────┘

Submission banner

First-time recommendations

Created Forms

[Recently updated ▼] [List] [Grid]

Applications

When scrolling down:

┌─────────────────────────────────────────────┐
│ Gather    + Create Form    Search    Sign in│ ← STICKY NAV
└─────────────────────────────────────────────┘

Applications

Applications

Applications

...

When the Created Forms section reaches the top of the content:

The existing Created Forms header may also remain sticky directly beneath the navigation IF necessary for browsing controls.

But it must remain visually identical to its original version.

DO NOT create a new toolbar design.

==================================================
6. IMPORTANT: DO NOT DUPLICATE CONTROLS
=======================================

There must only be ONE:

* Create Form action → top navigation

ONE:

Recently updated dropdown → Created Forms header

ONE:

List/Grid toggle → Created Forms header

Do NOT duplicate any of these.

==================================================
7. RECENTLY UPDATED CONTROL
===========================

The control should be exactly:

Recently updated ▼

The chevron belongs inside the same dropdown control.

Clicking it opens:

Recently updated
Recently created
Name A–Z
Name Z–A

Remove the magnifying-glass/search icon from this control.

Search is already available globally in the top navigation.

==================================================
8. SEARCH MUST REMAIN SEPARATE
==============================

The top navigation Search control remains:

[ 🔍 Search ]

When clicked:

→ Open the search overlay/modal previously requested.

Do not place search inside:

* Created Forms
* Recently updated
* Application sorting controls

==================================================
9. VISUAL MATCH REQUIREMENT
===========================

IMAGE 1 is the visual reference.

Match:

* Header height
* Content width
* Alignment
* Typography
* Button dimensions
* Border radius
* Border treatment
* Spacing
* Background
* Vertical rhythm

Do not introduce new visual patterns.

The sticky behavior should feel like the existing dashboard simply staying accessible — NOT like a new section appearing.

==================================================
10. ACCEPTANCE TEST
===================

Test exactly this:

1. Enter dashboard.
2. Dashboard must initially match IMAGE 1.
3. Top navigation contains:
   Gather / + Create Form / Search / Sign in.
4. Created Forms contains:
   Created Forms / application count / Recently updated / List / Grid.
5. Scroll down.
6. Top navigation remains accessible.
7. Created Forms controls remain accessible when appropriate.
8. No duplicate Create Form button appears.
9. No standalone dropdown chevron appears.
10. No search icon appears inside Recently updated.
11. Search remains a separate top-navigation interaction.
12. Existing application list/grid behavior remains unchanged.

MOST IMPORTANT:

Do not interpret this as a request to redesign the header.

This is ONLY a correction to the previous sticky implementation.

IMAGE 1 = desired UI.
IMAGE 2 = implementation to fix.
