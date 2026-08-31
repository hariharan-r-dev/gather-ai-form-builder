FIX THE CREATE APPLICATION FLOW. DO NOT REDESIGN THE UI.

I have attached two screenshots:

* IMAGE 1 = Dashboard where the user enters a prompt
* IMAGE 2 = Create Application page

The current behavior is incorrect because clicking "Create" immediately navigates to the Create Application page even when the user is not signed in.

Implement the correct authentication-aware flow below.

==================================================

1. DASHBOARD AI CREATION INPUT
   ==================================================

On the dashboard, the existing creation input contains:

"Describe the application you need..."

The user can type any prompt.

Example:

"Create a speaker application for a technology conference"

The existing UI must remain unchanged.

Do NOT change:

* hero background
* input size
* placeholder
* helper text
* Create button styling
* dashboard layout

==================================================
2. WHEN USER TYPES A PROMPT
===========================

Example:

User types:

"Create a scholarship application for students"

Then clicks:

Create

DO NOT immediately navigate to Create Application.

First check authentication state.

==================================================
3. IF USER IS NOT SIGNED IN
===========================

If the user is unauthenticated:

→ STOP navigation.

→ Show a sign-in/authentication modal or popup.

The popup should clearly explain:

"Sign in to create your application"

Supporting text:

"Create an account or sign in to continue building your application with Gather."

Primary action:

"Sign in"

Secondary action:

"Continue with Google" if Google authentication already exists in the product.

Also provide:

"Cancel"

The popup should appear centered above the current dashboard with a subtle backdrop.

Do NOT navigate away from the dashboard before authentication.

==================================================
4. AFTER SUCCESSFUL SIGN-IN
===========================

After the user successfully signs in:

→ Continue the action they originally requested.

Do NOT send the user back to the dashboard.

Navigate directly to:

Create application

==================================================
5. PRESERVE THE USER'S PROMPT
=============================

This is VERY IMPORTANT.

The prompt entered on the dashboard must be carried into the Create Application page.

Example:

Dashboard:

User enters:

"Create a scholarship application for students"

↓

Clicks Create

↓

Authentication popup

↓

User signs in

↓

Create Application page

The AI input on the Create Application page must already contain:

"Create a scholarship application for students"

The user can edit it before generating.

Do NOT lose the prompt during authentication or navigation.

==================================================
6. CREATE APPLICATION PAGE
==========================

The destination must be the existing Create Application page shown in IMAGE 2.

Keep the current page design.

It should show:

Create an application

Describe what you need and Gather will build it for you.

AI creation input

[ user's previously entered prompt ]

[ Generate application ]

The prompt should be editable.

Do NOT automatically generate the application immediately after navigation.

The user must explicitly click:

Generate application

==================================================
7. IF USER IS ALREADY SIGNED IN
===============================

If the user is already authenticated:

Dashboard prompt

↓

Click Create

↓

Immediately navigate to Create Application

↓

Populate the AI input with the entered prompt

↓

User reviews/edits prompt

↓

User clicks Generate application

No authentication popup should appear.

==================================================
8. EMPTY PROMPT VALIDATION
==========================

If the user clicks Create without entering anything:

Do NOT navigate.

Do NOT show the authentication popup.

Instead show a lightweight validation state near the input:

"Describe what you want to create first."

The Create button can remain disabled until there is content, if that matches the existing interaction pattern.

==================================================
9. TOP NAVIGATION "+ CREATE FORM"
=================================

The top navigation already has:

* Create Form

Clicking this should follow the same authentication logic.

If signed in:

→ Navigate to Create Application.

If not signed in:

→ Show the sign-in/authentication popup.

Because there is no prompt in this case, after authentication navigate to the blank Create Application page.

==================================================
10. RECOMMENDATION CARDS
========================

The existing:

"Start with an idea"

recommendation behavior is already implemented.

DO NOT BREAK IT.

When the user clicks:

Use this Form

the existing behavior should remain:

Recommendation prompt

↓

Create Application page

↓

Prompt populated in AI input

↓

User can edit

↓

Generate application

Do not automatically generate.

==================================================
11. AUTHENTICATION STATE
========================

Use the application's actual authentication state.

Do NOT rely on visual UI state.

Create a reusable authentication guard/helper for creation actions so the same behavior is used by:

* Dashboard Create button
* Top navigation + Create Form
* Any other future "create application" entry point

Conceptually:

handleCreateApplication(prompt):

IF user is authenticated:
navigate to Create Application with prompt

ELSE:
open authentication modal
preserve prompt
after successful authentication:
navigate to Create Application with preserved prompt

==================================================
12. IMPORTANT: DO NOT LOSE STATE
================================

If the authentication modal opens after the user typed:

"Create a volunteer application for a community event"

that exact text must still exist after authentication.

Do not reset the dashboard input.

Do not replace it with the placeholder.

Do not lose it because of a route change or authentication callback.

==================================================
13. BACK/CANCEL BEHAVIOR
========================

If the user clicks Cancel on the authentication popup:

→ close popup
→ remain on dashboard
→ preserve whatever prompt the user typed.

If the user later clicks Create again:

→ perform the authentication check again.

==================================================
14. SIGN-IN PAGE / AUTH MODAL
=============================

Use the existing Gather authentication implementation if one already exists.

Do NOT create a second authentication system.

Do NOT duplicate authentication logic.

Reuse the existing:

* sign-in state
* Google authentication
* session handling
* auth callbacks

Only add the missing gate before application creation.

==================================================
15. FINAL ACCEPTANCE TEST
=========================

TEST A — NOT SIGNED IN

1. Open dashboard.
2. Type:
   "Create a scholarship application for students"
3. Click Create.
4. Authentication popup appears.
5. User remains on dashboard.
6. Prompt is preserved.
7. User signs in.
8. User is taken directly to Create Application.
9. AI input contains:
   "Create a scholarship application for students"
10. User can edit the prompt.
11. User clicks Generate application.
12. Application generation begins.

TEST B — ALREADY SIGNED IN

1. Open dashboard.
2. Type a prompt.
3. Click Create.
4. No authentication popup.
5. Navigate directly to Create Application.
6. Prompt is already populated.
7. User can edit.
8. Generate application works.

TEST C — EMPTY PROMPT

1. Open dashboard.
2. Leave input empty.
3. Click Create.
4. Do not navigate.
5. Do not show authentication popup.
6. Show validation message.

TEST D — TOP NAV CREATE FORM

1. Click + Create Form.
2. If signed out → authentication popup.
3. If signed in → Create Application page.
4. No prompt is required.
5. Create Application page opens with an empty AI input.

TEST E — RECOMMENDATION

1. Click "Use this Form" on a recommendation.
2. Navigate to Create Application.
3. Recommendation text is populated in the AI input.
4. User can edit it.
5. Do not auto-generate.

==================================================
MOST IMPORTANT
==============

The intended architecture is:

```
         DASHBOARD
             │
    User enters prompt
             │
          Create
             │
    ┌────────┴────────┐
    │                 │
```

Signed in?          Not signed in
│                 │
YES             Auth popup
│                 │
│             Sign in
│                 │
└────────┬────────┘
│
▼
CREATE APPLICATION
│
Prompt already filled
│
User edits if needed
│
▼
Generate application

Do NOT automatically generate the application after authentication.

Authentication only unlocks access to the Create Application page.

The user must still explicitly click "Generate application".

Do not modify unrelated dashboard components.
