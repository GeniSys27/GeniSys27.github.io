# GeniSys 2027 workshop progress

Last updated: October 12, 2026

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
- [x] Verify the new pages at desktop and 320px widths, map loading, section highlighting, cross-page links, agenda sessions, and Box configuration compatibility.

## Responsive experience

- [x] Simplify the website and schedule, reduce repeated copy, and make embedded uploads optional to expand.
- [x] Verify the simplified homepage and schedule at 18 page/viewport combinations, plus keyboard uploads, direct upload anchors, and configured/pending Box links.
- [x] Check the homepage, schedule, and printable poster across 45 page/viewport combinations, from 320px phones to 1920px desktops, including phone landscape.
- [x] Improve tablet layouts, phone submission details, and touch targets; keep all content within the viewport.
- [x] Add 600px and 1000px campus image variants and responsive source selection.
- [x] Preserve Box configuration compatibility, cross-page links, and the print stylesheet.

## Decisions needed before circulation

- [x] Confirm the event name and season: GeniSys 2027, Spring 2027.
- [x] Confirm the workshop timing as mid-February 2027 and update all materials consistently.
- [x] Confirm the venue: Ralph S. O’Connor Building for Engineering and Science, fifth-floor conference room.
- [x] Set January 10, 2027 as the shared poster and undergraduate/master’s presentation submission deadline.
- [x] Confirm the submission channel: research posters are uploaded through Box.
- [x] Prepare one configuration entry to synchronize the Box link across the website, printable poster, and downloadable call.
- [x] Receive and connect the organizer-provided Box upload link.
- [x] Embed the Box upload form and provide a direct-link fallback.
- [x] Accept PPTX or PDF for research posters; retain PPTX for research presentations.
- [x] Add submission filename templates with Undergrad, Master, PhD, or Postdoc suffixes and matching .pptx or .pdf poster extensions.
- [ ] Confirm any additional submission fields.
- [x] Recommend a standard research poster size: 36 in wide × 48 in tall (portrait).
- [ ] Confirm presentation arrangements and available display space.
- [ ] Approve and circulate the final call for posters and research presentations.

## Schedule refinement

- [x] Plan a continuous 9:00 am–5:00 pm workshop with explicit session durations and Q&A time.
- [x] Reserve 4:00–5:00 pm for the dedicated poster/demo session as the final event of the day.
- [x] Synchronize the homepage overview, schedule, printable poster, and downloadable call.
- [x] Reserve three 45-minute research presentation sessions at 9:45–10:30 am, 1:00–1:45 pm, and 3:00–3:45 pm, with up to three talks each and 15 minutes per presenter including Q&A and transition.
- [x] Reserve a 75-minute lunch and discussion period from 11:45 am to 1:00 pm and two 30-minute coffee breaks at 10:30–11:00 am and 2:30–3:00 pm.
- [x] Reserve open discussion and transition from 3:45 to 4:00 pm before the poster/demo session.
- [ ] Finalize the allocation of up to 9 research talks, including student and postdoctoral presenters, based on submissions.
- [x] Include three invited speaker slots at 9:00–9:45 am, 11:00–11:45 am, and 1:45–2:30 pm in a sequential 9:00 am–5:00 pm program.
- [ ] Confirm the three external speakers and presentation titles; brief all presenters on timing and Q&A.

## Research presentation submissions

- [x] Broaden both submission formats to undergraduate, master’s, and PhD students and postdoctoral researchers across all materials.
- [x] Add matching undergraduate/master’s research presentation and poster submission buttons at the bottom of the schedule.
- [x] Make both matching submission buttons and the presentation slide limit visible on the homepage at `#posters`.
- [x] Add a separate configurable HTTPS submission destination and a clearly marked pending state.
- [x] Connect the organizer-provided Box link for undergraduate/master’s research presentation submissions and activate the button.
- [x] Specify a maximum of 14 slides for research presentation decks.
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
- [x] Verify the updated event poster prints on one A3 page in Chrome.
- [x] Publish through GitHub Pages at [genisys27.github.io/](https://genisys27.github.io/).
- [x] Check published file contents, logo and icon assets, poster download, navigation, and Box form loading.
- [ ] Circulate the final announcement and submission call.

## Feedback revisions - October 12, 2026

- [x] Explicitly welcome postdoctoral researchers in both submission formats and add the Postdoc filename level.
- [x] Make clear that submitted slides and posters need not be final and may be refined before the workshop.
- [x] Welcome research in progress and research-oriented course projects, alongside recent and previously published work.
- [x] Emphasize research feedback, presentation practice, and potential collaborators.
- [x] Replace fixed public career-stage quotas with up to 9 research talks; encourage undergraduate/master’s participation.
- [x] Update the workshop timing to mid-February 2027; retain invited speakers as to be announced.
- [x] Draft the revised announcement email in the parent workspace’s output/email directory.
- [x] Update the announcement draft and submission guidance to accept PPTX or PDF posters, with matching filename examples.
- [x] Verify the one-page PDF, clickable links, website layouts at 320/768/1440px, local links, and submission synchronization.
- [ ] Ask K2I faculty, advisers, and relevant course instructors to encourage students and postdocs to submit.

## How to track progress

GitHub Pages launched on September 29, 2026. The [initial deployment](https://github.com/YukeWang96/GeniSys.github.io/actions/runs/36594957630) used a custom GitHub Actions workflow. Publishing now uses **Deploy from a branch → main → / (root)**, so future pushes to `main` publish automatically. Local layout checks passed at 320px and 1440px, and the public site was verified at 1920px. The live Box form loaded; no files were submitted during verification.

Check off completed work in this file and summarize material changes in [CHANGELOG.md](CHANGELOG.md). Use GitHub Issues for tasks that need an owner or discussion, linking the issue from the relevant checklist item. Commit the related content changes together so that the website, poster, and call stay consistent.
