Update the existing Gather application editor. Do not redesign the overall product or change the existing Gather branding, Geist typography, blue color system, navigation, or general visual style.

The current application editor has an important UX problem: when a creator selects a field type such as Multiple Choice, the editor only shows the field type and Required toggle. It does not provide a way for the creator to define the actual answer options.

Fix the question editor so every question clearly has two concepts:

**Question**
What the creator asks.

**Answer**
How the applicant will answer it.

## Question card structure

Redesign each question card with this hierarchy:

1. Question label
2. Question text input
3. Answer label
4. Answer configuration based on the selected answer type
5. Answer type selector
6. Required toggle
7. Duplicate / Delete controls

Example:

Question

“What is your experience level?”

Answer

○ Beginner
○ Intermediate
○ Advanced

* Add option

[ Multiple choice ▾ ]    Required ○

Duplicate    Delete

Keep the card clean, spacious, and easy to scan.

## Multiple choice

When Multiple choice is selected, show:

Answer options

○ Beginner
○ Intermediate
○ Advanced

* Add option

Each option should be editable.

Allow:

* Edit option text
* Add option
* Delete option
* Reorder options

The creator should be able to easily create any number of answer choices.

## Single choice

Show radio-style options.

Example:

Question:
“Are you currently employed?”

Answer:

○ Yes
○ No

* Add option

## Dropdown

Show editable options but preview the applicant answer as a dropdown.

Example:

Question:
“What is your current role?”

Answer options:

UX Designer
Product Designer
UI Designer
UX Researcher

* Add option

## Checkbox

Show checkbox-style options.

Example:

Question:
“Which tools do you use?”

Answer options:

☐ Figma
☐ Sketch
☐ Adobe XD
☐ Framer

* Add option

Allow multiple selections.

## Short answer

Do not show answer choices.

Instead show a small applicant-style preview:

Question:
“What is your current job title?”

Answer:

[ Product Designer ]

Allow the creator to optionally define placeholder text.

## Long answer

Show:

Question:
“Tell us about your design experience.”

Answer:

[ Write your answer here... ]

Allow optional placeholder text.

## Email

Show:

Question:
“What is your email address?”

Answer:

[ [name@example.com](mailto:name@example.com) ]

The applicant-facing input should clearly communicate that an email address is expected.

## Phone

Show:

Question:
“What is your phone number?”

Answer:

[ +91 98765 43210 ]

## Number

Show:

Question:
“How many years of experience do you have?”

Answer:

[ 0 ]

## URL

Show:

Question:
“Portfolio URL”

Answer:

[ https://yourportfolio.com ]

## Date

Show:

Question:
“When can you start?”

Answer:

[ Select a date ]

## File upload

Show:

Question:
“Upload your resume”

Answer:

[ Upload file ]

Also allow simple configuration for:

* Accepted file types
* Maximum file size

Keep this configuration minimal.

## Checkbox as a consent field

Allow a checkbox question to also work as a consent/confirmation question.

Example:

☐ I confirm that the information provided is accurate.

## Answer type selector

Change the label from:

“Choose field type”

to:

**“Answer type”**

The selector should contain:

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

## AI-generated questions

This is especially important for Gather.

When AI generates an application, it should automatically generate both:

**Question**
and
**Answer configuration**

For example:

Question:
“What is your experience level?”

Answer options:

* Beginner
* 1–2 years
* 3–5 years
* 5+ years

The creator should only need to review and edit the generated options.

Do not make the creator manually configure answer choices for AI-generated questions.

## Applicant preview distinction

Make it visually clear that the creator is configuring the applicant experience.

The editor should show the creator:

Question → Answer configuration

The Preview mode should show:

Question → Actual applicant input

For example, in Preview:

“What is your experience level?”

○ Beginner
○ 1–2 years
○ 3–5 years
○ 5+ years

This should look exactly like the public application.

## UX principles

* Make Question and Answer visually distinct.
* Never hide answer configuration.
* Make multiple-choice options immediately visible.
* Keep editing inline.
* Avoid opening unnecessary modals for simple edits.
* Keep the editor lightweight.
* AI-generated answer options should be editable.
* Manual editing and AI editing should work together.
* Preserve the existing Gather visual language.

The overall experience should communicate:

**Question = What do I want to ask?**

**Answer = How should the applicant respond?**
