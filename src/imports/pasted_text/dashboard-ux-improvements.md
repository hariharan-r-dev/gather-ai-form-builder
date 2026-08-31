MODIFY THE EXISTING GATHER DASHBOARD ONLY.

Do NOT rebuild the dashboard.
Do NOT change the existing dashboard visual design.
Do NOT change the AI creation flow.
Do NOT change the first-time recommendation cards.
Do NOT change the application cards/grid/list functionality.

This is a targeted UX improvement to the CURRENT dashboard.

Use the attached screenshots as the reference for the intended behavior.

==================================================

1. CURRENT DASHBOARD STRUCTURE
   ==================================================

The dashboard currently contains:

* Top navigation
* Create Form / Create Application area
* Search
* First-time "Start with an idea" recommendations
* Created Forms / Applications section
* List/Grid view
* Sort control
* Application cards/list

Keep all of this.

The problem:

The Create Application button/input is at the top of the page.

When the user scrolls down to view their created applications, they currently have to scroll all the way back to the top to create another application.

Fix this without adding a permanently large second creation area.

==================================================
2. STICKY CREATED FORMS HEADER
==============================

When the user scrolls DOWN far enough that the main dashboard creation area is no longer visible:

Make the "Created Forms" section header become sticky at the top of the viewport.

Use the existing Created Forms header from the dashboard.

The sticky header should contain:

LEFT:

**Created Forms**

Optionally show the application count beside/below it if it fits naturally.

RIGHT:

[ + Create Form ]    [ Recently updated ▼ ]    [ List ] [ Grid ]

The exact controls should reuse the EXISTING controls/components.

Do not create duplicate styling.

==================================================
3. STICKY HEADER BEHAVIOR
=========================

Initial page state:

The normal dashboard header/navigation remains unchanged.

User scrolls down.

↓

The Created Forms section reaches the top of the viewport.

↓

The Created Forms header becomes sticky.

↓

It remains visible while the user browses all created applications.

The sticky header should:

* Stay at the top of the content area
* Have a clean background
* Have a subtle bottom border/shadow so it is visually separated from the content
* Not cover application cards
* Not jump or cause layout shift
* Work smoothly while scrolling

When the user scrolls back above the Created Forms section:

→ Return to the normal non-sticky layout.

==================================================
4. CREATE FORM BUTTON IN STICKY HEADER
======================================

Add:

**+ Create Form**

to the sticky Created Forms header.

This should be the SAME Create Form/Create Application action already used by the dashboard.

Do not create a separate creation flow.

When clicked:

→ Open the existing Create Application page.

The existing AI creation functionality must remain unchanged.

Example:

User is browsing applications near the bottom.

Clicks:

**+ Create Form**

↓

Existing Create Application screen opens.

==================================================
5. IMPORTANT — DO NOT KEEP THE ORIGINAL BUTTON STICKY
=====================================================

Do NOT make the large hero creation area sticky.

Do NOT make the large AI input sticky.

Do NOT duplicate the hero section.

Only the compact Created Forms section header becomes sticky.

This keeps the dashboard clean.

==================================================
6. RECENTLY UPDATED DROPDOWN
============================

In the sticky Created Forms header, keep the existing sorting control:

**Recently updated ▼**

Clicking it should open a dropdown.

Options should include:

* Recently updated
* Recently created
* Name A–Z
* Name Z–A

The selected option should immediately update the application ordering.

Preserve the existing sorting implementation if it already exists.

The dropdown should visually match the existing Gather UI.

==================================================
7. SEARCH INTERACTION — IMPORTANT
=================================

The existing top navigation contains:

[ Search ]

When the user clicks the Search bar:

DO NOT navigate to another page.

DO NOT expand the search bar inside the navbar.

DO NOT push the dashboard content down.

Instead, open a focused SEARCH OVERLAY / MODAL.

==================================================
8. SEARCH OVERLAY
=================

The overlay should be minimal.

When Search is clicked:

The page behind it becomes slightly dimmed.

Bring a centered search panel/modal to the front.

The main focus should ONLY be the search experience.

Example:

```
    ┌──────────────────────────────────────┐
    │  Search applications...          ×   │
    ├──────────────────────────────────────┤
    │                                      │
    │  Search your created applications    │
    │                                      │
    └──────────────────────────────────────┘
```

The search input should automatically receive focus.

User can immediately start typing.

==================================================
9. SEARCH MODAL DESIGN
======================

Keep it consistent with Gather.

Use:

* White surface
* Rounded corners
* Subtle border
* Soft shadow
* Search icon
* Large/comfortable input
* Close × button

Do NOT make it a huge full-screen search page.

The modal should feel lightweight.

==================================================
10. SEARCH RESULTS
==================

As the user types:

Search through the existing applications/forms.

Results should update immediately.

Example:

User types:

"speaker"

↓

Show matching application:

"Technology Conference Speaker Application"

If nothing matches:

Show:

**No applications found**

Supporting text:

**Try a different search term.**

Do not create fake results.

Use the actual existing application data.

==================================================
11. SEARCH RESULT CLICK
=======================

When the user clicks a search result:

→ Close the search overlay.

→ Open that existing application.

Use the existing application-opening behavior.

==================================================
12. CLOSE SEARCH
================

The search overlay should close when:

* User clicks ×
* User presses Escape
* User clicks outside the modal

Do not lose the dashboard state.

After closing:

→ User returns to exactly the same scroll position.

==================================================
13. MOBILE / RESPONSIVE BEHAVIOR
================================

The sticky Created Forms header should remain usable on smaller screens.

On narrow screens:

Prioritize:

* Create Form
  Recently updated
  List/Grid

Avoid overflowing the viewport.

Search modal should also fit comfortably on mobile.

==================================================
14. VISUAL HIERARCHY
====================

The dashboard should feel like:

TOP:

Gather navigation

↓

Hero / creation area

↓

First-time recommendations (only when applicable)

↓

CREATED FORMS

[ + Create Form ] [ Recently updated ▼ ] [ List/Grid ]

↓

Applications

As the user scrolls:

```
         ┌───────────────────────────────────────────┐
         │ Created Forms   + Create Form   Sort View │ ← STICKY
         └───────────────────────────────────────────┘

         Application
         Application
         Application
         Application
         ...
```

This gives the user continuous access to the main action while browsing.

==================================================
15. DO NOT CHANGE EXISTING FUNCTIONALITY
========================================

Keep all current behavior:

✓ Dashboard landing page
✓ First-time recommendation cards
✓ Recommendation dismissal
✓ "Use this prompt"
✓ Create Application page
✓ AI prompt generation
✓ Application editor
✓ Sections
✓ Questions
✓ Ask Gather
✓ Submissions
✓ Application list
✓ Application grid
✓ Existing application kebab menus
✓ Existing profile menu
✓ Existing settings
✓ Existing navigation
✓ Existing branding

ONLY add:

1. Sticky Created Forms header
2. Create Form action inside sticky header
3. Recently updated dropdown in sticky header
4. Search overlay/modal
5. Application search functionality inside that overlay

==================================================
16. FINAL ACCEPTANCE TEST
=========================

Test this exact flow:

A.

User enters dashboard.

↓

Normal dashboard appears.

B.

User scrolls down.

↓

Created Forms header reaches top.

↓

Header becomes sticky.

C.

User continues scrolling.

↓

Created Forms header remains visible.

D.

User clicks:

**+ Create Form**

↓

Existing Create Application flow opens.

E.

User clicks:

**Recently updated ▼**

↓

Sort dropdown appears.

F.

User clicks navbar:

**Search**

↓

Search overlay appears above dashboard.

↓

Search input automatically focused.

G.

User types:

"speaker"

↓

Matching applications appear.

H.

User clicks an application.

↓

Search closes.

↓

Application opens.

I.

User presses Escape.

↓

Search closes.

↓

Dashboard remains at the same scroll position.

IMPORTANT:

Implement this as an enhancement to the CURRENT dashboard, not a redesign.
Reuse existing components, state, routing, application data, sorting and creation logic wherever possible.
