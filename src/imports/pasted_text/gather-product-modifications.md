MODIFY THE EXISTING GATHER PRODUCT ONLY.

Do NOT rebuild the dashboard.
Do NOT change the existing Create Application flow.
Do NOT change the existing AI prompt behavior.
Do NOT change the existing "Use this prompt" interaction — it is already implemented correctly.

This is an ADD-ON to the current implementation.

Use the two attached screenshots as the visual reference.

==================================================

1. DASHBOARD MUST ALWAYS BE THE FIRST SCREEN
   ==================================================

Whenever a user enters Gather after signing in:

→ Always land on the Dashboard.

Do NOT automatically open:

* Create Application
* An existing application
* Templates
* Application editor

The dashboard is the default entry point.

For a user with no applications, the dashboard should show the empty-state experience.

The existing dashboard structure should remain unchanged.

==================================================
2. FIRST-TIME RECOMMENDATION AREA
=================================

For a NEW USER who has ZERO applications:

Add a recommendation section BELOW the existing search/create area.

Do not move the existing search/create area.

Do not replace it.

The order should be:

1. Dashboard heading / workspace
2. Search / Create application area
3. First-time recommendation cards
4. Empty applications state

Use the same visual language as the existing Gather UI.

Section heading:

**Start with an idea**

Supporting text:

**Tell Gather what you need, or start with one of these.**

==================================================
3. RECOMMENDATION CARDS
=======================

Display recommendation cards horizontally.

Each card should contain:

[ sparkle / AI icon ]

Prompt text

[ Use this prompt ]

[ × ]

Example recommendations:

**Create a speaker application for a technology conference**

**Create a detailed attendee feedback application for a UX research workshop**

**Create a scholarship application for students**

**Create a volunteer application for a community event**

Add several additional UNIVERSAL examples.

Do NOT make all examples job-related.

The recommendations should demonstrate that Gather can create many kinds of applications.

Examples can include:

* Speaker applications
* Scholarship applications
* Event registrations
* Volunteer applications
* Workshop registrations
* Community applications
* Grant applications
* Research participant applications
* Membership applications

Keep prompts short enough to fit naturally inside the cards.

==================================================
4. CARD DESIGN
==============

Follow the attached visual reference.

Cards should be:

* Clean
* Minimal
* White/light surface
* Subtle border
* Rounded corners
* Compact
* Consistent with Gather's blue design system

Each card:

┌────────────────────────────────────────────┐
│ ✨  Create a speaker application for a     │
│     technology conference                  │
│                                            │
│     [ Use this prompt ]                 ×  │
└────────────────────────────────────────────┘

The × button should be clearly discoverable.

Do NOT make the card visually dominant over the Create Application area.

==================================================
5. RECOMMENDATIONS ARE FIRST-TIME ONLY
======================================

These recommendation cards are an onboarding aid.

Show them when:

* User is new
* User has zero applications
* User has not dismissed all recommendations

Once the user has applications, do not show this onboarding recommendation section on the normal dashboard.

Do NOT show these cards permanently to experienced users.

==================================================
6. CLOSE / DISMISS BEHAVIOR
===========================

Each recommendation has an × button.

When the user clicks ×:

1. Remove that recommendation.
2. Immediately replace it with the next recommendation.
3. Do not reload the page.
4. Do not navigate anywhere.
5. Keep the recommendation section in the same position.

Example:

Card 1
Card 2

User closes Card 1

↓

Card 3 replaces Card 1

Card 2 remains.

If Card 2 is closed:

↓

Card 4 replaces Card 2.

Continue sequentially.

==================================================
7. WHEN ALL RECOMMENDATIONS ARE DISMISSED
=========================================

After the user dismisses the final recommendation:

→ Remove the entire recommendation section.

Do NOT leave:

* Empty cards
* Blank container
* Empty heading
* Excessive whitespace

The dashboard should naturally collapse into:

Search / Create area

↓

Applications empty state

The transition should feel natural.

==================================================
8. USE THIS PROMPT — KEEP EXISTING IMPLEMENTATION
=================================================

IMPORTANT:

The existing "Use this prompt" functionality is ALREADY CORRECT.

DO NOT redesign it.

DO NOT create a new generation flow.

Keep this exact behavior:

Dashboard recommendation

"Create a speaker application for a technology conference"

↓

User clicks:

**Use this prompt**

↓

Navigate to existing:

**Create an application**

page

↓

Existing AI input is automatically populated with:

"Create a speaker application for a technology conference"

↓

User can edit the prompt

↓

User clicks:

**Generate application**

↓

Existing application-generation flow continues.

Do not automatically generate when "Use this prompt" is clicked.

==================================================
9. NEW USER EXPERIENCE
======================

The intended first-time experience is:

SIGN IN

↓

DASHBOARD

↓

User sees:

Create an application

[ Describe what you need... ]

↓

Start with an idea

Tell Gather what you need, or start with one of these.

[ Recommendation card ]
[ Recommendation card ]

↓

User can either:

A. Write their own prompt

OR

B. Click "Use this prompt"

OR

C. Dismiss recommendations

This should make the product immediately understandable without forcing the user through an onboarding tutorial.

==================================================
10. DO NOT CHANGE THESE
=======================

Leave all existing functionality untouched:

✓ Existing Gather branding
✓ Geist font
✓ Blue color system
✓ Existing dashboard layout
✓ Existing search
✓ Existing Create Application button
✓ Existing AI creation prompt
✓ Existing Create Application page
✓ Existing "Use this prompt" behavior
✓ Existing application editor
✓ Existing sections
✓ Existing question builder
✓ Existing Ask Gather
✓ Existing submissions
✓ Existing account settings
✓ Existing application settings

ONLY implement the first-time recommendation experience and ensure the dashboard is the default landing screen.

==================================================
11. FINAL UX CHECK
==================

Verify this exact flow:

New user
→ Sign in
→ Dashboard

Dashboard:

Create/search area

↓

Start with an idea

↓

Recommendation cards

↓

User clicks ×
→ Next recommendation appears

User clicks "Use this prompt"
→ Existing Create Application page
→ Prompt is prefilled
→ User edits if needed
→ Generate application

User dismisses everything
→ Recommendation section disappears
→ Empty dashboard remains clean.

IMPORTANT:

Do not turn the dashboard into a second Create Application page.

The dashboard's job is:

**Discover → Start → Manage applications**

The Create Application page's job is:

**Describe → Generate → Build**
