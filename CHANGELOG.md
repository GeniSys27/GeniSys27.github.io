# Changelog

## 0.8.15 - 2026-10-06

- Add matching teal chip, connected-node, and leaf icons to the three research themes.

## 0.8.14 - 2026-10-06

- Align the contact envelope icon beside the GeniSys 2027 logo in both page footers, including on mobile.

## 0.8.13 - 2026-10-06

- Remove the introductory sentence beneath the homepage’s “Posters & presentations” heading.

## 0.8.12 - 2026-10-06

- Add a gentle heartbeat pulse to the submission-status dot, with animation disabled for reduced-motion preferences.

## 0.8.11 - 2026-10-06

- Replace the footer email address buttons with compact envelope icons, labeled “Contact us” for assistive technology and hover.

## 0.8.10 - 2026-10-06

- Add a clickable contact email button for yuke.wang@rice.edu to the homepage and Schedule footers.

## 0.8.9 - 2026-10-06

- Set the shared submission deadline to January 10, 2027, and specify PPTX presentations and PDF research posters across the website, flyer, and downloadable call.
- Rename the upload panel to “Upload your research” and distinguish the presentation link from the embedded poster form.
- Match the homepage program overview to the schedule’s alternating backgrounds, rounded borders, and subtle shadows.

## 0.8.8 - 2026-10-06

- Separate schedule sessions with alternating light backgrounds, rounded borders, spacing, and subtle shadows; keep the poster session highlighted in mint.

## 0.8.7 - 2026-10-06

- Shorten the presentation submission label to “Submit a presentation” on the homepage, Schedule, and event flyer.

## 0.8.6 - 2026-10-06

- Make navigation, page descriptions, the Schedule submission section, the event flyer, and the downloadable call consistently cover posters and undergraduate/master’s research presentations.
- Include both submission destinations and the presentation slide limit in the event flyer and downloadable call; synchronize them through the configuration script.
- Add AI algorithm design and agent systems to the flyer and downloadable call, and retain poster-specific size and upload guidance.

## 0.8.5 - 2026-10-06

- Remove the redundant poster submission button from the Schedule page header; keep the matching submission buttons at the bottom.

## 0.8.4 - 2026-10-06

- Add matching poster and undergraduate/master’s research presentation submission buttons directly to the homepage’s existing `#posters` section.
- Show the presentation slide limit on the homepage, clarify poster-only upload guidance, and label homepage navigation for both submission types.

## 0.8.3 - 2026-10-06

- Give poster and undergraduate/master’s presentation submissions matching navy buttons with equal widths and heights, including when labels wrap on phones.

## 0.8.2 - 2026-10-06

- Specify fewer than 15 slides (maximum 14) for undergraduate/master’s presentation submissions, beside the submission button and in the downloadable call.

## 0.8.1 - 2026-10-06

- Activate the undergraduate/master’s research presentation submission button with the organizer-provided Box link.

## 0.8.0 - 2026-10-06

- Add a dedicated undergraduate/master’s research presentation submission button at the bottom of the schedule, with a separately configurable destination and a pending state until the link is supplied.
- Expand the Efficient AI theme to include AI algorithm design and agent systems.
- Clarify a sequential 9:00 am–5:00 pm schedule with three external speakers in 45-minute slots, lunch, and two coffee breaks.
- Allocate two one-hour sessions to eight undergraduate/master’s presentations, four per session in 15-minute slots.
- Add six PhD presentations from different research groups, three each morning and afternoon, with proposed 15-minute slots including Q&A and transitions.
- Finish with posters and demos from 4:00 to 5:00 pm; replace the earlier standalone keynote, welcome, roundtable, and closing blocks with the revised program.
- Synchronize the homepage, printable poster, and downloadable call; add session durations and adapt time labels for desktop and phone layouts.

## 0.7.0 - 2026-09-29

- Reduce homepage text by approximately 60%, removing repeated descriptions, submission steps, and FAQs while retaining event and submission details.
- Simplify the hero, research themes, program overview, venue, organizers, and schedule with consistent spacing and quieter typography.
- Give poster submissions one primary Box link and keep the embedded upload form in an accessible native disclosure; preserve direct links to the form.
- Retain responsive layouts, all ten tentative schedule sessions, poster dimensions, venue map, and pending dates and deadlines.

## 0.6.1 - 2026-09-29

- Publish the workshop from `GeniSys27/GeniSys27.github.io` at `https://genisys27.github.io/`.
- Update canonical URLs, social metadata, the downloadable schedule link, and documentation for the organization address.
- Retain the root-level website files and `main` / `/ (root)` Pages publishing setup.

## 0.6.0 - 2026-09-29

- Move `index.html`, the schedule, printable poster, styles, scripts, downloads, and assets from `dist` to the repository root.
- Replace the custom deployment workflow with GitHub Pages publishing from `main` and `/ (root)`; add `.nojekyll` for direct static-file publishing.
- Update the Box synchronization script, local preview instructions, and asset documentation for the new file layout.

## 0.5.3 - 2026-09-29

- Update the deployment repository check after the website repository was renamed to `YukeWang96/GeniSys.github.io`.
- Use the corresponding Pages project address in page metadata, the downloadable schedule link, and publishing documentation.

## 0.5.2 - 2026-09-29

- Replace the G-shaped logo with a navy-and-mint network symbol across the website, browser tab icons, and touch icon.
- Version the icon URLs to refresh previously cached artwork.

## 0.5.1 - 2026-09-29

- Recommend 36 in wide × 48 in tall research posters (portrait; approximately 91 × 122 cm) in the submission panel, preparation guidance, and downloadable call.

## 0.5.0 - 2026-09-29

- Adapt spacing, hero layout, topic cards, submission details, venue, and schedule for phone, tablet, and desktop widths.
- Enlarge navigation and primary control touch targets to at least 44px and stack phone actions and poster details for easier reading.
- Keep the header out of the way in short landscape viewports; retain active-section indicators and reduced-motion support.
- Serve responsive campus image sizes and discover font stylesheets earlier to improve loading.
- Avoid redundant layout and navigation style updates during scrolling and resizing.
- Verify 45 page/viewport combinations, including widths from 320px to 1920px and landscape phones, without horizontal overflow or clipped content.

## 0.4.0 - 2026-09-29

- Confirm the venue as the fifth-floor conference room in Rice University’s Ralph S. O’Connor Building for Engineering and Science.
- Add the supplied responsive Google Maps embed and a direct Google Maps link.
- Add a separate schedule page retaining the ten tentative sessions, with the exact date and speakers still to be announced.
- Replace the homepage’s full agenda with a compact overview linking to the schedule, and add venue navigation.
- Update the printable poster, downloadable call, and progress tracker with the venue.
- Keep section highlighting compatible with links to separate pages and fix active-section updates on wide screens and after resizing.

## 0.3.0 - 2026-09-29

- Move ongoing website publishing to the dedicated `YukeWang96/GeniSys27` repository while preserving the existing commit history and previous planning remote.
- Add automatic GitHub Pages deployment from `main`, publishing only the static `dist` directory.
- Generate a coordinated GeniSys logo, integrate the mark into the header and footer, and add 16px/32px browser icons and a touch icon.
- Add the public site URL to metadata and document branding assets and the publishing workflow.
- Retain Spring 2027, the Box upload form, and all unconfirmed event details.

## 0.2.0 - 2026-09-29

- Simplify the homepage with a clearer event summary and primary poster submission action.
- Add persistent navigation with active-section indicators and anchors that account for the header height.
- Consolidate the poster call into a three-step workflow, requirements summary, FAQs, and an embedded Box submission area.
- Replace the long agenda with morning and afternoon columns while retaining all ten scheduled sessions.
- Improve mobile typography, spacing, focus behavior, and narrow-screen navigation.
- Preserve the configurable Box URL, printable poster, downloadable call, and pending exact date and deadline.

## 0.1.4 - 2026-09-29

- Confirm the event as GeniSys 2027, taking place in Spring 2027.
- Update event branding, page metadata, season labels, the printable poster, and the poster call.
- Rename the downloadable call to `genisys-2027-call-for-posters.txt` and update its links and generation script.
- Keep the exact date and poster submission deadline to be announced.

## 0.1.3 - 2026-09-29

- Connect the organizer-provided Rice Box file request URL across all submission materials.
- Embed the Box upload form with responsive width, a descriptive title, and a direct-link fallback.
- Make the primary upload button lead to the embedded form.

## 0.1.2 - 2026-09-29

- Add a single Box upload URL setting and a command to synchronize all submission materials.
- Prepare an upload button that appears only after a valid Box URL is configured.
- Include the configured URL in the printable poster and downloadable call, with wrapping for long links.
- Preserve the forthcoming state while the organizer's URL is pending.

## 0.1.1 - 2026-09-29

- Specify Box upload as the research poster submission channel across the website, printable poster, and downloadable call.
- Keep the actual upload link marked to be announced until the organizer provides it.
- Update the progress checklist and instructions for connecting the Box link.

## 0.1.0 - 2026-09-29

First website draft:

- Workshop homepage with Rice campus photography, research topics, tentative agenda, and organizers.
- Call for research posters welcoming recent and previously published work.
- Downloadable call text and an A3 event poster with a print control.
- Responsive layout, keyboard-accessible FAQ, and image attribution.
- Progress checklist documenting the event-year discrepancy and unconfirmed logistics.

Dates, deadlines, submission details, and speaker confirmations remain pending. This version retains the GeniSys 2026 wording from the proposal.
