Update the existing **Gather** product UI. Do not rebuild the product from scratch. Modify the current design and preserve the established Gather visual system.

## BRAND & DESIGN SYSTEM

Keep the existing:

* Gather brand
* Geist typography
* Blue-based color system
* White/light-gray surfaces
* Minimal SaaS aesthetic
* Thin borders
* Subtle shadows
* Rounded cards
* Generous whitespace
* Existing top navigation style

Do not introduce gradients, illustrations, excessive colors, or unnecessary decorative elements.

The product should feel simple, calm, modern, and AI-first.

---

# CORE PRODUCT PRINCIPLE

Gather is a **universal AI application builder**.

It is NOT specifically a:

* Job application platform
* Recruitment platform
* Survey platform
* Registration-only platform

Users can create any type of application or structured submission:

* Job application
* Scholarship application
* Event registration
* Speaker submission
* Course application
* Volunteer application
* Grant application
* Community application
* Vendor application
* Contest submission
* Any custom application

Never force users to select an "Application Type".

The AI should understand the purpose from the user's description.

---

# GLOBAL NAVIGATION

Keep the top navigation simple:

**Gather**

**Applications**

**Templates**

Right side:

**Help icon**

**User avatar**

Do not add a large sidebar.

Do not add:

* Contacts
* Automations
* Insights
* Integrations
* Research Flow
* Teams
* Workspaces

These are not part of the MVP.

---

# PAGE 1 — APPLICATIONS DASHBOARD

The Applications page should be a workspace showing the applications the user has created.

The dashboard should answer:

**"What have I created?"**

It should NOT be the application creation page.

Do not put the AI prompt directly on the dashboard.

Do not put ready-made prompts on the dashboard.

Do not put the template library on the dashboard.

---

## FREE PLAN USAGE BANNER

Directly below the top navigation, add a compact usage banner for Free users.

Example:

**✦ You can collect 10 submissions this month for free.**

CTA:

**Get more submissions**

Dismiss:

**×**

Use Gather's blue color system rather than the green styling from the reference.

The banner should:

* Be subtle
* Have a light neutral/blue background
* Have a thin border
* Be approximately 56–72px high
* Be horizontally centered
* Not look like an aggressive advertisement
* Be dismissible

For Pro users, do not show this promotional banner.

---

# DASHBOARD HEADER

Main content:

Heading:

**Applications**

Supporting text:

**Manage and review the applications you've created.**

On the right:

**+ Create application**

Make this the primary CTA.

---

# SEARCH, SORT & VIEW

Below the heading add:

Search:

**Search applications...**

Sort dropdown:

**Recently updated**

Options:

* Recently updated
* Recently created
* Name A–Z
* Name Z–A

View controls:

**List**
**Grid**

Default to List view.

Keep these controls compact.

---

# APPLICATION LIST

Use a clean table/list similar to modern form-builder dashboards.

Columns:

**Application**

**Submissions**

**Status**

**Updated**

Each row should contain:

Application name
Number of submissions
Application status
Last updated date
More actions

Example:

**2026 Design Scholarship**

84 submissions

● Published

Updated 2 hours ago

Another:

**UX Workshop Registration**

42 submissions

● Draft

Updated yesterday

Another:

**Tech Conference Speaker Submissions**

126 submissions

● Published

Updated Aug 28

Another:

**Community Membership**

18 submissions

● Closed

Updated Aug 26

---

# IMPORTANT TERMINOLOGY

Use:

**Submissions**

Do NOT use:

* Responses
* Applicants
* Candidates

because Gather must work for every application use case.

Do not display:

**Application Type**

Do not force categories such as:

* Job
* Scholarship
* Event

The application name is sufficient.

---

# APPLICATION STATUS

Application status describes the state of the application itself.

Only use:

* Draft
* Published
* Closed

Do NOT use:

* Selected
* Rejected
* Shortlisted
* Accepted

Those are workflow concepts that may be relevant to some applications but not all.

---

# APPLICATION ROW ACTIONS

On hover, show a subtle three-dot menu.

For Draft:

* Edit
* Preview
* Publish
* Duplicate
* Delete

For Published:

* Edit
* Preview
* View submissions
* Copy link
* Close application
* Duplicate
* Delete

For Closed:

* View
* View submissions
* Duplicate
* Delete

Keep these actions in a simple dropdown.

---

# EMPTY DASHBOARD

If the user has no applications:

Center a clean empty state.

Heading:

**Create your first application**

Supporting text:

**Use AI to create a professional application in minutes.**

Primary CTA:

**+ Create application**

Secondary text/link:

**Explore templates**

Do NOT show the full AI prompt here.

The user must click **Create application** to enter the creation experience.

---

# PAGE 2 — CREATE APPLICATION

Clicking:

**+ Create application**

must navigate to a separate page.

This page is exclusively for creating a new application.

The Dashboard and Create Application page must feel like two separate experiences.

---

## CREATE PAGE HEADER

Provide:

**← Applications**

Then:

**Create an application**

Main heading:

**Create an application**

Supporting text:

**Describe what you need and Gather will build it for you.**

---

# AI PROMPT

Create a large central AI prompt box.

Placeholder:

**Describe the application you need...**

Below the input, show:

**Try:** Create a job application for a junior UX designer with questions about experience, portfolio and education...

Primary CTA:

**Generate application**

The AI prompt should be the dominant element of the page.

---

# PROMPT GUIDANCE

Below the AI prompt:

Heading:

**Not sure what to write?**

Supporting text:

**Tell us what you're collecting, who it's for, and what you want to know.**

Show:

**What you're creating**

*

**Who it's for**

*

**What you need to know**

Then provide one example:

**Create a job application for junior UX designers with questions about experience, portfolio, education and availability.**

Keep this educational section compact.

---

# READY-MADE PROMPTS

Below the guidance:

Heading:

**Or start with a ready-made prompt**

Supporting text:

**Choose a prompt and customize it before generating.**

Show compact prompt cards:

### Job application

Create a job application for a junior UX designer with questions about experience, portfolio and availability.

### Scholarship application

Create a scholarship application for undergraduate students with questions about academic background, achievements and financial need.

### Event registration

Create an event registration application with attendee information, preferences and accessibility requirements.

### Speaker submission

Create a speaker submission application for a technology conference with questions about experience, topic and session proposal.

### Course application

Create an application for a UX design course with questions about experience, goals and availability.

### Volunteer application

Create a volunteer application with questions about interests, skills and availability.

Clicking **Use prompt** must insert the prompt into the main AI input.

Do NOT immediately generate.

The user must be able to edit the prompt before clicking Generate.

---

# PAGE 3 — TEMPLATES

Keep Templates as a completely separate top-level page.

Do not duplicate the template library on the Applications dashboard.

Templates page should include:

Heading:

**Templates**

Search:

**Search templates...**

Categories can include:

* Popular
* Work
* Education
* Events
* Community
* Other

Template cards should show:

* Template name
* Short description
* Number of questions
* Preview
* Use template

Keep this page focused on browsing ready-made applications.

---

# APPLICATION DETAIL

When the user opens an application, use:

**← Applications / Application Name**

Top-right:

**Preview**

**Publish**

**⋮**

Below that use the primary application navigation:

**Build**

**Submissions**

Do not use "Applicants".

Do not use "Responses".

---

# BUILD SCREEN

Keep the existing three-column editor structure:

LEFT:
Sections

CENTER:
Application editor

RIGHT:
Ask Gather

The editor should contain:

## APPLICATION INTRO

At the top of the application:

**Cover image**

**Application title**

**Application description**

The intro must be inside a clean white bordered container similar to the question cards.

Example:

**+ Add cover image**

**2026 Design Scholarship**

*Tell us about your academic background, achievements and goals.*

The cover image is optional.

Do not add an Application Type field.

---

# RICH TEXT EDITING

Application title, description, and question text should support lightweight rich-text editing.

When clicked, show a compact toolbar:

**Bold**
**Italic**
**Underline**
**Insert link**
**Remove formatting**

The toolbar should only appear when the field is active.

Each icon should have a tooltip displayed directly below the icon when hovered.

The editing interaction should feel like:

**Click → Edit → Format → Click away**

not like opening a document editor.

---

# LONG DESCRIPTION

The application description should support multiple lines.

If the description becomes long:

* Allow vertical scrolling inside the description editor
* Use approximately 120–160px maximum height
* Do not let the entire application card grow indefinitely
* Do not push all questions far down
* Keep the text readable

---

# QUESTION EDITOR

Every question must clearly communicate:

**Question**

and

**Answer**

When editing:

Question

[rich text editor]

Answer configuration

[field type]

Required

Duplicate

Delete

For Multiple Choice, show:

**Answer options**

○ Beginner

○ Intermediate

○ Advanced

**+ Add option**

Options must be editable.

For Single Choice:

○ Yes

○ No

* Add option

For Dropdown:

Show editable answer options.

For Checkbox:

☐ Option 1

☐ Option 2

* Add option

For Short Answer, Long Answer, Email, Phone, Number, URL, Date and File Upload, show an appropriate applicant-facing input preview.

Change:

**Choose field type**

to:

**Answer type**

Available types:

* Short answer
* Long answer
* Email
* Phone
* Number
* URL
* Single choice
* Multiple choice
* Dropdown
* Date
* File upload
* Checkbox

---

# QUESTION EDITING LAYOUT

When a question is clicked:

Do NOT shrink the question card.

The card should expand vertically.

Structure:

QUESTION

Formatting toolbar

Question text

Answer configuration

Required / controls

The toolbar must occupy its own row.

Never compress the question text horizontally.

Other questions below should move downward naturally.

---

# AI GENERATED QUESTIONS

When Gather generates an application, it should generate both:

**Question**

and

**Answer configuration**

Example:

Question:

**What is your experience level?**

Answer options:

* Beginner
* 1–2 years
* 3–5 years
* 5+ years

The creator can edit everything.

The creator should not have to manually configure basic answer choices after AI generation.

---

# ASK GATHER

Keep the right-side AI assistant.

Heading:

**Ask Gather**

Supporting text:

**Ask Gather to edit your application.**

Suggested actions:

* Add a leadership question
* Make this shorter
* Add a portfolio question
* Make this suitable for students
* Improve these questions

Input:

**Ask Gather to change your application...**

The assistant should modify the current application rather than acting as a generic chatbot.

---

# SUBMISSIONS

Inside an application, use:

**Submissions**

Do not use "Responses".

Do not use "Applicants".

The Submissions page should show:

* Submission count
* Search
* Submission date
* Submitted information
* Uploaded files if applicable

Example:

**128 submissions**

Submission #128
Sarah Johnson
Submitted Aug 28

Submission #127
Rahul Kumar
Submitted Aug 28

If no name was collected:

**Submission #128**

Do not assume every submission belongs to a candidate or applicant.

---

# SUBMISSION DETAIL

Opening a submission should show:

* Submission date
* Submitted answers
* Uploaded files
* Contact information if collected
* Optional internal notes

Do NOT automatically show:

* Selected
* Rejected
* Shortlisted
* Candidate score
* Hiring score

These should not be part of the MVP.

---

# APPLICATION PREVIEW

Preview should show the exact applicant-facing experience:

Cover image

Application title

Description

Sections

Questions

Answer fields

Required indicators

Submit button

The preview should feel like a real public application, not an editor.

---

# PUBLISH

Publishing should be simple.

When published, show:

**Your application is live**

Provide:

**Copy link**

Optionally:

**QR code**

The main action should be sharing the application link.

---

# PRICING

Gather has exactly TWO plans.

## Free

**$0/month**

Includes:

* AI application generation
* AI editing
* 1 published application
* 10 submissions/month
* Basic templates
* Public application link
* Basic submission management
* Gather branding

## Pro

**$12/month**

Includes:

* Unlimited applications
* 1,000 submissions/month
* AI application generation
* AI editing
* All templates
* Remove Gather branding
* Custom branding
* File uploads
* Basic analytics
* CSV export
* QR codes

Do not create additional plans.

---

# UPGRADE FLOW

When Free users approach the submission limit:

Show:

**8 of 10 submissions used**

When they reach the limit:

**You've reached your 10 submission limit.**

Supporting text:

**Upgrade to Pro to continue collecting submissions.**

CTA:

**Upgrade to Pro**

---

# PLANS PAGE

Create a dedicated Plans & Billing page.

Heading:

**Simple plans. More room to gather.**

Supporting text:

**Start free and upgrade when you need more.**

Two cards:

### Free

$0/month

### Pro

$12/month

Pro should have a subtle:

**Recommended**

badge.

Keep the pricing page extremely simple.

No:

* Annual pricing toggle
* Enterprise plan
* Team plan
* Multiple tiers
* Complicated pricing matrix

---

# OVERALL MVP INFORMATION ARCHITECTURE

The final product structure should be:

Gather

├── Applications
│   ├── Dashboard
│   └── Create Application
│
├── Templates
│
└── Account
├── Plans & Billing
└── Settings

Inside an application:

Application

├── Build
├── Submissions
├── Preview
└── Publish

---

# CORE GATHER EXPERIENCE

The entire MVP should communicate this simple journey:

**Create application**

↓

**Describe what you need**

↓

**Gather generates it**

↓

**Review and edit**

↓

**Preview**

↓

**Publish**

↓

**Collect submissions**

↓

**Review submissions**

The product must remain simple throughout.

Do not copy the complexity of mature products such as SurveyMonkey, Jotform, Paperform, or Typeform.

Use their strongest UX patterns only where they improve Gather's core experience.

The final result should feel like:

**“Whatever application I need, I can describe it and Gather builds it for me.”**
