Update the existing Gather MVP UI based on the provided reference screenshots.

Do NOT rebuild the product. Modify the existing Gather interface and preserve:

* Gather branding
* Geist typography
* Blue color system
* Existing top navigation
* Existing spacing
* Existing cards
* Existing application editor
* Minimal SaaS aesthetic

The goal is to make the product feel closer to polished products such as SurveyMonkey, Jotform, Paperform and Typeform while keeping Gather much simpler.

==================================================

1. FIRST-TIME APPLICATIONS DASHBOARD
   ==================================================

When a user first enters Gather and has no applications yet, show the Applications dashboard.

Do NOT immediately show the "Not sure what to write?" instructional section.

Do NOT show:

"What you're creating + Who it's for + What you need to know"

on the initial dashboard.

That guidance belongs inside the Create Application experience if needed.

The dashboard should focus on:

* Existing applications
* Search
* Create application
* Useful ready-made AI prompts/recommendations

---

## DASHBOARD STRUCTURE

Top navigation:

Gather

Applications

Templates

Right:

Help icon

Profile avatar

Below the navigation, show the Free-plan usage banner when appropriate.

Then:

Heading:

**Applications**

Supporting text:

**Manage and review the applications you've created.**

Primary CTA:

**+ Create application**

Below this:

Search:

**Search applications...**

Sort:

**Recently updated**

View:

**List | Grid**

---

2. FIRST-TIME PROMPT RECOMMENDATIONS

---

For a new user with no applications, show a section below the search/create area.

Heading:

**Start with an idea**

Supporting text:

**Tell Gather what you need, or start with one of these.**

Show recommendation cards similar to the provided references.

Example cards:

**Create a speaker application for a technology conference**

**Create a detailed attendee feedback application for a UX research workshop**

Add more universal examples such as:

**Create a scholarship application for students**

**Create a volunteer application for a community event**

Each recommendation should have:

Sparkle/AI icon

Prompt text

**Use this prompt** button

Close "×" button on the card.

---

3. PROMPT CARD BEHAVIOR

---

These recommendation cards should rotate/sequentially appear for new users.

IMPORTANT:

If the user clicks the "×" on the first recommendation:

→ remove that recommendation

→ show the next recommendation in its place.

If the user closes another:

→ show the next recommendation.

Continue this behavior until all recommendations have been dismissed.

Once the user has dismissed all recommendations:

→ remove the recommendation section completely.

Do NOT leave a large empty space.

The dashboard should naturally return to the normal Applications empty state.

The user can still click:

**+ Create application**

at any time.

---

4. USING A READY-MADE PROMPT

---

When the user clicks:

**Use this prompt**

do NOT immediately create the application.

Navigate to:

**Create an application**

and place that prompt inside the AI creation input.

The user should be able to edit the prompt before generating.

Example:

Dashboard recommendation:

"Create a speaker application for a technology conference"

↓

Create Application page:

AI input contains:

"Create a speaker application for a technology conference"

↓

User can edit

↓

**Generate application**

---

5. AFTER ALL PROMPTS ARE DISMISSED

---

Once all recommendation cards have been closed, show a clean empty dashboard.

Example:

**No applications yet**

**Create your first application with AI.**

Primary:

**+ Create application**

Secondary:

**Explore templates**

Do not show the instructional "How to write a prompt" section on the dashboard.

---

6. AUTOSAVE NOTICE

---

Inside the application editor, show a small informational banner near the top when appropriate:

**Edits are always autosaved.**

Include:

Information icon

Dismiss "×"

Use a subtle blue/neutral treatment.

This should appear inside the application editing experience, NOT on the dashboard.

It should not take excessive vertical space.

---

7. DELETE APPLICATION

---

When the user chooses:

Delete

from the application kebab menu, show a confirmation modal.

Use the reference screenshot as the interaction model.

Modal:

**Delete application?**

Body:

**You're about to delete "Application name".**

**This will permanently delete the application and its submissions.**

Actions:

**Cancel**

**Delete**

The Delete button should use a destructive red treatment.

Cancel should be secondary.

Include an "×" close button in the top-right.

Do not use the word "form".

Always use:

**application**

because Gather is an application builder.

---

8. APPLICATION CARD — KEBAB ALWAYS VISIBLE

---

In BOTH List and Grid views, the kebab/three-dot action button must always be visible.

Do NOT only reveal it on hover.

Grid card example:

┌─────────────────────────────┐
│ 2026 Design Scholarship   ⋮ │
│                             │
│                             │
│ 84 submissions              │
│ ● Published                 │
│                             │
│ Updated 2 hours ago         │
└─────────────────────────────┘

The three-dot button should be placed in the top-right corner.

List view:

Application              Submissions   Status      Updated      ⋮

The action menu should remain accessible at all times.

Menu actions depend on application state.

Draft:

* Edit
* Preview
* Publish
* Duplicate
* Delete

Published:

* Edit
* Preview
* View submissions
* Copy link
* Close application
* Duplicate
* Delete

Closed:

* View
* View submissions
* Duplicate
* Delete

---

9. SETTINGS EXPERIENCE

---

When the user clicks:

Profile avatar
→ Account dropdown
→ Account settings

Navigate to a dedicated Settings experience.

Use a left settings sidebar similar to the provided references.

Do NOT copy all settings from large products.

Gather MVP settings should contain ONLY:

### MY ACCOUNT

* Profile

### BILLING

* Billing & usage

### SUPPORT

* What's new
* Contact support

At the bottom or top of the sidebar include:

**← Back to applications**

Keep the settings navigation compact.

---

10. SETTINGS SIDEBAR

---

Use this structure:

← Back to applications

────────────────

MY ACCOUNT

Profile

────────────────

BILLING

Billing & usage

────────────────

SUPPORT

What's new

Contact support

The currently selected page should have a subtle blue/light-blue background.

Do not add:

* Team members
* Organizations
* Groups
* Integrations
* Scheduling
* Developer
* API
* Custom domains
* Brand kit
* Security
* SSO
* Marketplace
* Audit logs
* Transfer applications

These are outside the Gather MVP.

---

11. MY ACCOUNT / PROFILE PAGE

---

When clicking:

Profile

show a clean account page.

Heading:

**My account**

Supporting text:

**Manage your personal account details.**

Create a Profile card.

Fields:

**Profile photo**

[Upload / Replace]

**Name**

[Hariharan R]

**Email**

[[hariharan.creates@gmail.com](mailto:hariharan.creates@gmail.com)]

The email should appear as the account login email.

Add a subtle note:

**Your email is used to sign in to Gather.**

If Google authentication is being used, show:

**Signed in with Google**

Do not add unnecessary profile settings.

---

12. BILLING & USAGE PAGE

---

Create a dedicated:

**Billing & usage**

page.

This page should combine subscription and product usage rather than creating separate Billing and Usage pages.

Heading:

**Billing & usage**

Supporting text:

**Manage your plan and keep track of your Gather usage.**

---

## CURRENT PLAN CARD

For Free users:

**Free**

**$0 / month**

**10 submissions / month**

Status:

**Current plan**

Primary CTA:

**Upgrade to Pro**

---

## USAGE CARD

Show the most important MVP usage metric:

**Submissions**

Example:

**6 of 10 used**

Progress bar:

██████░░░░

Supporting text:

**4 submissions remaining this month**

This is the primary usage metric because submissions are the main Free-plan limitation.

Also show:

**Published applications**

**1 of 1 used**

Supporting text:

**Free includes 1 published application.**

Keep usage focused.

Do NOT invent unnecessary metrics such as:

* Storage
* API calls
* Automation runs
* Contacts
* Team seats
* AI credits

unless those features actually exist in the MVP.

---

## PRO PLAN CARD

Show:

**Gather Pro**

**$12 / month**

Benefits:

* Unlimited applications
* 1,000 submissions/month
* Remove Gather branding
* Custom branding
* File uploads
* Analytics
* CSV export
* QR codes

CTA:

**Upgrade to Pro**

For users already on Pro:

Show:

**You're on Pro**

**$12 / month**

Button:

**Manage subscription**

---

13. WHAT'S NEW

---

Create a very simple What's New page.

Heading:

**What's new**

Supporting text:

**See what's new and improved in Gather.**

Show update cards.

Example:

**AI application generation**

Create complete applications from a simple description.

**Improved application editor**

Edit questions and answer options more easily.

**New templates**

Start faster with ready-made applications.

Use dates/version labels if appropriate.

Keep this lightweight.

Do not build a complex changelog system.

---

14. CONTACT SUPPORT

---

Gather will use **Crisp** for support.

Create a simple:

**Contact support**

page.

Heading:

**How can we help?**

Supporting text:

**Have a question or something not working? We're here to help.**

Primary CTA:

**Start a conversation**

This button should open the Crisp support/chat experience.

Also provide:

**Help center**

as a secondary link if available.

Do not build an internal support ticketing system.

Do not create a custom chat system.

---

15. PROFILE DROPDOWN

---

Update the existing profile dropdown to match these settings.

Top:

Avatar

**Hariharan R**

[hariharan.creates@gmail.com](mailto:hariharan.creates@gmail.com)

Divider

ACCOUNT

⚙ Account settings

▣ Plans & billing

Divider

RESOURCES

? Help center

✦ What's new

Divider

GROW GATHER

↗ Refer & earn

Divider

**Log out**

Keep this menu compact.

"Refer & earn" should remain as a simple MVP entry point.

Do not use "Affiliates" as the primary label.

---

16. FREE PLAN BANNER

---

Keep the existing Free-plan banner below the top navigation.

Example:

**✦ You can collect 10 submissions this month for free.**

CTA:

**Get more submissions**

Close:

×

Use Gather's blue visual language.

For Pro users, do not show the promotional upgrade banner.

---

17. DO NOT DUPLICATE INFORMATION

---

Important UX rule:

Dashboard:
→ Applications + recommendations

Create Application:
→ AI prompt + prompt guidance + ready-made prompts

Templates:
→ Template library

Settings:
→ Account + Billing & usage + Support

Application Editor:
→ Build + Submissions + Preview + Publish

Do not mix these experiences.

---

18. FINAL GATHER MVP NAVIGATION

---

Top navigation:

Gather

Applications

Templates

?

Avatar

Applications dashboard:

Applications
↓
Search
↓
List/Grid
↓
Applications
↓
Recommendation prompts for new users

Create Application:

Create an application
↓
AI prompt
↓
Prompt guidance
↓
Ready-made prompts
↓
Generate

Application Editor:

Build
Submissions
Preview
Publish

Settings:

My Account
→ Profile

Billing
→ Billing & usage

Support
→ What's new
→ Contact support

---

19. IMPORTANT UX PRINCIPLE

---

Gather should never feel like a copy of SurveyMonkey, Jotform, Paperform or Typeform.

Use their proven interaction patterns where useful, but simplify aggressively.

The MVP should communicate one core promise:

**Describe what you need. Gather builds the application.**

The user should be able to understand the product without reading instructions.

Prioritize:

* Fast creation
* Clear dashboard
* Useful prompts
* Simple editing
* Easy publishing
* Submission collection
* Simple billing
* Minimal settings

Avoid adding features simply because competitors have them.
