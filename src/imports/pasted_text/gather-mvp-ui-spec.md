Design and build the complete **Gather** MVP web application UI.

## Product

**Name:** Gather
**Category:** AI Application Builder

Gather lets users create professional applications in minutes by simply describing what they need. The core experience is:

**Describe → Generate → Edit → Preview → Publish → Collect → Review**

The product should feel extremely simple and focused. Do not make it feel like a complex enterprise form builder, ATS, CRM, survey platform, or project-management tool.

The core product promise is:

**“Tell us what you need. We’ll build the application.”**

---

# Brand & Visual Direction

Create a polished modern SaaS interface using:

* **Font:** Geist
* **Primary brand color:** Blue
* Primary blue: `#2563EB`
* Hover/darker blue: `#1D4ED8`
* Light blue: `#EFF6FF`
* Background: `#F8FAFC`
* Surface: `#FFFFFF`
* Primary text: `#0F172A`
* Secondary text: `#64748B`
* Border: `#E2E8F0`

Use blue primarily for actions, active states, links, AI interactions, and important highlights.

Visual personality:

* Minimal
* Clean
* Modern
* Intelligent
* Professional
* Friendly
* Calm
* AI-native without looking futuristic

Avoid:

* Excessive gradients
* Neon colors
* Glassmorphism
* Heavy shadows
* Excessive rounded cards
* Overly colorful dashboards
* Enterprise-style complexity
* Unnecessary decorative elements

Use subtle borders, restrained shadows, generous whitespace, clear hierarchy, and consistent 8px spacing.

Use approximately 8–12px corner radius for cards, inputs and buttons.

---

# Overall Product Philosophy

The interface should make users feel:

**“I don't need to learn how to build forms. I just tell Gather what I need.”**

Do not expose unnecessary configuration.

Prioritize the AI creation experience.

The application editor should still give users control, but it should never feel overwhelming.

---

# Authentication Behavior

The product should initially open directly into the dashboard experience rather than forcing a login screen.

Users can explore the dashboard and templates.

When a user tries to perform an account-required action such as:

* Create an application
* Save a draft
* Publish
* Access responses

show a clean **Sign in / Sign up modal**.

The authentication modal should feel lightweight and non-disruptive.

Include:

* Sign in
* Sign up
* Email
* Password
* Continue with Google
* Close button

Allow switching between Sign in and Sign up within the same modal.

---

# GLOBAL NAVIGATION

Create a simple application header.

Left:

**Gather** wordmark.

Center/left navigation:

* Applications
* Templates

Right:

* Help icon
* User avatar / Sign in

Keep navigation minimal.

Do not add unnecessary navigation items.

---

# 1. DASHBOARD

The dashboard is the first major screen.

The dashboard should immediately communicate:

**Create an application**

The primary action should be highly visible.

### Header

* Gather logo/wordmark
* Applications
* Templates
* Help
* User/avatar

### Main content

Heading:

**Create an application**

Supporting text:

**Describe what you need and Gather will build it for you.**

Create a large AI prompt/input area.

Placeholder:

**“Create a job application for a junior UX designer...”**

Include a subtle AI/sparkle icon.

Primary button:

**Generate application**

Below the prompt, show a small secondary option:

**or start from a template**

---

# Templates Section

Below the AI creation area, show a clean template grid.

Heading:

**Start with a template**

Supporting text:

**Get started quickly with a ready-made application.**

Show template cards for:

* Job Application
* Scholarship Application
* Event Application
* Course Application
* Volunteer Application
* Community Application
* Speaker Application
* Grant Application
* Vendor Application

Each card should contain:

* Small simple icon
* Template name
* One-line description
* Subtle hover state

Do not make templates visually dominant over AI creation.

---

# Recent Applications

Below templates, show recent applications.

Each application card/list item should show:

* Application name
* Type
* Number of responses
* Status
* Last updated

Statuses:

* Draft
* Published
* Closed

Include an empty state when there are no applications:

**Your applications will appear here.**

CTA:

**Create your first application**

---

# CREATE APPLICATION

When the user clicks the **+ Create** button or Generate Application, open a dedicated application creation page.

The page should feel focused and distraction-free.

---

# CREATE PAGE HEADER

Left:

* Back to Applications
* Gather logo

Center/left:

Application name once generated.

Right:

* Preview
* Publish
* More menu

More menu can contain:

* Save draft
* Duplicate
* Delete

The header should remain sticky.

---

# AI CREATION AREA

At the top of the creation page, provide a prominent AI input/search-style bar.

Heading:

**What do you want to create?**

Large input:

**“Create an application for...”**

Example:

**“Create a scholarship application for undergraduate students interested in technology.”**

Primary CTA:

**Generate**

Allow users to edit their prompt before generating.

---

# AI GENERATION EXPERIENCE

When Generate is clicked, show a polished generation state.

Do not use a generic loading spinner.

Show a short progress sequence:

**Creating your application**

✓ Understanding your requirements
✓ Planning sections
✓ Creating questions
✓ Choosing field types
✓ Reviewing application

Then transition smoothly into the generated application editor.

---

# GENERATED APPLICATION EDITOR

Use a clean three-column desktop layout.

### Left sidebar — Application structure

Show:

**Sections**

* Personal Information
* Background
* Experience
* Additional Questions

Allow:

* Reorder sections
* Add section
* Rename section

CTA:

**+ Add section**

---

### Center — Application editor

Show the actual application being built.

Example:

**Junior UX Designer Application**

Description:

**Tell us about your experience, background and design process.**

Section:

**Personal Information**

Question cards:

**Full name**

Short answer

Required

**Email**

Email

Required

**Portfolio**

URL

Required

Each question card should have simple controls:

* Edit
* Duplicate
* Delete
* Required toggle

CTA:

**+ Add question**

Supported field types for MVP:

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

# AI ASSISTANT

Right sidebar should contain a lightweight AI editing assistant.

Header:

**✨ Ask Gather**

Placeholder:

**“Ask Gather to change your application...”**

Example suggestions:

* Add a leadership question
* Make this shorter
* Add a portfolio question
* Make this suitable for students
* Improve these questions

When the user submits an instruction, update the application directly.

Examples:

User:

**“Add a question about leadership experience.”**

AI:

**Added a leadership question under Experience.**

User:

**“Make this application shorter.”**

AI:

**Removed 4 redundant questions.**

The AI assistant should feel like a natural editing tool, not a separate chatbot product.

---

# EDITOR INTERACTION

Allow both:

**Manual editing**

and

**AI editing**

Users should never be forced to use AI.

The interface should make editing extremely easy.

---

# PREVIEW

Clicking Preview opens the applicant-facing version.

Provide:

* Desktop preview
* Mobile preview

The preview should look like a real polished application, not an editor.

Example:

**Junior UX Designer**

**We're looking for a junior UX designer to join our product team.**

Then show the actual fields.

Include:

**Back to editor**

and:

**Test application**

---

# PUBLISH

Clicking Publish should open a simple publish confirmation.

Show:

**Your application is ready to publish**

Application:

**Junior UX Designer**

Status:

**Ready to publish**

Application URL:

`apply.gather.com/junior-ux-designer`

Actions:

**Copy link**

**Download QR**

Primary CTA:

**Publish application**

After publishing:

**Your application is live 🎉**

Show the public URL prominently.

Allow:

* Copy link
* Open application
* Download QR
* Unpublish

---

# RESPONSES / APPLICATIONS

After publishing, users need a simple way to review submissions.

Inside each application, provide:

* Overview
* Responses

Do not build a full ATS.

---

# APPLICATION OVERVIEW

Show simple metrics:

**Views**

1,248

**Started**

632

**Submitted**

428

**Completion rate**

67.7%

Keep analytics minimal.

---

# RESPONSES SCREEN

Header:

**Junior UX Designer**

Show:

* Total applications
* New
* Reviewing
* Shortlisted
* Rejected

Create a clean applicant table.

Columns:

* Applicant
* Email
* Submitted
* Status

Example:

Sarah Johnson | [sarah@email.com](mailto:sarah@email.com) | Aug 28 | Reviewing

Rahul Kumar | [rahul@email.com](mailto:rahul@email.com) | Aug 28 | New

Alex Thomas | [alex@email.com](mailto:alex@email.com) | Aug 27 | Shortlisted

Provide simple filtering by status.

---

# APPLICANT DETAIL

Clicking an applicant opens a detailed view.

Show:

Applicant name

Submission date

Status dropdown:

* New
* Reviewing
* Shortlisted
* Rejected

Contact information

Application answers

Uploaded files

Notes

Actions:

* Shortlist
* Reject

Keep this much simpler than a traditional ATS.

---

# AI APPLICANT SUMMARY

Include this as a subtle future-ready component, but keep it lightweight.

Example:

**AI Summary**

“4 years of UX experience, strong SaaS background, experienced with Figma and user research.”

Do not implement complex AI ranking or automated hiring decisions.

The product should assist review, not make hiring decisions.

---

# APPLICATION SETTINGS

Keep settings simple.

Sections:

### General

* Application name
* Description
* Status
* Delete application

### Appearance

* Logo
* Brand color
* Button style

### Submission

* Confirmation message

### Notifications

* New application notification
* Applicant confirmation

### Share

* Public URL
* QR code

---

# APPLICATION CREATION + SAVE STATES

Support:

* Draft
* Published
* Closed

The user should be able to:

* Save draft
* Preview
* Publish
* Unpublish
* Delete

---

# + CREATE BUTTON

The main dashboard should have a prominent **+** create action.

Clicking it should immediately start the application creation experience.

The + button can appear:

* In the dashboard header
* Near the Applications section
* As a floating/simple action where appropriate

Do not overuse it.

---

# EMPTY STATES

Design polished empty states for:

### No applications

**Create your first application**

“Describe what you need and Gather will build it for you.”

**Create application**

### No responses

**Your applications are live.**

“Responses will appear here when someone submits an application.”

### No drafts

Simple, minimal state.

---

# RESPONSIVE DESIGN

Design the core product for:

* Desktop
* Tablet
* Mobile

The creator/editor is desktop-first.

The applicant experience is mobile-first.

The public application should work beautifully on mobile.

---

# COMPONENTS

Create reusable components throughout the interface:

* Buttons
* Inputs
* AI prompt
* Cards
* Question cards
* Dropdowns
* Status badges
* Tabs
* Modals
* Toasts
* Tables
* Sidebar
* Header
* Empty states
* Loading states
* Confirmation dialogs

Keep component styling consistent.

---

# IMPORTANT UX RULES

1. **Never overwhelm the user.**
2. AI generation should be the fastest path.
3. The dashboard should immediately answer: **“What do you want to create?”**
4. Templates are secondary to AI.
5. Editing should be simple.
6. Preview should look exactly like the applicant experience.
7. Publishing should take one or two actions.
8. Responses should be easy to scan.
9. Avoid unnecessary enterprise functionality.
10. Do not turn Gather into an ATS.
11. Do not turn Gather into a generic form builder.
12. Every major interaction should reinforce:

**Describe → Generate → Edit → Publish → Gather responses**

---

# MVP SCOPE

Only implement the following core capabilities in the product UI:

### Creation

* AI application generation
* Templates
* Natural-language prompt

### Editing

* Add/edit/delete questions
* Reorder
* Required/optional
* Basic field types
* AI editing

### Publishing

* Preview
* Public URL
* Publish/unpublish
* QR code

### Applicant

* Application form
* File upload
* Submit
* Confirmation

### Management

* Application list
* Responses
* Applicant detail
* Status
* Notes

### Basic

* Email notifications
* CSV export
* Basic analytics
* Basic branding

Do not add CRM, complex ATS functionality, payment, scheduling, advanced automation, integrations, or a large feature marketplace.

---

# FINAL DESIGN GOAL

The finished Gather product should feel like a **simple, premium AI-native SaaS product**.

A first-time user should be able to understand the entire product without a tutorial.

The ideal first experience is:

**Open Gather → see “What do you want to create?” → describe an application → AI generates it → edit if needed → preview → publish.**

The product should make users think:

**“That was much easier than creating this in Google Forms.”**
