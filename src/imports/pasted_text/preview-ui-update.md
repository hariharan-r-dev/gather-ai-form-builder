UPDATE THE FORM PREVIEW MODE UI TO MATCH THE PROVIDED REFERENCE AND THE REQUIREMENTS BELOW.

IMPORTANT:
This applies ONLY to the form/application PREVIEW experience.
Do not change the builder/editor layout.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. PREVIEW TOP NAVIGATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When the user clicks "Preview", show a dedicated preview navigation bar.

The navigation should have three clear areas:

LEFT:
← Back

CENTER:
Desktop | Mobile
Section switcher
Exit preview

RIGHT:
Keep only actions that are genuinely necessary for preview.

Do NOT duplicate unnecessary Publish buttons inside the preview navigation.

The preview navigation should remain clean and minimal.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. LEFT SIDE — BACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

At the far left of the preview navigation:

← Back

Clicking Back should return the user to the form builder/editor.

Preserve the current application and all unsaved/autosaved changes.

Do not create a new application or reset the form.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. CENTER — DEVICE SWITCHER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Place the device switcher prominently in the center:

[ Desktop ] [ Mobile ]

Desktop is selected by default.

Clicking Desktop:
→ show the form in desktop preview width.

Clicking Mobile:
→ show the form inside a realistic mobile-width preview.

The mobile option should actually change the preview viewport rather than simply changing the button appearance.

The selected device must have the existing Gather blue/selected treatment.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. SECTION SWITCHER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add a section navigation control in the preview navigation.

The user should be able to switch between application sections while previewing.

For example:

Personal Information
Background
Experience
Additional Questions

The currently selected section should be visually indicated.

Clicking another section should display that section's questions in the preview.

Do NOT expose builder controls such as:

- Add question
- Edit question
- Drag handles
- Kebab menus
- Add section

Preview must remain a respondent-facing experience.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. EXIT PREVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add:

Exit preview

to the preview navigation.

Clicking it should return the user to the builder/editor.

This should behave differently from Back only in labeling/placement if necessary, but both must safely return to the editor without losing data.

Do not navigate to the dashboard.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. FORM PREVIEW CONTENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Keep the actual form preview clean and respondent-facing.

Show:

Application title
Application description
Sections
Questions
Input fields
Required indicators

Use the existing Gather visual design system.

Do NOT show builder-only UI inside the form itself.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. GATHER BRANDING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add Gather branding to the preview form.

The branding should appear alongside the form/application branding area in a subtle, professional way.

For example:

[Application title]                         Powered by Gather

The branding should not overpower the customer's/application content.

Use the existing Gather typography and blue accent.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. HIDE BRANDING BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next to the Gather branding, add:

Hide branding

This is a paid-plan feature.

When the user clicks "Hide branding":

DO NOT immediately hide the branding.

Instead open a pricing/upgrade modal.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9. PRICING MODAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create a proper centered modal.

Overlay the current preview with a subtle backdrop.

Modal structure:

──────────────────────────────
                         ×

Remove Gather branding

Make your forms fully yours by
removing Gather branding from
your published forms.

[ Pricing / upgrade information ]

[ Upgrade plan ]

──────────────────────────────

The exact pricing should use the application's existing pricing/plan data.

Do NOT hardcode a fake price if pricing data already exists.

The modal must have:

- close × icon
- clear heading
- short explanation
- pricing/plan information
- primary upgrade CTA

Clicking ×:
→ close modal
→ return to preview
→ keep branding visible

Clicking outside the modal may also close it.

Pressing Escape should close it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
10. IMPORTANT — DO NOT HIDE BRANDING FOR FREE USERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For users who do not have the appropriate paid plan:

Clicking "Hide branding" must open the pricing modal.

Do NOT actually remove the branding.

Only users with the appropriate plan should be able to hide branding.

If an eligible paid user already has the branding-removal feature enabled, then "Hide branding" should work normally.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
11. PREVIEW LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Use a layout similar to the supplied reference:

TOP
──────────────────────────────────────────────
← Back       Desktop | Mobile
             Section selector
             Exit preview
──────────────────────────────────────────────

                    FORM
              ┌───────────────┐
              │ Application   │
              │ title         │
              │ description   │
              │               │
              │ Section       │
              │ Question      │
              │ [ input ]     │
              │               │
              │ ...           │
              └───────────────┘

For Desktop:
Keep the form centered with a comfortable max-width.

For Mobile:
Reduce the preview viewport to a realistic mobile width and center it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
12. RESPONSIVE BEHAVIOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Desktop preview:
- centered form
- generous spacing
- desktop-width content

Mobile preview:
- realistic phone-sized content width
- form remains completely usable
- inputs remain readable
- no horizontal overflow

The preview page itself should not horizontally scroll.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
13. VISUAL STYLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Match the existing Gather UI.

Use:

- existing typography
- existing border radius
- existing border colors
- existing blue accent
- existing neutral background
- existing button styling

Do not introduce a new design system.

Keep the preview more polished and respondent-facing than the editor.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
14. DO NOT BREAK EXISTING FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Do NOT change:

- application builder
- Ask Gather
- section ordering
- question ordering
- section kebab menus
- question kebab menus
- sidebar resizing
- autosave
- publishing
- submissions
- application settings
- dashboard

Preview should consume the existing application data and display it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCEPTANCE TEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open an application.
2. Click Preview.
3. Dedicated preview navigation appears.
4. Back is visible on the left.
5. Desktop/Mobile switcher is centered.
6. Switching to Mobile actually changes the preview viewport.
7. Section switcher lets the user move between sections.
8. Builder controls are not visible inside preview.
9. Exit preview returns to the builder.
10. Gather branding is visible in the form.
11. "Hide branding" is visible beside the branding.
12. Clicking "Hide branding" opens a pricing modal.
13. Branding remains visible behind the modal.
14. Modal has a close × button.
15. Clicking × closes the modal.
16. Clicking outside closes the modal.
17. Escape closes the modal.
18. Free/non-eligible users cannot remove branding without upgrading.
19. Existing paid-plan logic should be respected if already implemented.
20. No existing builder functionality is affected.

MOST IMPORTANT:
Treat Preview as a clean respondent-facing mode, not another version of the builder. The navigation should make it easy to go back, switch Desktop/Mobile, move between sections, and exit preview, while the Gather branding + paid "Hide branding" flow should be clearly separated from the form itself.