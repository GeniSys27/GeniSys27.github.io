# GeniSys 2027 workshop website

Website, printable event poster, and call for research posters and presentations from undergraduate, master’s, and PhD students for GeniSys 2027 at Rice University in Spring 2027. The workshop explores AI, systems, and networking for a sustainable future.

**Confirmed event:** GeniSys 2027, Spring 2027. The exact date remains to be announced. Track remaining decisions in [PROGRESS.md](PROGRESS.md).

## Included

- Responsive workshop website with phone, tablet, and desktop layouts, touch-friendly section navigation, research topics, a tentative program, and organizers.
- A dedicated [schedule page](https://genisys27.github.io/schedule.html) with a clear 9:00 am–5:00 pm timetable, session durations, and planned formats.
- Venue information and a responsive Google Map for the Ralph S. O’Connor Building for Engineering and Science, fifth-floor conference room.
- A homepage submission section with matching poster and student presentation buttons, presentation slide limits, poster details, and an expandable poster upload form.
- One-page PDF call for research posters and presentations from undergraduate, master’s, and PhD students, with separate clickable submission links, requirements, and a QR code for printed copies. The full plain-text call remains available.
- A3 event poster with a browser print / Save PDF control.
- A coordinated logo, browser tab icons, and touch icon; see [BRANDING.md](BRANDING.md).
- [Progress checklist](PROGRESS.md) and [change history](CHANGELOG.md).

## Preview locally

No package installation or build step is required. From the repository root, run:

```sh
python3 -m http.server 8765
```

Open [the website](http://localhost:8765/), [the printable poster](http://localhost:8765/poster.html), or [the PDF submission call](http://localhost:8765/output/pdf/genisys-2027-call-for-submissions.pdf).

For the event poster, select **Event poster**, then **Print / Save PDF**. Choose A3 portrait, disable browser headers and footers, and enable background graphics. Printing behavior depends on the browser; use a browser with print support if the embedded preview does not open a print dialog.

## Edit the materials

| File | Purpose |
| --- | --- |
| `index.html` | Workshop page, tentative program, and submission call |
| `schedule.html` | Detailed tentative schedule; homepage summarizes morning, lunch, and afternoon |
| `styles.css` | Website styling and responsive layout |
| `poster.html` | Printable event poster |
| `poster.css` | Poster styling and A3 print layout |
| `script.js` | Section navigation, sticky-header offsets, and poster print action |
| `genisys-2027-call-for-posters.txt` | Downloadable call for research posters and presentations; original URL retained for existing links |
| `output/pdf/genisys-2027-call-for-submissions.pdf` | One-page PDF call linked from the homepage and event poster toolbar |
| `scripts/build-call-pdf.py` | Rebuild the PDF with ReportLab; reads links and deadline from `workshop.json` |
| `assets/` | Campus photograph, logo, browser tab icons, and touch icon |
| `.nojekyll` | Publish the static files directly without Jekyll processing |
| `workshop.json` | Poster upload link, student presentation submission link, and shared submission deadline |
| `scripts/update-submission.mjs` | Synchronize both submission destinations across the homepage, schedule, event poster, and downloadable call |

Update the website, schedule, printable poster, and downloadable call together when dates, eligibility, or submission details change. If the event is renamed, also update page titles, metadata, filenames, download links, and this documentation.

### Rebuild the PDF call

After changing submission settings, synchronize the HTML and text call, then rebuild the PDF:

```sh
node scripts/update-submission.mjs
python3 scripts/build-call-pdf.py
```

The PDF builder requires the Python `reportlab` package and embeds the sans-serif fonts included with that package. Its program and research-theme copy is maintained in the builder; update it alongside the HTML and text call when those details change. It supports pending links and deadlines as well as configured values. Render the PDF and inspect it before publishing, for example with `pdftoppm -png output/pdf/genisys-2027-call-for-submissions.pdf /tmp/genisys-call`. Commit the regenerated PDF with the source changes. Viewing or serving the checked-in site does not require ReportLab or a build step.

## Current content status

The venue is the fifth-floor conference room in Rice University’s Ralph S. O’Connor Building for Engineering and Science. The embedded Google Map marks the building; a direct Google Maps link is available as a fallback.

Separate organizer-provided links handle research poster uploads and research presentation submissions from undergraduate, master’s, and PhD students. The **Upload your research** panel includes a PPTX presentation link and a separate embedded PPTX poster form; direct links to `#poster-upload` open that panel automatically. Both destinations appear on the printable event poster and in the downloadable call. The recommended research poster size is 36 in wide × 48 in tall (portrait; approximately 91 × 122 cm). Both submission types are due January 10, 2027. Both presentations and research posters must be PPTX files. The exact event date remains to be announced. The program is tentative and runs from 9:00 am to 5:00 pm Houston (Central Time), with all sessions held sequentially. Three external speakers have 45-minute slots at 9:00 am, 11:45 am, and 1:15 pm, including introductions, Q&A, and transitions. Lunch is 12:30–1:15 pm, with coffee breaks at 10:30–10:45 am and 2:45–3:00 pm. Posters and demos finish the day from 4:00 to 5:00 pm.

Eight undergraduate/master’s presentations occupy two one-hour sessions, from 10:45 to 11:45 am and 3:00 to 4:00 pm, with four 15-minute slots in each. Six PhD presentations occupy two 45-minute sessions, from 9:45 to 10:30 am and 2:00 to 2:45 pm, with three speakers in each. PhD slots are provisionally 15 minutes each. For all student talks, the suggested format is 10–12 minutes presenting, with the remaining time for Q&A and transition. Separate registration, welcome, roundtable, and closing blocks are not scheduled in this draft. Potential speakers are omitted until confirmed. Hybrid workshop participation is planned; remote poster arrangements are unconfirmed.

The public website repository is [GeniSys27/GeniSys27.github.io](https://github.com/GeniSys27/GeniSys27.github.io). The site is live at [genisys27.github.io/](https://genisys27.github.io/), verified September 29, 2026. The previous [planning repository](https://github.com/YukeWang96/Genisys-Workshop-Spring-2027) remains available separately.

GitHub Pages publishes the repository root. The `.nojekyll` marker keeps the HTML, CSS, JavaScript, and assets as static files. Local Sites account metadata is excluded from Git; the original proposals, budgets, and CVs are not included in this repository.

## Publish updates with GitHub Pages

The Pages address is `https://genisys27.github.io/`, published from the `GeniSys27.github.io` repository owned by the `GeniSys27` organization.

GitHub Pages publishes the root-level `index.html`, supporting pages, styles, scripts, and assets whenever `main` is pushed. No custom workflow, package installation, custom domain, or paid hosting is required for this public repository.

After renaming or transferring the website repository, update the public URLs in the pages and downloadable call and the local Git remote, then verify the Pages source before publishing again.

Configure **Settings → Pages → Build and deployment → Source → Deploy from a branch**, choose **main** and **/ (root)**, then select **Save**. Future pushes publish automatically through GitHub’s managed **pages build and deployment** workflow. Wait for a successful deployment before checking the public URL.

For later content changes, preview locally and commit the updated files, then run:

```sh
git push origin main
```

In this checkout, `origin` points to `GeniSys27/GeniSys27.github.io`; `previous-site` preserves `YukeWang96/GeniSys.github.io`, and `planning` preserves the original planning repository remote. Relative URLs keep the site, assets, printable poster, and downloads working at the organization site root. The configured destinations handle poster and student presentation submissions.

## Responsive layout

The homepage and schedule use fluid spacing and typography, with a stacked hero and agenda at 900px and phone layouts at 600px. Research themes simplify at 1100px; very narrow phones receive additional adjustments at 380px. Key navigation and primary controls have touch targets of at least 44px. The header becomes non-sticky in short landscape viewports. The printable poster retains its A3 print rules.

The campus photo has 600px, 1000px, and 1800px sources; browsers choose a suitable image for the viewport and display density. Native links, keyboard focus, pinch zoom, reduced-motion preferences, and direct Box/Google Maps links remain available.

Checked the homepage and schedule in browser viewport simulations from 320px to 1920px, including portrait tablets and landscape phones. Checks cover overflow, local links, agenda content, upload disclosure, and direct upload anchors; they do not replace testing on every physical device or browser.

## Configure the Box upload link

To change the configured Box upload URL:

1. Set `boxUploadUrl` in `workshop.json` to the complete HTTPS Box URL.
2. Run `node scripts/update-submission.mjs` from the repository root. Node.js 18 or newer is sufficient; no package installation is needed.
3. Rebuild the PDF with `python3 scripts/build-call-pdf.py`, verify that the Box page accepts uploads from the intended participants, then commit the configuration and updated materials together.

This updates the **Submit a poster** button, the expandable embedded form and its direct-link fallback, the printable poster, and the downloadable call. The poster-only embed uses the supplied 800 by 550 dimensions and scales to the available width. The website remains static; Box handles file uploads. Navigation, the native disclosure control, and direct links work without the website's JavaScript, while the Box form may require scripts and cookies from Box.

Leave `boxUploadUrl` as an empty string and run the same command to keep or restore the forthcoming state. The script validates the URL and content markers before writing changes. Do not edit inside the `box:` comment markers directly; those sections are regenerated. The exact workshop date remains to be announced. Submission deadlines and accepted file formats are separate from link availability.

## Configure the submission deadline

Set `submissionDeadline` in `workshop.json` to an ISO date (`YYYY-MM-DD`), then run `node scripts/update-submission.mjs` and `python3 scripts/build-call-pdf.py`. This updates the shared deadline on the homepage, schedule, event flyer, and both downloadable calls. Use an empty string while the deadline is pending. Dates are displayed with the month spelled out; no cutoff time has been specified.

## Submission filenames

Use `Presentation_First_Lastname_Level.pptx` for research presentations and `Poster_First_Lastname_Level.pptx` for research posters. Replace `First` and `Lastname` with the presenter’s name, and `Level` with one of `Undergrad`, `Master`, or `PhD`. The slashes in the original naming request indicate alternatives, not literal filename characters. Both submission types use PPTX.

## Configure student presentation submissions

Research presentations from undergraduate, master’s, and PhD students must be submitted as PPTX files with fewer than 15 slides (maximum 14). This requirement appears beside the submission buttons, on the event poster, and in the downloadable call.

The homepage’s `#posters` section and the bottom of the schedule have matching buttons for research presentation submissions and poster submissions. Set `studentPresentationUrl` in `workshop.json` to the organizer-provided HTTPS submission form, then run `node scripts/update-submission.mjs` and `python3 scripts/build-call-pdf.py`. These scripts also update the presentation link on the printable event poster and in both downloadable calls. The destination can be hosted on Box or another service. This setting is independent of the poster upload link.

Leave `studentPresentationUrl` empty while the destination is pending. Both pages then show a disabled presentation button and a message that its submission link will be announced. The event poster and downloadable call also show the pending status. Do not edit inside the `presentation:` markers directly; the script regenerates those links. No student presentation files are collected by the static website itself.

## Image credit

Campus photograph: Daderot, *Rice University - Sally Port*, public domain. [Source and reuse information](https://commons.wikimedia.org/wiki/File:Rice_University_-_Sally_Port.JPG).
