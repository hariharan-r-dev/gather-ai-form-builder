Update the existing Gather product UI and application management model to make Gather completely universal.

Do not change the established Gather brand, Geist typography, blue color system, navigation, spacing, or overall visual style.

## IMPORTANT PRODUCT PRINCIPLE

Gather is NOT a job application platform.

Gather is a general **AI Application Builder** that can create any type of application or structured submission.

Examples include:

* Job applications
* Scholarship applications
* Event registrations
* Speaker submissions
* Course applications
* Volunteer applications
* Community applications
* Grant applications
* Vendor applications
* Contest submissions
* Custom applications

The UI must never assume that every application is related to jobs, hiring, candidates, selection, or recruitment.

---

# APPLICATION TERMINOLOGY

Use generic terminology throughout the product.

Use:

**Application** = the form/application created by the user.

**Submission** = an individual completed application submitted by someone.

Avoid using:

* Applicant
* Candidate
* Hiring
* Shortlisted
* Rejected
* Selected

as default product terminology.

Those concepts may be relevant to some applications, but they must not be built into the core Gather experience.

---

# APPLICATION STATUS

Application-level status should only describe the state of the application itself.

Use:

* Draft
* Published
* Closed

These statuses apply universally.

Example:

**2026 Design Scholarship**
84 submissions
● Published

**UX Workshop Registration**
42 submissions
● Draft

**Conference Speaker Submissions**
126 submissions
● Closed

Do not add selection/rejection statuses to the application itself.

---

# SUBMISSION STATUS

Do NOT automatically create statuses such as:

* New
* Reviewing
* Shortlisted
* Rejected
* Accepted

for every application.

Different applications have different workflows.

For example:

A job application may need:
New → Reviewing → Shortlisted → Rejected

A scholarship may need:
Submitted → Under review → Awarded → Not selected

An event registration may need no workflow at all.

Therefore the default MVP experience should simply show:

**Submissions**

Each submission contains the submitted information.

If customizable workflows are added in the future, they should be optional and creator-defined.

Do not make them part of the default MVP.

---

# APPLICATIONS WORKSPACE

The Applications workspace should answer:

**“What applications have I created?”**

Main heading:

**Applications**

Supporting text:

**Manage and review all the applications you've created.**

Primary action:

**+ Create application**

Include:

* Search applications
* Filter by Draft / Published / Closed
* Sort by newest
* Sort by oldest
* Sort by recently updated
* Sort by name

Do NOT include:

* Filter by application type
* Job-specific filters
* Candidate filters

because Gather applications are universal.

---

# APPLICATION LIST

Each application should show:

* Application name
* Number of submissions
* Application status
* Created date
* Last updated date
* More actions

Example:

**2026 Design Scholarship**
84 submissions
● Published
Updated 2 hours ago

**UX Workshop Registration**
42 submissions
● Draft
Updated yesterday

**Tech Conference Speaker Submissions**
126 submissions
● Closed
Updated Aug 24

Do not show an “Application Type” field.

The application name should communicate what the application is for.

---

# APPLICATION DETAIL NAVIGATION

When opening an application, use:

**Build**
**Preview**
**Submissions**
**Settings**

Do not use:

**Applicants**

Use:

**Submissions**

because the product must work for every use case.

---

# SUBMISSIONS SCREEN

The screen should be generic.

Header:

**Submissions**

Show:

**128 submissions**

Provide:

* Search
* Basic filtering based on submitted fields
* Sort by submission date

Example:

Submission #128
Sarah Johnson
Submitted Aug 28

Submission #127
Rahul Kumar
Submitted Aug 28

Submission #126
Alex Thomas
Submitted Aug 27

The displayed identity should adapt to the fields collected by the application.

For example, if the application asks for a name, show the person's name.

If it is an anonymous submission, allow the submission to appear as:

**Submission #128**

Do not assume every submission is from an applicant/candidate.

---

# SUBMISSION DETAIL

Show:

* Submission date
* All submitted answers
* Uploaded files
* Contact information if collected
* Optional internal notes

Do not automatically show:

* Hiring score
* Candidate ranking
* Shortlist
* Rejection
* Selection

Keep the submission view universal.

---

# AI GENERATION

The AI should understand the application context from the user's description.

For example:

“Create an application for people who want to attend my UX workshop.”

Gather should automatically determine suitable questions.

Another example:

“Create a speaker submission form for a technology conference.”

Gather should create relevant questions.

Another:

“Create a scholarship application for undergraduate students.”

Gather should create relevant questions.

The creator should not have to manually select an “application type” before AI generation.

The AI should infer the context from the description.

---

# CORE PRODUCT MODEL

Maintain this universal structure:

**Describe what you need**
↓
**AI generates the application**
↓
**Edit**
↓
**Preview**
↓
**Publish**
↓
**Gather submissions**
↓
**Review submissions**

The product should always feel like a universal application/submission builder, not a recruitment tool.

---

# UX PRINCIPLE

Never assume what the application is for.

Let the creator define the purpose naturally through the AI prompt.

Gather's strength is:

**“Whatever you're collecting, just describe it. Gather builds it.”**
