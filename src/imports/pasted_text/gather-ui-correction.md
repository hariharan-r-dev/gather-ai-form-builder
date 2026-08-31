IMPORTANT: This is a CORRECTION PASS to the existing Gather UI.

Do NOT create a new design system.
Do NOT redesign the entire product.
Do NOT preserve the current dashboard structure if it conflicts with the requirements below.

Inspect the existing Gather implementation and MODIFY the existing screens/components to match the following exact behavior.

The current screenshot shows the Applications dashboard with 3 applications. That means the previous implementation has incorrectly prioritized the existing application list.

The most important missing requirement is the **NEW USER / EMPTY DASHBOARD EXPERIENCE**.

==================================================

1. FIX THE APPLICATIONS DASHBOARD
   ==================================================

The Applications dashboard must have TWO states:

STATE A — New user / no applications

STATE B — User already has applications

The current implementation should support both states.

---

## STATE A — NO APPLICATIONS

When there are zero applications:

Top navigation remains:

Gather
Applications
Templates
Help
Profile

Below navigation:

[Free plan usage banner]

Then:

Applications

Manage and review the applications you've created.

```
                [+ Create application]
```

Below:

[ Search applications... ]

Do NOT show the application table.

Do NOT show fake applications.

Instead show:

---

**Start with an idea**

Tell Gather what you need, or start with one of these.

Then show recommendation prompt cards.

Example:

✦

**Create a speaker application for a technology conference**

[Use this prompt]                                      ×

Another:

✦

**Create a detailed attendee application for a UX research workshop**

[Use this prompt]                                      ×

Use additional universal examples:

**Create a scholarship application for students**

**Create a volunteer application for a community event**

These are NOT templates.

They are ready-made AI prompts.

---

PROMPT CARD BEHAVIOR

When the user clicks ×:

1. Remove that card.
2. Immediately replace it with the next recommendation.
3. Do not leave an empty gap.
4. Continue until all recommendations have been dismissed.
5. After all recommendations are dismissed, remove the recommendation section.

When the user clicks:

**Use this prompt**

navigate to the Create Application page.

The selected prompt must already be populated inside the AI input.

Do NOT automatically generate the application.

---

## STATE B — EXISTING APPLICATIONS

If the user has applications, show:

Applications

Manage and review the applications you've created.

[+ Create application]

[Search applications...]

[Recently updated ▼] [List] [Grid]

Then the application list.

The current screenshot's list structure is acceptable, but ensure:

* Kebab icon is ALWAYS visible.
* Kebab is NOT hover-only.
* Application status uses only Draft / Published / Closed.
* Use "Submissions", never "Responses".
* Never show application type.
* Never show job-specific statuses such as Selected or Rejected.

==================================================
2. FREE USAGE BANNER
====================

The current dashboard is missing the Free-plan banner.

Add it directly below the top navigation.

Use a compact horizontal banner:

✦ You can collect **10 submissions** this month for free.

[Get more submissions]                                      ×

Use Gather's blue visual language.

Do not use green.

Do not make it visually dominant.

The banner should only appear for Free users.

For Pro users, hide this banner.

==================================================
3. CREATE APPLICATION MUST BE A SEPARATE PAGE
=============================================

Clicking:

**+ Create application**

must NOT create an application immediately.

It must navigate to a separate:

**Create an application**

page.

This page should contain the AI creation experience.

Heading:

**Create an application**

Supporting text:

**Describe what you need and Gather will build it for you.**

Large AI input:

**Describe the application you need...**

Primary:

**Generate application**

Below:

**Not sure what to write?**

Tell us what you're collecting, who it's for, and what you want to know.

Show:

**What you're creating**

*

**Who it's for**

*

**What you need to know**

Then an example.

Then:

**Or start with a ready-made prompt**

Show prompt cards.

IMPORTANT:

The dashboard recommendation prompts and Create Application ready-made prompts are different UI contexts but use the same underlying prompt data.

==================================================
4. DO NOT SHOW APPLICATION CREATION ON DASHBOARD
================================================

The dashboard must NOT contain:

* Large AI prompt box
* "Describe what you're trying to create"
* Prompt-writing tutorial
* "What you're creating / Who it's for / What you need to know"

Those belong on the Create Application page.

Dashboard = manage applications.

Create page = create applications.

Templates = browse templates.

Keep these experiences separate.

==================================================
5. APPLICATION CARD / LIST KEBAB
================================

In List view, the kebab must ALWAYS be visible.

Example:

2026 Design Scholarship
84 submissions
Published
Aug 28
⋮

In Grid view, the kebab must ALWAYS be visible in the top-right corner of every card.

Do not use hover-only visibility.

==================================================
6. DELETE APPLICATION MODAL
===========================

When:

⋮ → Delete

show:

**Delete application?**

You're about to delete "Application Name".

This will permanently delete the application and its submissions.

Buttons:

[Cancel]

[Delete]

Delete is destructive/red.

Cancel is secondary.

Include × in the top-right.

Do NOT say "Delete form?"

Always say:

**Delete application?**

==================================================
7. AUTOSAVE BANNER
==================

Inside the application editor only, show:

ⓘ Edits are always autosaved.                                      ×

Use a subtle blue/neutral informational banner.

Do NOT show this on the dashboard.

==================================================
8. SETTINGS
===========

Click:

Profile avatar
→ Account settings

Open a dedicated Settings layout.

Use a LEFT SIDEBAR.

Sidebar must contain ONLY:

← Back to applications

MY ACCOUNT

Profile

BILLING

Billing & usage

SUPPORT

What's new

Contact support

Do NOT add:

Organizations
Team members
Groups
Integrations
Scheduling
Developer
API
Custom domain
Brand kit
Security
Marketplace
Audit logs
SSO

These are NOT part of the Gather MVP.

==================================================
9. PROFILE PAGE
===============

Settings → Profile

Heading:

**My account**

Supporting text:

**Manage your personal account details.**

Card:

Profile photo

[Avatar]

Name

[Hariharan R]

Email

[[hariharan.creates@gmail.com](mailto:hariharan.creates@gmail.com)]

If applicable:

**Signed in with Google**

Keep this page minimal.

==================================================
10. BILLING & USAGE PAGE
========================

Settings → Billing & usage

Heading:

**Billing & usage**

Supporting text:

**Manage your plan and keep track of your Gather usage.**

Show current plan.

FREE:

**Free**

$0 / month

Then:

### Submissions

**6 of 10 used**

Progress bar

**4 submissions remaining this month**

Then:

### Published applications

**1 of 1 used**

**Free includes 1 published application.**

Then Pro upgrade card:

**Gather Pro**

**$12 / month**

Benefits:

Unlimited applications
1,000 submissions/month
Remove Gather branding
Custom branding
File uploads
Analytics
CSV export
QR codes

CTA:

**Upgrade to Pro**

Do NOT show irrelevant usage metrics such as storage, API calls, contacts, automation runs, etc.

==================================================
11. WHAT'S NEW
==============

Settings → What's new

Heading:

**What's new**

Supporting text:

**See what's new and improved in Gather.**

Use simple update cards.

Example:

**AI application generation**

Create complete applications from a simple description.

**Improved application editor**

Edit questions and answer options more easily.

**New templates**

Start faster with ready-made applications.

==================================================
12. CONTACT SUPPORT
===================

Settings → Contact support

Heading:

**How can we help?**

Supporting text:

**Have a question or something not working? We're here to help.**

Primary:

**Start a conversation**

This should open the Crisp support experience.

Secondary:

**Help center**

Do NOT build a custom support ticket system.

==================================================
13. PROFILE DROPDOWN
====================

Clicking the top-right avatar should open:

Hariharan R
[hariharan.creates@gmail.com](mailto:hariharan.creates@gmail.com)

────────────

ACCOUNT

Account settings

Plans & billing

────────────

RESOURCES

Help center

What's new

────────────

GROW GATHER

Refer & earn

────────────

Log out

Keep it compact.

Do not add organizations, teams, integrations, scheduling, etc.

==================================================
14. APPLICATION EDITOR
======================

Do not break the existing editor.

Keep:

LEFT:
Sections

CENTER:
Application

RIGHT:
Ask Gather

At the top of the application:

[+ Add cover image]

Then a bordered intro container:

Application title

Application description

Both title and description should be editable.

The intro must visually belong to the application, like a question/card container.

==================================================
15. RICH TEXT EDITING
=====================

When title, description or question is focused:

Show:

Bold
Italic
Underline
Insert link
Remove formatting

The toolbar should NOT cause the card to shrink.

The card should expand vertically.

The question text must remain at a comfortable width.

For long descriptions:

* Allow multiple lines
* Maximum editor height around 120–160px
* Internal vertical scrolling
* Do not allow the entire card to become excessively tall

Tooltips should appear below icons on hover.

==================================================
16. QUESTION + ANSWER
=====================

Every question must show BOTH:

QUESTION

and

ANSWER

For Multiple Choice:

Question:

**What is your experience level?**

Answer:

○ Beginner

○ 1–2 years

○ 3–5 years

○ 5+ years

[+ Add option]

The creator must be able to edit every option.

For Single Choice:

○ Yes
○ No
[+ Add option]

For Dropdown:

Show editable options.

For Checkbox:

☐ Option 1
☐ Option 2
[+ Add option]

For text fields:

Show an applicant-facing preview.

Available answer types:

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

==================================================
17. IMPORTANT TERMINOLOGY
=========================

Throughout Gather:

Use:

Application
Applications
Submission
Submissions

Do NOT use:

Form
Forms
Response
Responses
Applicant
Applicants
Candidate
Candidates

unless those words are actually part of user-entered content.

==================================================
18. DO NOT CHANGE
=================

Do not change:

* Gather logo/name
* Geist font
* Existing blue palette
* Top navigation
* Existing application editor concept
* Ask Gather concept
* Templates top navigation
* General minimal aesthetic

Do not introduce:

* Sidebar navigation on the main dashboard
* Teams
* Organizations
* Integrations
* Advanced analytics
* Complex permissions
* Enterprise features

==================================================
19. REQUIRED TEST STATES
========================

Make sure the prototype supports these states:

1. New user / 0 applications
2. New user with recommendation prompts
3. Recommendation dismissed → next recommendation appears
4. All recommendations dismissed
5. User clicks Use this prompt
6. Create Application page with prompt prefilled
7. User generates application
8. Existing applications dashboard
9. List view
10. Grid view
11. Kebab always visible
12. Delete confirmation
13. Profile dropdown
14. Settings → Profile
15. Settings → Billing & usage
16. Settings → What's new
17. Settings → Contact support
18. Free usage state
19. Pro usage state

Prioritize implementing these interaction states rather than adding new features.

The most important correction is:

**Dashboard ≠ Create Application.**

Dashboard manages existing applications.

Create Application creates a new application.

Templates browses templates.

Settings manages the account.

Keep these four experiences clearly separated.
