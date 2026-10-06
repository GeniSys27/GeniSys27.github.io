# GeniSys 2027 workshop progress

Last updated: October 6, 2026

## First version

- [x] Create the workshop website and responsive layout.
- [x] Add research topics and the tentative one-day program.
- [x] Add the three workshop organizers.
- [x] Draft the call for research posters.
- [x] Welcome recent research and previously published work.
- [x] Keep unconfirmed dates, deadlines, and submission details to be announced.
- [x] Create a printable event poster and downloadable call text.
- [x] Create and visually verify a downloadable PDF call for research with both submission formats, current requirements, and clickable links.
- [x] Check local page references, JavaScript syntax, mobile overflow, and FAQ keyboard interaction.
- [x] Add repository documentation and progress tracking.

## Website layout and submission workflow

- [x] Put event timing, venue, and format together at the top of the page.
- [x] Add persistent navigation and a clear poster submission entry point.
- [x] Group eligibility, preparation, requirements, questions, and Box upload into one section.
- [x] Present the tentative agenda in morning and afternoon columns with the poster session highlighted.
- [x] Verify desktop and phone navigation, keyboard FAQ controls, and Box form loading without submitting files.

- [x] Add the organizer-provided Google Map with a direct-link fallback.
- [x] Add a dedicated tentative schedule page and a concise homepage overview.
- [x] Verify the new pages at desktop and 320px widths, map loading, section highlighting, cross-page links, all ten agenda sessions, and Box configuration compatibility.

## Responsive experience

- [x] Simplify the website and schedule, reduce repeated copy, and make embedded uploads optional to expand.
- [x] Verify the simplified homepage and schedule at 18 page/viewport combinations, plus keyboard uploads, direct upload anchors, and configured/pending Box links.
- [x] Check the homepage, schedule, and printable poster across 45 page/viewport combinations, from 320px phones to 1920px desktops, including phone landscape.
- [x] Improve tablet layouts, phone submission details, and touch targets; keep all content within the viewport.
- [x] Add 600px and 1000px campus image variants and responsive source selection.
- [x] Preserve Box configuration compatibility, cross-page links, and the print stylesheet.

## Decisions needed before circulation

- [x] Confirm the event name and season: GeniSys 2027, Spring 2027.
- [ ] Confirm the exact workshop date in Spring 2027 and update all materials consistently.
- [x] Confirm the venue: Ralph S. O’Connor Building for Engineering and Science, fifth-floor conference room.
- [x] Set January 10, 2027 as the shared poster and undergraduate/master’s presentation submission deadline.
- [x] Confirm the submission channel: research posters are uploaded through Box.
- [x] Prepare one configuration entry to synchronize the Box link across the website, printable poster, and downloadable call.
- [x] Receive and connect the organizer-provided Box upload link.
- [x] Embed the Box upload form and provide a direct-link fallback.
- [x] Set PDF for research posters and PPTX for undergraduate/master’s presentations.
- [ ] Confirm any additional submission fields.
- [x] Recommend a standard research poster size: 36 in wide × 48 in tall (portrait).
- [ ] Confirm presentation arrangements and available display space.
- [ ] Approve the final call for posters and undergraduate/master’s presentations.

## Schedule refinement

- [x] Plan a continuous 9:00 am–5:00 pm workshop with explicit session durations and Q&A time.
- [x] Reserve 4:00–5:00 pm for the dedicated poster/demo session as the final event of the day.
- [x] Synchronize the homepage overview, schedule, printable poster, and downloadable call.
- [x] Allocate two hours for eight undergraduate/master’s presentations: four in the morning and four in the afternoon, with 15 minutes per student.
- [x] Add six PhD presentations from different research groups: three in the morning and three in the afternoon.
- [ ] Confirm the proposed 15-minute PhD slots, including Q&A and transitions; the draft reserves 90 minutes total.
- [x] Include three external speakers in 45-minute slots, with lunch and two coffee breaks in a sequential 9:00 am–5:00 pm program.
- [ ] Confirm the three external speakers and presentation titles; brief all presenters on timing and Q&A.

## Student presentation submissions

- [x] Add matching undergraduate/master’s research presentation and poster submission buttons at the bottom of the schedule.
- [x] Make both matching submission buttons and the presentation slide limit visible on the homepage at `#posters`.
- [x] Add a separate configurable HTTPS submission destination and a clearly marked pending state.
- [x] Connect the organizer-provided Box link for undergraduate/master’s research presentation submissions and activate the button.
- [x] Specify fewer than 15 slides (maximum 14) for undergraduate/master’s presentation decks.
- [x] Align navigation, page descriptions, the event poster, and downloadable call with both submission types and their separate destinations.
- [x] Rename the upload panel to “Upload your research,” with presentation and poster destinations clearly distinguished.
- [x] Add schedule-style alternating backgrounds and shadows to the homepage program overview.

## Program and launch

- [x] Create a GeniSys logo, browser tab icons, and touch icon.
- [x] Prepare the dedicated website repository and automatic Pages publishing.
- [x] Move the website to the repository root for branch-based Pages publishing.
- [x] Configure GitHub Pages to deploy from `main` and `/ (root)`.
- [ ] Confirm speakers before adding their names to the website.
- [ ] Finalize the schedule and poster/demo session.
- [ ] Confirm hybrid attendance and remote poster participation details.
- [ ] Verify the A3 print output in the intended printing browser.
- [x] Publish through GitHub Pages at [genisys27.github.io/](https://genisys27.github.io/).
- [x] Check published file contents, logo and icon assets, poster download, navigation, and Box form loading.
- [ ] Circulate the final announcement and submission call.

## How to track progress

GitHub Pages launched on September 29, 2026. The [initial deployment](https://github.com/YukeWang96/GeniSys.github.io/actions/runs/36594957630) used a custom GitHub Actions workflow. Publishing now uses **Deploy from a branch → main → / (root)**, so future pushes to `main` publish automatically. Local layout checks passed at 320px and 1440px, and the public site was verified at 1920px. The live Box form loaded; no files were submitted during verification.

Check off completed work in this file and summarize material changes in [CHANGELOG.md](CHANGELOG.md). Use GitHub Issues for tasks that need an owner or discussion, linking the issue from the relevant checklist item. Commit the related content changes together so that the website, poster, and call stay consistent.
