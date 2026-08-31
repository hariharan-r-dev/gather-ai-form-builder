IMPORTANT: MODIFY THE EXISTING GATHER IMPLEMENTATION.

Do not create a separate prototype.
Do not rebuild the product from scratch.
Do not introduce new navigation patterns.
Use the existing Gather components, data, interactions and visual style, but correct the information architecture and editor behavior below.

The attached reference screenshots are the visual/interaction references. Match their structure closely while keeping Gather's existing blue visual identity.

==================================================

1. TOP NAVIGATION — SIMPLIFY IT
   ==================================================

The top navigation throughout the product must contain ONLY:

Left:
**Gather**

Center/right:
**Search**

Right:
**Profile avatar**

Do NOT show:

* Applications in the top navigation
* Templates in the top navigation
* Home
* Integrations
* Help icon as a primary navigation item
* Other product modules

The top navigation should be minimal and similar to the reference screenshots.

Example:

Gather                                      [ Search ]    [HR]

The Gather wordmark should remain on the left.

Clicking the Gather logo returns to the main dashboard.

==================================================
2. MAIN DASHBOARD
=================

The dashboard is the application management home.

It should NOT contain the large AI creation interface permanently.

For a new user with zero applications, show:

**My workspace**

Then the empty state / creation experience.

The primary action is:

**Create application**

When the user starts typing into the creation prompt, the interaction should immediately transition into the application creation flow.

Do NOT require the user to separately select:

* Application type
* Job application
* Feedback application
* Registration application
* etc.

Gather creates a generic application.

==================================================
3. CREATE APPLICATION — AI INPUT
================================

On the Create Application screen, use the existing AI creation interface.

Heading:

**Create an application**

Supporting text:

**Describe what you need and Gather will build it for you.**

Large input:

**Describe the application you need...**

Primary action:

**Generate application**

IMPORTANT INTERACTION:

If the user begins typing into the AI input, the application creation flow has started.

The input should remain active and should not navigate back to the dashboard.

When the user submits the prompt:

1. Create an application draft.
2. Navigate into the application editor.
3. Populate the application title.
4. Populate the application description.
5. Generate relevant sections and questions.
6. Keep everything editable.
7. Do NOT publish automatically.

==================================================
4. APPLICATION EDITOR — NEW STRUCTURE
=====================================

The application editor should follow the structure shown in the reference.

TOP:

Gather                                         Search    Profile

Then editor header:

← Applications / Application Name

Right side:

Build
Submissions
Preview
Publish
⋮

Below this, show:

**Edits are always autosaved.**

Use the existing blue informational banner.

==================================================
5. ASK GATHER MUST BE ON THE LEFT
=================================

IMPORTANT:

Move **Ask Gather** to the LEFT side of the editor.

The AI assistant should NOT be on the right anymore.

Editor layout:

┌─────────────────────────────────────────────┐
│ Ask Gather │ Application editor             │
│            │                                │
│ AI chat    │ Application content            │
│            │                                │
│            │                                │
└─────────────────────────────────────────────┘

Ask Gather should function as the AI assistant for editing the application.

Example suggestions:

**Add a portfolio question**

**Make these questions shorter**

**Add a leadership question**

**Improve these questions**

The input at the bottom:

**Ask Gather to change your application...**

Keep the assistant visually secondary to the actual application editor.

==================================================
6. SECTIONS MUST BE AT THE BOTTOM
=================================

Do NOT keep the Sections navigation as a permanent left sidebar.

The sections should appear as a horizontal navigation at the BOTTOM of the editor, matching the reference screenshot.

Example:

* Add section

Personal Information
Background
Experience
Additional Questions
Ending

Each section should be selectable.

The currently selected section should have a clear active state.

The bottom section bar should remain visible while editing.

==================================================
7. SECTION DRAG & DROP
======================

The bottom section navigation must support reordering.

Each section:

☷ Personal Information
☷ Background
☷ Experience
☷ Additional Questions

must be draggable.

When the user drags a section:

* Show a drag state.
* Allow the section to be moved left/right.
* Persist the new order.
* The content should update according to the new order.

Do NOT require a separate "Save order" button.

Changes are autosaved.

==================================================
8. SECTION KEBAB MENU
=====================

Every section in the bottom navigation must have an ALWAYS-VISIBLE kebab icon.

Example:

Personal Information ⋮

Clicking ⋮ opens:

**Rename**

**Duplicate**

**Delete**

Rename:

* Open inline editing or a small modal.
* Save automatically.

Duplicate:

* Create a copy immediately after the original section.

Delete:

* Show confirmation modal.

Confirmation:

**Delete section?**

You're about to delete "Experience".

This will remove the section and its questions.

[Cancel] [Delete]

Delete is destructive/red.

IMPORTANT:

Do NOT hide the kebab until hover.

It must always be discoverable.

==================================================
9. QUESTIONS MUST ALSO BE DRAGGABLE
===================================

Inside every section, questions must support drag-and-drop ordering.

Example:

Personal Information

☷ Full name
Short answer   Required

☷ Email
Email   Required

☷ Portfolio
URL   Required

☷ Why are you interested?
Long answer

Each question should have a drag handle.

The user can reorder questions vertically.

Changes autosave immediately.

==================================================
10. QUESTION KEBAB
==================

Every question should have an ALWAYS-VISIBLE kebab menu.

Example:

Full name                                      ⋮

Menu:

Edit

Duplicate

Delete

The question menu should NOT appear only on hover.

==================================================
11. QUESTION EDITOR
===================

Clicking a question opens its editing state without shrinking the entire card.

The card should EXPAND vertically.

Never reduce the width/height of the question container when focused.

At the top:

QUESTION

Rich text toolbar:

B   I   U   Link   Remove formatting

Below it:

[Question text]

Then:

ANSWER

The answer configuration should be visible directly below.

==================================================
12. ANSWER CONFIGURATION
========================

This is especially important for choice questions.

If the question type is:

Multiple choice

Show:

ANSWER

○ Option 1
○ Option 2
○ Option 3

[+ Add option]

Every option must be editable.

The creator must be able to:

* Edit option text
* Add option
* Delete option
* Reorder option

For Single choice:

○ Option 1
○ Option 2

For Checkbox:

☐ Option 1
☐ Option 2

For Dropdown:

Option 1
Option 2
Option 3

For text-based questions:

Show the applicant-facing answer field preview.

==================================================
13. QUESTION TYPES
==================

Keep these question types:

Short answer
Long answer
Email
Phone
Number
URL
Single choice
Multiple choice
Dropdown
Date
File upload
Checkbox

When a field type is selected, immediately show the appropriate ANSWER configuration.

Do not show only:

"Multiple choice"

The user must be able to configure the actual answer options.

==================================================
14. APPLICATION HEADER / COVER
==============================

Inside the editor, the application header should be a single card.

At the top:

[ Image icon ] Add cover image

Below:

Application title

Application description

Example:

**2026 Design Scholarship**

Tell us about your experience, background and goals.

The title and description belong inside the same container.

They should NOT appear floating separately from the application.

==================================================
15. COVER IMAGE
===============

Clicking:

**Add cover image**

should allow the creator to add/upload a cover image.

After adding an image:

* Show the image at the top of the application header.
* Allow replacing it.
* Allow removing it.

Keep this lightweight for MVP.

==================================================
16. TITLE + DESCRIPTION EDITING
===============================

Title and description are editable directly inside the header card.

When focused:

Show the rich text toolbar.

Toolbar:

Bold
Italic
Underline
Insert link
Remove formatting

The toolbar should appear above the active field.

Hovering an icon should show its tooltip below the icon.

Example:

Bold
Italic
Underline
Insert link
Clear formatting

The title/description container must expand rather than shrink.

==================================================
17. LONG DESCRIPTION BEHAVIOR
=============================

If the description becomes long:

* Allow multiple lines.
* Do NOT force the entire page/card to become extremely tall.
* Use a controlled editor height.
* Allow internal scrolling after approximately 120–160px.
* Preserve the surrounding layout.

The editor must never visually collapse when focused.

==================================================
18. SUBMISSIONS — UNPUBLISHED APPLICATION
=========================================

If the application is still unpublished and the user clicks:

**Submissions**

show the empty state.

Use:

**No submissions yet**

Supporting text:

**Once you publish and share your application, submissions will appear here.**

Primary action:

**Publish application**

Do NOT show fake submission data.

Do NOT show the generic form builder table.

The user should understand that submissions become available after publishing.

==================================================
19. APPLICATION SETTINGS — NOT ACCOUNT SETTINGS
===============================================

There are TWO completely different settings concepts.

A. ACCOUNT SETTINGS
Accessed from profile avatar.

Contains:

My account
Billing & usage
What's new
Contact support

B. APPLICATION SETTINGS
Accessed from the application's ⋮ menu.

This is ONLY for the current application.

Application Settings should include things such as:

**General**

Application name
Description

**Submission settings**

Allow submissions
Close submissions

**Confirmation**

Thank-you message after submission

**Privacy**

Basic submission/privacy controls

Do NOT open Account Settings when clicking the application settings menu.

This was incorrectly implemented previously.

==================================================
20. APPLICATION KEBAB MENU
==========================

Top-right ⋮ in the application editor should show:

Save draft

Duplicate

Settings

Delete

The Delete option must show the confirmation modal.

==================================================
21. DELETE APPLICATION
======================

Modal:

**Delete application?**

You're about to delete "Application Name".

This will permanently delete the application and its submissions.

[Cancel]

[Delete]

Delete must be destructive/red.

Do not say "Delete form?"

==================================================
22. PROFILE MENU
================

Clicking the top-right profile avatar opens:

Hariharan R
[hariharan.creates@gmail.com](mailto:hariharan.creates@gmail.com)

────────────

ACCOUNT

Account settings

Plans & billing

────────────

RESOURCES

What's new

Contact support

────────────

GROW GATHER

Refer & earn

────────────

Log out

Keep it compact.

==================================================
23. SETTINGS SIDEBAR
====================

When the user enters Account Settings, use a dedicated settings layout.

LEFT SIDEBAR:

← Back to applications

MY ACCOUNT

Profile

BILLING

Billing & usage

SUPPORT

What's new

Contact support

Do NOT add enterprise features.

==================================================
24. BILLING & USAGE
===================

Free plan:

**Free**

$0 / month

Usage:

Submissions
6 / 10 used

Published applications
1 / 1 used

Then:

**Gather Pro**

$12 / month

Includes:

Unlimited applications
1,000 submissions/month
Remove Gather branding
Custom branding
File uploads
Analytics
CSV export
QR codes

[Upgrade to Pro]

==================================================
25. DASHBOARD LIST / GRID
=========================

Existing applications can be shown in:

List view
Grid view

Keep the current toggle.

Kebab must ALWAYS be visible on every application.

Example:

2026 Design Scholarship                         ⋮

UX Workshop Registration                       ⋮

Do NOT make the kebab hover-only.

==================================================
26. IMPORTANT INFORMATION ARCHITECTURE
======================================

The final product must follow this exact structure:

GATHER

Dashboard
│
├── Applications
│
│   ├── Application editor
│   │   ├── Ask Gather — LEFT
│   │   ├── Application content — CENTER
│   │   ├── Bottom section navigation
│   │   ├── Draggable sections
│   │   └── Draggable questions
│   │
│   └── Submissions
│
├── Create Application
│
├── Templates
│
└── Account Settings
├── My account
├── Billing & usage
├── What's new
└── Contact support

IMPORTANT:

Do not put Sections in a permanent left sidebar.

Do not put Ask Gather on the right.

Do not mix Account Settings with Application Settings.

Do not make the dashboard itself the application creation editor.

==================================================
27. VISUAL PRIORITY
===================

Use the attached screenshots as UX references for:

* Layout density
* Card structure
* Editor navigation
* Bottom section tabs
* Empty states
* Kebab menus
* Settings structure
* Submission empty state
* Drag/reorder behavior

But retain Gather's existing:

* Blue primary action
* White cards
* Light gray background
* Rounded corners
* Clean typography
* Minimal visual hierarchy

Do not copy another product's branding.

==================================================
28. FINAL ACCEPTANCE CHECK
==========================

Before considering this implementation complete, verify:

✓ Top nav = Gather + Search + Profile

✓ Dashboard is separate from Create Application

✓ Typing into AI prompt starts creation flow

✓ Application editor has Ask Gather on LEFT

✓ Sections are at BOTTOM

✓ Sections are draggable

✓ Questions are draggable

✓ Section kebab always visible

✓ Section menu = Rename / Duplicate / Delete

✓ Question kebab always visible

✓ Question menu = Edit / Duplicate / Delete

✓ Multiple Choice shows actual editable options

✓ All choice types show answer configuration

✓ Title + description are inside one application header card

✓ Cover image exists above title/description

✓ Rich text toolbar works without shrinking cards

✓ Long descriptions scroll internally

✓ Unpublished Submissions shows a proper empty state

✓ Application ⋮ → Settings opens APPLICATION settings

✓ Profile → Account Settings opens ACCOUNT settings

✓ Application delete has confirmation modal

✓ All changes autosave

✓ No job-specific application statuses

✓ No unnecessary enterprise/team/integration features

MOST IMPORTANT:

The editor should feel like a focused application-building workspace, NOT a generic form builder.

The user should always understand:

"Dashboard = manage applications"
"Create = generate an application"
"Editor = build an application"
"Submissions = review collected submissions"
"Application Settings = configure this application"
"Account Settings = configure my Gather account"
